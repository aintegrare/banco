"use client"

// =============================================================================
// 📁 hooks/use-projects.ts - HOOK REACT PARA GERENCIAMENTO DE PROJETOS
// =============================================================================

import { useState, useCallback, useEffect } from "react"
import type { Project, ProjectFilters, CreateProjectInput, UpdateProjectInput, ProjectStatus } from "@/lib/types"

interface UseProjectsOptions {
  initialFilters?: ProjectFilters
  autoLoad?: boolean
}

export function useProjects(options: UseProjectsOptions = {}) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carregar projetos
  const loadProjects = useCallback(
    async (filters?: ProjectFilters) => {
      setIsLoading(true)
      setError(null)

      try {
        const searchParams = new URLSearchParams()
        const finalFilters = { ...options.initialFilters, ...filters }

        // Construir query string
        Object.entries(finalFilters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach((v) => searchParams.append(key, v.toString()))
            } else {
              searchParams.append(key, value.toString())
            }
          }
        })

        const response = await fetch(`/api/projects?${searchParams}`)

        if (!response.ok) {
          throw new Error(`Erro ao carregar projetos: ${response.status}`)
        }

        const result = await response.json()

        // Verificar se o resultado é um array (API legada) ou um objeto com data (nova API)
        if (Array.isArray(result)) {
          setProjects(result)
        } else if (result.success && Array.isArray(result.data)) {
          setProjects(result.data)
        } else if (Array.isArray(result.data)) {
          setProjects(result.data)
        } else {
          console.warn("Formato de resposta inesperado:", result)
          setProjects([])
        }
      } catch (err: any) {
        setError(err.message)
        console.error("Erro ao carregar projetos:", err)
      } finally {
        setIsLoading(false)
      }
    },
    [options.initialFilters],
  )

  // Buscar projeto por ID
  const getProject = useCallback(async (id: number | string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/projects/${id}`)

      if (!response.ok) {
        throw new Error(`Erro ao buscar projeto: ${response.status}`)
      }

      const result = await response.json()

      // Verificar se o resultado é um objeto de projeto (API legada) ou um objeto com data (nova API)
      if (result.id) {
        return result
      } else if (result.success && result.data) {
        return result.data
      } else {
        console.warn("Formato de resposta inesperado:", result)
        throw new Error("Formato de resposta inesperado")
      }
    } catch (err: any) {
      setError(err.message)
      console.error(`Erro ao buscar projeto ${id}:`, err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Criar projeto
  const createProject = useCallback(async (input: CreateProjectInput) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        throw new Error(`Erro ao criar projeto: ${response.status}`)
      }

      const result = await response.json()

      // Verificar se o resultado é um objeto de projeto (API legada) ou um objeto com data (nova API)
      let newProject: Project

      if (result.id) {
        newProject = result
      } else if (result.success && result.data) {
        newProject = result.data
      } else {
        console.warn("Formato de resposta inesperado:", result)
        throw new Error("Formato de resposta inesperado")
      }

      // Adicionar à lista local
      setProjects((prev) => [newProject, ...prev])

      return newProject
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  // Atualizar projeto
  const updateProject = useCallback(async (id: number | string, input: UpdateProjectInput) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        throw new Error(`Erro ao atualizar projeto: ${response.status}`)
      }

      const result = await response.json()

      // Verificar se o resultado é um objeto de projeto (API legada) ou um objeto com data (nova API)
      let updatedProject: Project

      if (result.id) {
        updatedProject = result
      } else if (result.success && result.data) {
        updatedProject = result.data
      } else {
        console.warn("Formato de resposta inesperado:", result)
        throw new Error("Formato de resposta inesperado")
      }

      // Atualizar lista local
      setProjects((prev) => prev.map((project) => (project.id === updatedProject.id ? updatedProject : project)))

      return updatedProject
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  // Atualizar status do projeto
  const updateProjectStatus = useCallback(
    async (id: number | string, status: ProjectStatus) => {
      // Atualização otimista
      setProjects((prev) => prev.map((project) => (project.id === Number(id) ? { ...project, status } : project)))

      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        })

        if (!response.ok) {
          // Se a API não suporta PATCH, tenta com PUT
          if (response.status === 405) {
            return await updateProject(id, { status })
          }
          throw new Error(`Erro ao atualizar status: ${response.status}`)
        }

        const result = await response.json()

        // Verificar se o resultado é um objeto de projeto (API legada) ou um objeto com data (nova API)
        let updatedProject: Project

        if (result.id) {
          updatedProject = result
        } else if (result.success && result.data) {
          updatedProject = result.data
        } else {
          console.warn("Formato de resposta inesperado:", result)
          throw new Error("Formato de resposta inesperado")
        }

        // Confirmar atualização
        setProjects((prev) => prev.map((project) => (project.id === updatedProject.id ? updatedProject : project)))

        return updatedProject
      } catch (err: any) {
        // Reverter atualização otimista em caso de erro
        await loadProjects()
        setError(err.message)
        throw err
      }
    },
    [loadProjects, updateProject],
  )

  // Atualizar progresso do projeto
  const updateProjectProgress = useCallback(
    async (id: number | string, progress: number) => {
      // Atualização otimista
      setProjects((prev) => prev.map((project) => (project.id === Number(id) ? { ...project, progress } : project)))

      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ progress }),
        })

        if (!response.ok) {
          // Se a API não suporta PATCH, tenta com PUT
          if (response.status === 405) {
            return await updateProject(id, { progress })
          }
          throw new Error(`Erro ao atualizar progresso: ${response.status}`)
        }

        const result = await response.json()

        // Verificar se o resultado é um objeto de projeto (API legada) ou um objeto com data (nova API)
        let updatedProject: Project

        if (result.id) {
          updatedProject = result
        } else if (result.success && result.data) {
          updatedProject = result.data
        } else {
          console.warn("Formato de resposta inesperado:", result)
          throw new Error("Formato de resposta inesperado")
        }

        // Confirmar atualização
        setProjects((prev) => prev.map((project) => (project.id === updatedProject.id ? updatedProject : project)))

        return updatedProject
      } catch (err: any) {
        // Reverter atualização otimista em caso de erro
        await loadProjects()
        setError(err.message)
        throw err
      }
    },
    [loadProjects, updateProject],
  )

  // Deletar projeto
  const deleteProject = useCallback(async (id: number | string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Erro ao deletar projeto: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success && !result.id) {
        throw new Error(result.error || "Erro ao deletar projeto")
      }

      // Remover da lista local
      setProjects((prev) => prev.filter((project) => project.id !== Number(id)))
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  // Agrupar projetos por status
  const projectsByStatus = useCallback(() => {
    return projects.reduce(
      (acc, project) => {
        const status = project.status as ProjectStatus
        if (!acc[status]) acc[status] = []
        acc[status].push(project)
        return acc
      },
      {} as Record<ProjectStatus, Project[]>,
    )
  }, [projects])

  // Auto-carregar na inicialização
  useEffect(() => {
    if (options.autoLoad !== false) {
      loadProjects()
    }
  }, [loadProjects, options.autoLoad])

  return {
    // Estado
    projects,
    isLoading,
    error,

    // Ações
    loadProjects,
    getProject,
    createProject,
    updateProject,
    updateProjectStatus,
    updateProjectProgress,
    deleteProject,

    // Utilitários
    projectsByStatus,

    // Estatísticas
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "active").length,
    completedProjects: projects.filter((p) => p.status === "completed").length,
    overdueProjects: projects.filter((p) => p.isOverdue).length,
  }
}
