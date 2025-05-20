// Interfaces para posts e conexões
export interface SMPPost {
  id: string
  title: string
  caption: string
  hashtags: string[]
  theme: string
  type: "PLM" | "PLC"
  position: { x: number; y: number }
  imageUrl?: string // Campo para armazenar a URL da imagem
  status?: "draft" | "scheduled" | "published" // Status do post
  scheduledDate?: string // Data de agendamento
}

export interface SMPConnection {
  id: string
  source: string
  target: string
}

// Interface para módulos
export interface Module {
  id: string
  name: string
  description: string
  icon: string
  category: string
  features: string[]
  metrics: {
    engagement: number
    reach: number
    conversion?: number
  }
  status: "active" | "inactive" | "coming_soon"
  settings: Record<string, boolean | string>
}

// Interface para modelos de IA
export interface AIModel {
  id: string
  name: string
  description: string
  category: string
  capabilities: string[]
  metrics: {
    accuracy: number
    speed: number
    cost: number
  }
  status: "active" | "inactive" | "coming_soon"
  settings: Record<string, boolean | string>
}

// Dados padrão para módulos
const defaultModules: Module[] = [
  {
    id: "instagram",
    name: "Instagram",
    description: "Gerencie posts, stories e reels do Instagram com recursos avançados de planejamento e análise.",
    icon: "instagram",
    category: "social",
    features: [
      "Programação de posts",
      "Análise de desempenho",
      "Sugestões de hashtags",
      "Planejamento de feed",
      "Gerenciamento de stories",
    ],
    metrics: {
      engagement: 85,
      reach: 70,
    },
    status: "active",
    settings: {
      autoPublish: true,
      hashtagSuggestions: true,
      feedPreview: true,
      analyticsReports: false,
    },
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "Gerencie sua página do Facebook com ferramentas para posts, eventos e análise de engajamento.",
    icon: "facebook",
    category: "social",
    features: [
      "Programação de posts",
      "Gerenciamento de eventos",
      "Análise de engajamento",
      "Resposta a comentários",
      "Integração com Messenger",
    ],
    metrics: {
      engagement: 75,
      reach: 80,
    },
    status: "active",
    settings: {
      autoPublish: true,
      commentManagement: false,
      eventCreation: true,
      analyticsReports: true,
    },
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Gerencie seu perfil profissional e página empresarial com conteúdo estratégico para B2B.",
    icon: "linkedin",
    category: "social",
    features: [
      "Programação de posts",
      "Análise de perfil",
      "Conteúdo para B2B",
      "Gerenciamento de conexões",
      "Métricas de engajamento",
    ],
    metrics: {
      engagement: 65,
      reach: 60,
    },
    status: "active",
    settings: {
      autoPublish: true,
      b2bTemplates: false,
      analyticsReports: true,
      connectionManagement: false,
    },
  },
  {
    id: "twitter",
    name: "Twitter",
    description: "Gerencie sua presença no Twitter com programação de tweets e análise de tendências.",
    icon: "twitter",
    category: "social",
    features: [
      "Programação de tweets",
      "Monitoramento de hashtags",
      "Análise de tendências",
      "Gerenciamento de threads",
      "Resposta automática",
    ],
    metrics: {
      engagement: 70,
      reach: 75,
    },
    status: "active",
    settings: {
      autoPublish: true,
      trendMonitoring: true,
      threadCreation: false,
      analyticsReports: true,
    },
  },
  {
    id: "planner",
    name: "Planejador",
    description: "Planeje sua estratégia de conteúdo com calendário editorial e fluxo de trabalho integrado.",
    icon: "file-text",
    category: "planning",
    features: [
      "Calendário editorial",
      "Fluxo de trabalho",
      "Atribuição de tarefas",
      "Categorização de conteúdo",
      "Visualização por plataforma",
    ],
    metrics: {
      engagement: 0,
      reach: 0,
      conversion: 85,
    },
    status: "active",
    settings: {
      workflowManagement: true,
      taskAssignment: true,
      contentCategorization: true,
      platformFiltering: true,
    },
  },
  {
    id: "calendar",
    name: "Calendário",
    description: "Visualize e organize seu conteúdo em um calendário interativo com múltiplas visualizações.",
    icon: "calendar",
    category: "planning",
    features: [
      "Visualização mensal",
      "Visualização semanal",
      "Arrastar e soltar",
      "Filtros por plataforma",
      "Exportação para PDF",
    ],
    metrics: {
      engagement: 0,
      reach: 0,
      conversion: 80,
    },
    status: "active",
    settings: {
      dragAndDrop: true,
      platformFiltering: true,
      pdfExport: false,
      multipleViews: true,
    },
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "Analise o desempenho do seu conteúdo com métricas detalhadas e relatórios personalizados.",
    icon: "bar-chart",
    category: "planning",
    features: [
      "Métricas de engajamento",
      "Relatórios personalizados",
      "Comparação de períodos",
      "Exportação de dados",
      "Insights automáticos",
    ],
    metrics: {
      engagement: 0,
      reach: 0,
      conversion: 90,
    },
    status: "active",
    settings: {
      customReports: true,
      periodComparison: true,
      dataExport: true,
      automaticInsights: false,
    },
  },
]

// Dados padrão para modelos de IA
const defaultAIModels: AIModel[] = [
  {
    id: "content-generator",
    name: "Gerador de Conteúdo",
    description: "Cria textos para posts, legendas e hashtags com base no seu nicho e estilo.",
    category: "content",
    capabilities: [
      "Geração de legendas",
      "Sugestão de hashtags",
      "Criação de títulos",
      "Adaptação por plataforma",
      "Personalização de tom",
    ],
    metrics: {
      accuracy: 85,
      speed: 90,
      cost: 70,
    },
    status: "active",
    settings: {
      platformAdaptation: true,
      toneCustomization: true,
      hashtagGeneration: true,
      lengthControl: true,
    },
  },
  {
    id: "image-enhancer",
    name: "Aprimorador de Imagens",
    description: "Melhora automaticamente suas imagens para maior impacto visual nas redes sociais.",
    category: "visual",
    capabilities: [
      "Ajuste de cores",
      "Recorte inteligente",
      "Remoção de fundo",
      "Aplicação de filtros",
      "Redimensionamento por plataforma",
    ],
    metrics: {
      accuracy: 90,
      speed: 85,
      cost: 75,
    },
    status: "active",
    settings: {
      autoColorCorrection: true,
      smartCropping: true,
      backgroundRemoval: true,
      platformSizing: true,
    },
  },
  {
    id: "hashtag-optimizer",
    name: "Otimizador de Hashtags",
    description: "Encontra as melhores hashtags para maximizar o alcance do seu conteúdo.",
    category: "content",
    capabilities: [
      "Pesquisa de tendências",
      "Análise de relevância",
      "Sugestões personalizadas",
      "Monitoramento de desempenho",
      "Agrupamento por categoria",
    ],
    metrics: {
      accuracy: 85,
      speed: 95,
      cost: 65,
    },
    status: "active",
    settings: {
      trendResearch: true,
      relevanceAnalysis: true,
      performanceTracking: false,
      categoryGrouping: true,
    },
  },
  {
    id: "content-scheduler",
    name: "Agendador Inteligente",
    description: "Determina os melhores horários para publicação com base no comportamento da audiência.",
    category: "planning",
    capabilities: [
      "Análise de horários",
      "Programação automática",
      "Otimização por plataforma",
      "Ajuste por fuso horário",
      "Recomendações personalizadas",
    ],
    metrics: {
      accuracy: 85,
      speed: 90,
      cost: 70,
    },
    status: "active",
    settings: {
      timeAnalysis: true,
      autoScheduling: true,
      platformOptimization: true,
      timezoneAdjustment: false,
    },
  },
]

// Função para carregar módulos
export async function loadModules(): Promise<Module[]> {
  try {
    return defaultModules
  } catch (error) {
    console.error("Erro ao carregar módulos:", error)
    return defaultModules
  }
}

// Função para carregar modelos de IA
export async function loadAIModels(): Promise<AIModel[]> {
  try {
    return defaultAIModels
  } catch (error) {
    console.error("Erro ao carregar modelos de IA:", error)
    return defaultAIModels
  }
}

// Função para salvar preferência do usuário
export async function saveUserPreference(userId: string, key: string, value: string): Promise<boolean> {
  try {
    // Simulação de salvamento bem-sucedido
    console.log(`Preferência salva: ${userId}, ${key}, ${value}`)
    return true
  } catch (error) {
    console.error("Erro ao salvar preferência:", error)
    return false
  }
}

// Função para carregar preferência do usuário
export async function loadUserPreference(userId: string, key: string, defaultValue = ""): Promise<string> {
  try {
    // Simulação de carregamento
    console.log(`Carregando preferência: ${userId}, ${key}`)
    return defaultValue
  } catch (error) {
    console.error("Erro ao carregar preferência:", error)
    return defaultValue
  }
}

// Funções para posts e conexões
export async function loadPosts(): Promise<SMPPost[]> {
  try {
    // Dados de exemplo com imagens
    return [
      {
        id: "post1",
        title: "Lançamento de Produto",
        caption: "Novo produto chegando às lojas em breve! Fiquem ligados para mais informações.",
        hashtags: ["novoproduto", "lançamento", "inovação"],
        theme: "Produto",
        type: "PLM",
        position: { x: 100, y: 100 },
        imageUrl: "/product-launch-excitement.png",
        status: "draft",
      },
      {
        id: "post2",
        title: "Promoção de Verão",
        caption: "Aproveite nossos descontos especiais de verão em toda a linha de produtos!",
        hashtags: ["promoção", "verão", "descontos"],
        theme: "Promoção",
        type: "PLC",
        position: { x: 400, y: 300 },
        imageUrl: "/summer-sale-display.png",
        status: "scheduled",
        scheduledDate: "2023-12-15T10:00:00",
      },
    ]
  } catch (error) {
    console.error("Erro ao carregar posts:", error)
    return []
  }
}

export async function loadConnections(): Promise<SMPConnection[]> {
  try {
    // Dados de exemplo
    return [
      {
        id: "conn1",
        source: "post1",
        target: "post2",
      },
    ]
  } catch (error) {
    console.error("Erro ao carregar conexões:", error)
    return []
  }
}

export async function createPost(post: Omit<SMPPost, "id">): Promise<SMPPost | null> {
  try {
    const postId = Date.now().toString()
    const newPost = { ...post, id: postId }
    console.log("Post criado:", newPost)
    return newPost
  } catch (error) {
    console.error("Erro ao criar post:", error)
    return null
  }
}

export async function updatePost(post: SMPPost): Promise<boolean> {
  try {
    console.log("Post atualizado:", post)
    return true
  } catch (error) {
    console.error("Erro ao atualizar post:", error)
    return false
  }
}

export async function deletePost(id: string): Promise<boolean> {
  try {
    console.log("Post excluído:", id)
    return true
  } catch (error) {
    console.error("Erro ao excluir post:", error)
    return false
  }
}

export async function createConnection(connection: Omit<SMPConnection, "id">): Promise<SMPConnection | null> {
  try {
    const connectionId = Date.now().toString()
    const newConnection = { ...connection, id: connectionId }
    console.log("Conexão criada:", newConnection)
    return newConnection
  } catch (error) {
    console.error("Erro ao criar conexão:", error)
    return null
  }
}

export async function updatePostPosition(postId: string, position: { x: number; y: number }): Promise<boolean> {
  try {
    console.log("Posição do post atualizada:", postId, position)
    return true
  } catch (error) {
    console.error("Erro ao atualizar posição do post:", error)
    return false
  }
}

// Função para exportar posts como relatório
export async function exportPostsReport(format: "pdf" | "json" | "csv" = "pdf"): Promise<string> {
  try {
    const posts = await loadPosts()
    console.log(`Exportando posts em formato ${format}`)

    // Simulação de URL de download
    return `/api/export/posts?format=${format}&timestamp=${Date.now()}`
  } catch (error) {
    console.error("Erro ao exportar posts:", error)
    throw new Error("Não foi possível exportar os posts")
  }
}

// Função para simular upload de imagem
export async function uploadPostImage(file: File): Promise<string> {
  try {
    console.log(`Simulando upload de imagem: ${file.name}`)

    // Simulação de URL de imagem
    return `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(file.name.replace(/\.[^/.]+$/, ""))}`
  } catch (error) {
    console.error("Erro ao fazer upload de imagem:", error)
    throw new Error("Não foi possível fazer upload da imagem")
  }
}

// Função para verificar a conexão com o Supabase
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    // Simulação de verificação de conexão
    // Em um ambiente real, isso faria uma chamada leve ao Supabase
    // para verificar se a conexão está ativa
    return true
  } catch (error) {
    console.error("Erro ao verificar conexão com o Supabase:", error)
    return false
  }
}
