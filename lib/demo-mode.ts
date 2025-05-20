"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "@/components/ui/use-toast"

// Interface para configuração do modo de demonstração
export interface DemoModeConfig {
  enabled: boolean
  demoData: {
    posts: any[]
    projects: any[]
    analytics: any
    [key: string]: any
  }
  restrictions: {
    allowEditing: boolean
    allowDeleting: boolean
    allowCreating: boolean
    allowExporting: boolean
    maxItems: number
  }
}

// Estado global do modo de demonstração
let demoModeState: DemoModeConfig = {
  enabled: false,
  demoData: {
    posts: [],
    projects: [],
    analytics: {},
  },
  restrictions: {
    allowEditing: true,
    allowDeleting: false,
    allowCreating: true,
    allowExporting: true,
    maxItems: 10,
  },
}

// Dados de demonstração padrão
const DEFAULT_DEMO_DATA = {
  posts: [
    {
      id: "demo-post-1",
      title: "Lançamento de Produto",
      content: "Estamos animados em anunciar o lançamento do nosso novo produto! Fiquem ligados para mais informações.",
      platform: "instagram",
      status: "scheduled",
      scheduledDate: new Date(Date.now() + 86400000).toISOString(), // Amanhã
      mediaUrls: ["/product-launch-excitement.png"],
      analytics: {
        likes: 0,
        comments: 0,
        shares: 0,
      },
    },
    {
      id: "demo-post-2",
      title: "Promoção de Verão",
      content: "Aproveite nossos descontos especiais de verão! Todos os produtos com até 40% de desconto.",
      platform: "facebook",
      status: "published",
      scheduledDate: new Date(Date.now() - 86400000).toISOString(), // Ontem
      mediaUrls: ["/summer-sale-display.png"],
      analytics: {
        likes: 245,
        comments: 56,
        shares: 78,
      },
    },
    {
      id: "demo-post-3",
      title: "Dicas de Sustentabilidade",
      content: "Confira nossas 5 dicas para um estilo de vida mais sustentável! #Sustentabilidade #MeioAmbiente",
      platform: "twitter",
      status: "draft",
      mediaUrls: [],
      analytics: {
        likes: 0,
        comments: 0,
        shares: 0,
      },
    },
  ],
  projects: [
    {
      id: "demo-project-1",
      name: "Campanha de Verão 2023",
      description: "Campanha promocional para produtos de verão",
      startDate: new Date(Date.now() - 7 * 86400000).toISOString(),
      endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      status: "active",
      platforms: ["instagram", "facebook", "twitter"],
      team: ["user1", "user2"],
    },
    {
      id: "demo-project-2",
      name: "Lançamento Linha Eco",
      description: "Lançamento da nova linha de produtos sustentáveis",
      startDate: new Date(Date.now() + 15 * 86400000).toISOString(),
      endDate: new Date(Date.now() + 45 * 86400000).toISOString(),
      status: "planning",
      platforms: ["instagram", "facebook"],
      team: ["user1", "user3"],
    },
  ],
  analytics: {
    overview: {
      totalReach: 12456,
      totalEngagement: 3872,
      totalConversions: 945,
      growthRate: 12.5,
    },
    platforms: {
      instagram: {
        followers: 5280,
        engagement: 3.2,
        reach: 7500,
        topPosts: ["demo-post-1"],
      },
      facebook: {
        followers: 8750,
        engagement: 2.8,
        reach: 12000,
        topPosts: ["demo-post-2"],
      },
      twitter: {
        followers: 3200,
        engagement: 1.9,
        reach: 5000,
        topPosts: [],
      },
    },
    trends: [
      { date: "2023-01-01", reach: 5000, engagement: 1500 },
      { date: "2023-02-01", reach: 5500, engagement: 1700 },
      { date: "2023-03-01", reach: 6200, engagement: 2100 },
      { date: "2023-04-01", reach: 7000, engagement: 2400 },
      { date: "2023-05-01", reach: 7800, engagement: 2900 },
      { date: "2023-06-01", reach: 8500, engagement: 3200 },
    ],
  },
}

// Funções para gerenciar o modo de demonstração
export const DemoMode = {
  // Verificar se o modo de demonstração está ativado
  isEnabled: (): boolean => {
    return demoModeState.enabled
  },

  // Ativar o modo de demonstração
  enable: (config?: Partial<DemoModeConfig>): void => {
    // Mesclar configuração fornecida com padrões
    demoModeState = {
      ...demoModeState,
      enabled: true,
      ...config,
      demoData: {
        ...DEFAULT_DEMO_DATA,
        ...(config?.demoData || {}),
      },
    }

    // Salvar estado no localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("demo_mode", JSON.stringify(demoModeState))
    }

    // Notificar o usuário
    toast({
      title: "Modo de Demonstração Ativado",
      description: "Você está usando dados de demonstração. Suas alterações não afetarão dados reais.",
      duration: 5000,
    })
  },

  // Desativar o modo de demonstração
  disable: (): void => {
    demoModeState.enabled = false
    if (typeof window !== "undefined") {
      localStorage.removeItem("demo_mode")
    }

    toast({
      title: "Modo de Demonstração Desativado",
      description: "Você voltou ao modo normal de operação.",
      duration: 3000,
    })
  },

  // Obter dados de demonstração
  getData: <T,>(collection: string): T[] => (demoModeState.demoData[collection] || []) as T[],

  // Adicionar ou atualizar item nos dados de demonstração
  updateData: <T extends { id: string }>(collection: string, item: T): T => {
    if (!demoModeState.enabled) {
      throw new Error("Modo de demonstração não está ativado")
    }

    // Verificar restrições
    if (!demoModeState.restrictions.allowEditing && !demoModeState.restrictions.allowCreating) {
      toast({
        title: "Operação não permitida",
        description: "Edição não é permitida no modo de demonstração atual.",
        variant: "destructive",
      })
      throw new Error("Edição não permitida no modo de demonstração")
    }

    // Verificar limite de itens
    const isNew = !demoModeState.demoData[collection]?.some((i: any) => i.id === item.id)
    if (isNew && demoModeState.demoData[collection]?.length >= demoModeState.restrictions.maxItems) {
      toast({
        title: "Limite atingido",
        description: `Você atingiu o limite de ${demoModeState.restrictions.maxItems} itens no modo de demonstração.`,
        variant: "destructive",
      })
      throw new Error("Limite de itens atingido no modo de demonstração")
    }

    // Inicializar array se não existir
    if (!demoModeState.demoData[collection]) {
      demoModeState.demoData[collection] = []
    }

    // Atualizar ou adicionar item
    const items = demoModeState.demoData[collection] as any[]
    const index = items.findIndex((i: any) => i.id === item.id)

    if (index >= 0) {
      items[index] = { ...items[index], ...item }
    } else {
      items.push(item)
    }

    // Atualizar localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("demo_mode", JSON.stringify(demoModeState))
    }

    return item
  },

  // Remover item dos dados de demonstração
  removeData: (collection: string, id: string): boolean => {
    if (!demoModeState.enabled) {
      throw new Error("Modo de demonstração não está ativado")
    }

    // Verificar restrições
    if (!demoModeState.restrictions.allowDeleting) {
      toast({
        title: "Operação não permitida",
        description: "Exclusão não é permitida no modo de demonstração atual.",
        variant: "destructive",
      })
      throw new Error("Exclusão não permitida no modo de demonstração")
    }

    // Verificar se a coleção existe
    if (!demoModeState.demoData[collection]) {
      return false
    }

    // Remover item
    const items = demoModeState.demoData[collection] as any[]
    const initialLength = items.length
    demoModeState.demoData[collection] = items.filter((item: any) => item.id !== id)

    // Atualizar localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("demo_mode", JSON.stringify(demoModeState))
    }

    return initialLength > demoModeState.demoData[collection].length
  },

  // Verificar restrições
  canCreate: (): boolean => {
    return demoModeState.enabled && demoModeState.restrictions.allowCreating
  },

  canEdit: (): boolean => {
    return demoModeState.enabled && demoModeState.restrictions.allowEditing
  },

  canDelete: (): boolean => {
    return demoModeState.enabled && demoModeState.restrictions.allowDeleting
  },

  canExport: (): boolean => {
    return demoModeState.enabled && demoModeState.restrictions.allowExporting
  },

  // Inicializar modo de demonstração a partir do localStorage
  initialize: (): void => {
    if (typeof window === "undefined") {
      return // Não executar durante SSR
    }

    try {
      const savedState = localStorage.getItem("demo_mode")
      if (savedState) {
        demoModeState = JSON.parse(savedState)
      }
    } catch (error) {
      console.error("Erro ao inicializar modo de demonstração:", error)
    }
  },
}

// Hook para usar o modo de demonstração em componentes
export function useDemoMode() {
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    // Inicializar do localStorage
    DemoMode.initialize()
    setIsEnabled(DemoMode.isEnabled())

    // Criar um evento personalizado para mudanças no modo de demonstração
    const handleDemoModeChange = () => {
      setIsEnabled(DemoMode.isEnabled())
    }

    window.addEventListener("demo_mode_change", handleDemoModeChange)

    return () => {
      window.removeEventListener("demo_mode_change", handleDemoModeChange)
    }
  }, [])

  // Funções wrapper para atualizar o estado do React
  const enable = useCallback((config?: Partial<DemoModeConfig>) => {
    DemoMode.enable(config)
    setIsEnabled(true)
    window.dispatchEvent(new Event("demo_mode_change"))
  }, [])

  const disable = useCallback(() => {
    DemoMode.disable()
    setIsEnabled(false)
    window.dispatchEvent(new Event("demo_mode_change"))
  }, [])

  return {
    isEnabled,
    enable,
    disable,
    getData: DemoMode.getData,
    updateData: DemoMode.updateData,
    removeData: DemoMode.removeData,
    canCreate: DemoMode.canCreate,
    canEdit: DemoMode.canEdit,
    canDelete: DemoMode.canDelete,
    canExport: DemoMode.canExport,
  }
}
