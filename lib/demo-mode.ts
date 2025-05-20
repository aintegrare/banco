"use client"

import { useState, useEffect } from "react"

// Chave para armazenar o estado do modo de demonstração
const DEMO_MODE_KEY = "integrare-demo-mode"

// Dados de demonstração para diferentes entidades
const demoData = {
  tasks: [
    {
      id: "demo-1",
      title: "Criar campanha para redes sociais",
      description: "Desenvolver estratégia e conteúdo para campanha de lançamento no Instagram e Facebook",
      status: "in-progress",
      priority: "high",
      project_id: "demo-project-1",
      assigned_to: "Ana Silva",
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      estimated_hours: 8,
      tags: ["marketing", "social-media", "campaign"],
    },
    {
      id: "demo-2",
      title: "Otimizar SEO do site",
      description: "Analisar e implementar melhorias de SEO para aumentar o ranking nos motores de busca",
      status: "todo",
      priority: "medium",
      project_id: "demo-project-1",
      assigned_to: "Carlos Mendes",
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      estimated_hours: 12,
      tags: ["seo", "website", "optimization"],
    },
    {
      id: "demo-3",
      title: "Relatório mensal de desempenho",
      description: "Compilar dados e preparar relatório de desempenho para o cliente",
      status: "done",
      priority: "medium",
      project_id: "demo-project-2",
      assigned_to: "Mariana Costa",
      due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      estimated_hours: 4,
      tags: ["report", "analytics", "client"],
    },
  ],
  projects: [
    {
      id: "demo-project-1",
      name: "Lançamento E-commerce",
      description: "Estratégia de marketing digital para lançamento de loja online",
      client_id: "demo-client-1",
      status: "active",
      start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "demo-project-2",
      name: "Gestão de Redes Sociais",
      description: "Criação de conteúdo e gestão de comunidade para redes sociais",
      client_id: "demo-client-2",
      status: "active",
      start_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  clients: [
    {
      id: "demo-client-1",
      name: "Moda Express",
      email: "contato@modaexpress.exemplo",
      phone: "(11) 98765-4321",
      address: "Av. Paulista, 1000, São Paulo - SP",
      industry: "E-commerce",
      status: "active",
    },
    {
      id: "demo-client-2",
      name: "Café Especial",
      email: "contato@cafeespecial.exemplo",
      phone: "(11) 91234-5678",
      address: "Rua Augusta, 500, São Paulo - SP",
      industry: "Alimentação",
      status: "active",
    },
  ],
}

// Função para ativar o modo de demonstração
export function enableDemoMode(): void {
  localStorage.setItem(DEMO_MODE_KEY, "true")

  // Armazenar dados de demonstração no localStorage
  Object.entries(demoData).forEach(([key, value]) => {
    localStorage.setItem(`demo-data-${key}`, JSON.stringify(value))
  })
}

// Função para desativar o modo de demonstração
export function disableDemoMode(): void {
  localStorage.setItem(DEMO_MODE_KEY, "false")

  // Limpar dados de demonstração
  Object.keys(demoData).forEach((key) => {
    localStorage.removeItem(`demo-data-${key}`)
  })
}

// Verificar se o modo de demonstração está ativo
export function isDemoMode(): boolean {
  return localStorage.getItem(DEMO_MODE_KEY) === "true"
}

// Obter dados de demonstração para uma entidade específica
export function getDemoData<T>(entity: keyof typeof demoData): T[] {
  const data = localStorage.getItem(`demo-data-${entity}`)
  return data ? JSON.parse(data) : []
}

// Hook para usar o modo de demonstração em componentes
export function useDemoMode() {
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    // Verificar o estado inicial
    setDemoMode(isDemoMode())

    // Função para atualizar o estado quando o localStorage mudar
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === DEMO_MODE_KEY) {
        setDemoMode(e.newValue === "true")
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const toggleDemoMode = () => {
    if (demoMode) {
      disableDemoMode()
    } else {
      enableDemoMode()
    }
    setDemoMode(!demoMode)
  }

  return { demoMode, toggleDemoMode, getDemoData }
}
