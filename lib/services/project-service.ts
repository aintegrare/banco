// =============================================================================
// 📁 lib/services/project-service.ts - SERVIÇO DE PROJETOS SIMPLIFICADO
// =============================================================================

import { createClient } from "@/lib/supabase/server"
import type { DbProject, Project, CreateProjectInput, UpdateProjectInput, ProjectFilters } from "@/lib/types"

export class ProjectService {
  private supabase = createClient()

  async getProjects(filters: ProjectFilters = {}): Promise<Project[]> {
    try {
      let query = this.supabase.from("projects").select("*").order("created_at", { ascending: false })

      if (filters.status?.length) {
        query = query.in("status", filters.status)
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      if (filters.limit) {
        const start = filters.offset || 0
        const end = start + filters.limit - 1
        query = query.range(start, end)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Erro ao buscar projetos: ${error.message}`)
      }

      return (data as DbProject[]).map(this.enrichProject)
    } catch (error) {
      console.error("Erro no ProjectService.getProjects:", error)
      throw error
    }
  }

  async getProjectById(id: number): Promise<Project> {
    try {
      const { data, error } = await this.supabase.from("projects").select("*").eq("id", id).single()

      if (error) {
        if (error.code === "PGRST116") {
          throw new Error(`Projeto com ID ${id} não encontrado`)
        }
        throw new Error(`Erro ao buscar projeto: ${error.message}`)
      }

      return this.enrichProject(data as DbProject)
    } catch (error) {
      console.error(`Erro no ProjectService.getProjectById(${id}):`, error)
      throw error
    }
  }

  async createProject(input: CreateProjectInput): Promise<Project> {
    try {
      if (!input.name?.trim()) {
        throw new Error("Nome do projeto é obrigatório")
      }

      const projectData = {
        name: input.name.trim(),
        description: input.description?.trim() || null,
        status: input.status || "planning",
        start_date: input.start_date || null,
        end_date: input.end_date || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        progress: input.progress || 0,
        color: input.color || "#4b7bb5",
      }

      const { data, error } = await this.supabase.from("projects").insert(projectData).select().single()

      if (error) {
        throw new Error(`Erro ao criar projeto: ${error.message}`)
      }

      return this.enrichProject(data as DbProject)
    } catch (error) {
      console.error("Erro no ProjectService.createProject:", error)
      throw error
    }
  }

  async updateProject(id: number, input: UpdateProjectInput): Promise<Project> {
    try {
      await this.getProjectById(id)

      const updateData: Partial<DbProject> = {
        updated_at: new Date().toISOString(),
      }

      if (input.name !== undefined) updateData.name = input.name.trim()
      if (input.description !== undefined) updateData.description = input.description?.trim() || null
      if (input.status !== undefined) updateData.status = input.status
      if (input.start_date !== undefined) updateData.start_date = input.start_date
      if (input.end_date !== undefined) updateData.end_date = input.end_date
      if (input.progress !== undefined) updateData.progress = input.progress
      if (input.color !== undefined) updateData.color = input.color

      const { data, error } = await this.supabase.from("projects").update(updateData).eq("id", id).select().single()

      if (error) {
        throw new Error(`Erro ao atualizar projeto: ${error.message}`)
      }

      return this.enrichProject(data as DbProject)
    } catch (error) {
      console.error(`Erro no ProjectService.updateProject(${id}):`, error)
      throw error
    }
  }

  async deleteProject(id: number): Promise<void> {
    try {
      const { error } = await this.supabase.from("projects").delete().eq("id", id)

      if (error) {
        throw new Error(`Erro ao deletar projeto: ${error.message}`)
      }
    } catch (error) {
      console.error(`Erro no ProjectService.deleteProject(${id}):`, error)
      throw error
    }
  }

  private enrichProject(dbProject: DbProject): Project {
    const now = new Date()
    const endDate = dbProject.end_date ? new Date(dbProject.end_date) : null

    return {
      ...dbProject,
      isOverdue: endDate ? endDate < now && dbProject.status !== "completed" : false,
      statusLabel: this.getStatusLabel(dbProject.status),
    }
  }

  private getStatusLabel(status: string): string {
    const labels = {
      planning: "Planejamento",
      planejamento: "Planejamento",
      active: "Ativo",
      ativo: "Ativo",
      on_hold: "Em Espera",
      pausado: "Em Espera",
      completed: "Concluído",
      concluído: "Concluído",
      cancelled: "Cancelado",
      cancelado: "Cancelado",
    }
    return labels[status as keyof typeof labels] || status
  }
}

export const projectService = new ProjectService()
