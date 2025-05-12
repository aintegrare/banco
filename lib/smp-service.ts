import { adminSupabase } from "./api"

// Verificar se estamos em ambiente de preview
const isPreviewEnvironment = process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV !== "production"

// Tipos para os posts e conexões
export interface SMPPost {
  id: string
  title: string
  caption: string
  hashtags: string[]
  theme: string
  type: "PLM" | "PLC"
  position: { x: number; y: number }
}

export interface SMPConnection {
  id: string
  source: string
  target: string
}

// Armazenamento local para ambiente de preview
let localPosts: SMPPost[] = [
  {
    id: "post1",
    title: "Lançamento de Produto",
    caption: "Novo produto chegando às lojas em breve! Fiquem ligados para mais informações.",
    hashtags: ["novoproduto", "lançamento", "inovação"],
    theme: "Produto",
    type: "PLM",
    position: { x: 100, y: 100 },
  },
  {
    id: "post2",
    title: "Promoção de Verão",
    caption: "Aproveite nossos descontos especiais de verão em toda a linha de produtos!",
    hashtags: ["promoção", "verão", "descontos"],
    theme: "Promoção",
    type: "PLC",
    position: { x: 400, y: 300 },
  },
]

let localConnections: SMPConnection[] = [
  {
    id: "conn1",
    source: "post1",
    target: "post2",
  },
]

// Função para carregar posts
export async function loadPosts(): Promise<SMPPost[]> {
  try {
    // Em ambiente de preview, usar dados locais
    if (isPreviewEnvironment) {
      console.log("Usando dados locais para posts em ambiente de preview")
      return [...localPosts]
    }

    // Verificar se o cliente Supabase está disponível
    if (!adminSupabase) {
      console.error("Cliente Supabase não disponível")
      return [...localPosts]
    }

    const { data, error } = await adminSupabase.from("smp_posts").select("*")

    if (error) {
      console.error("Erro ao carregar posts:", error)
      return [...localPosts]
    }

    return data.map((post) => ({
      id: post.id,
      title: post.title,
      caption: post.caption,
      hashtags: post.hashtags || [],
      theme: post.theme,
      type: post.type,
      position: post.position,
    }))
  } catch (error) {
    console.error("Erro ao carregar posts:", error)
    return [...localPosts]
  }
}

// Função para carregar conexões
export async function loadConnections(): Promise<SMPConnection[]> {
  try {
    // Em ambiente de preview, usar dados locais
    if (isPreviewEnvironment) {
      console.log("Usando dados locais para conexões em ambiente de preview")
      return [...localConnections]
    }

    // Verificar se o cliente Supabase está disponível
    if (!adminSupabase) {
      console.error("Cliente Supabase não disponível")
      return [...localConnections]
    }

    const { data, error } = await adminSupabase.from("smp_connections").select("*")

    if (error) {
      console.error("Erro ao carregar conexões:", error)
      return [...localConnections]
    }

    return data.map((connection) => ({
      id: connection.id,
      source: connection.source,
      target: connection.target,
    }))
  } catch (error) {
    console.error("Erro ao carregar conexões:", error)
    return [...localConnections]
  }
}

// Função para criar um novo post
export async function createPost(post: Omit<SMPPost, "id">): Promise<SMPPost | null> {
  try {
    const newPost: SMPPost = {
      id: `post${Date.now()}`,
      ...post,
    }

    // Em ambiente de preview, usar dados locais
    if (isPreviewEnvironment) {
      console.log("Salvando post localmente em ambiente de preview")
      localPosts.push(newPost)
      return newPost
    }

    // Verificar se o cliente Supabase está disponível
    if (!adminSupabase) {
      console.error("Cliente Supabase não disponível")
      localPosts.push(newPost)
      return newPost
    }

    const { data, error } = await adminSupabase.from("smp_posts").insert(newPost).select().single()

    if (error) {
      console.error("Erro ao criar post:", error)
      localPosts.push(newPost)
      return newPost
    }

    return data
  } catch (error) {
    console.error("Erro ao criar post:", error)
    return null
  }
}

// Função para atualizar um post
export async function updatePost(post: SMPPost): Promise<boolean> {
  try {
    // Em ambiente de preview, usar dados locais
    if (isPreviewEnvironment) {
      console.log("Atualizando post localmente em ambiente de preview")
      const index = localPosts.findIndex((p) => p.id === post.id)
      if (index !== -1) {
        localPosts[index] = post
      }
      return true
    }

    // Verificar se o cliente Supabase está disponível
    if (!adminSupabase) {
      console.error("Cliente Supabase não disponível")
      const index = localPosts.findIndex((p) => p.id === post.id)
      if (index !== -1) {
        localPosts[index] = post
      }
      return true
    }

    const { error } = await adminSupabase.from("smp_posts").update(post).eq("id", post.id)

    if (error) {
      console.error("Erro ao atualizar post:", error)
      const index = localPosts.findIndex((p) => p.id === post.id)
      if (index !== -1) {
        localPosts[index] = post
      }
      return true
    }

    return true
  } catch (error) {
    console.error("Erro ao atualizar post:", error)
    return false
  }
}

// Função para atualizar a posição de um post
export async function updatePostPosition(id: string, position: { x: number; y: number }): Promise<boolean> {
  try {
    // Em ambiente de preview, usar dados locais
    if (isPreviewEnvironment) {
      console.log("Atualizando posição do post localmente em ambiente de preview")
      const index = localPosts.findIndex((p) => p.id === id)
      if (index !== -1) {
        localPosts[index].position = position
      }
      return true
    }

    // Verificar se o cliente Supabase está disponível
    if (!adminSupabase) {
      console.error("Cliente Supabase não disponível")
      const index = localPosts.findIndex((p) => p.id === id)
      if (index !== -1) {
        localPosts[index].position = position
      }
      return true
    }

    const { error } = await adminSupabase.from("smp_posts").update({ position }).eq("id", id)

    if (error) {
      console.error("Erro ao atualizar posição do post:", error)
      const index = localPosts.findIndex((p) => p.id === id)
      if (index !== -1) {
        localPosts[index].position = position
      }
      return true
    }

    return true
  } catch (error) {
    console.error("Erro ao atualizar posição do post:", error)
    return false
  }
}

// Função para excluir um post
export async function deletePost(id: string): Promise<boolean> {
  try {
    // Em ambiente de preview, usar dados locais
    if (isPreviewEnvironment) {
      console.log("Excluindo post localmente em ambiente de preview")
      localPosts = localPosts.filter((p) => p.id !== id)
      // Também excluir conexões relacionadas
      localConnections = localConnections.filter((c) => c.source !== id && c.target !== id)
      return true
    }

    // Verificar se o cliente Supabase está disponível
    if (!adminSupabase) {
      console.error("Cliente Supabase não disponível")
      localPosts = localPosts.filter((p) => p.id !== id)
      localConnections = localConnections.filter((c) => c.source !== id && c.target !== id)
      return true
    }

    const { error } = await adminSupabase.from("smp_posts").delete().eq("id", id)

    if (error) {
      console.error("Erro ao excluir post:", error)
      localPosts = localPosts.filter((p) => p.id !== id)
      localConnections = localConnections.filter((c) => c.source !== id && c.target !== id)
      return true
    }

    return true
  } catch (error) {
    console.error("Erro ao excluir post:", error)
    return false
  }
}

// Função para criar uma conexão
export async function createConnection(connection: Omit<SMPConnection, "id">): Promise<SMPConnection | null> {
  try {
    const newConnection: SMPConnection = {
      id: `conn${Date.now()}`,
      ...connection,
    }

    // Em ambiente de preview, usar dados locais
    if (isPreviewEnvironment) {
      console.log("Salvando conexão localmente em ambiente de preview")
      localConnections.push(newConnection)
      return newConnection
    }

    // Verificar se o cliente Supabase está disponível
    if (!adminSupabase) {
      console.error("Cliente Supabase não disponível")
      localConnections.push(newConnection)
      return newConnection
    }

    const { data, error } = await adminSupabase.from("smp_connections").insert(newConnection).select().single()

    if (error) {
      console.error("Erro ao criar conexão:", error)
      localConnections.push(newConnection)
      return newConnection
    }

    return data
  } catch (error) {
    console.error("Erro ao criar conexão:", error)
    return null
  }
}

// Função para excluir uma conexão
export async function deleteConnection(id: string): Promise<boolean> {
  try {
    // Em ambiente de preview, usar dados locais
    if (isPreviewEnvironment) {
      console.log("Excluindo conexão localmente em ambiente de preview")
      localConnections = localConnections.filter((c) => c.id !== id)
      return true
    }

    // Verificar se o cliente Supabase está disponível
    if (!adminSupabase) {
      console.error("Cliente Supabase não disponível")
      localConnections = localConnections.filter((c) => c.id !== id)
      return true
    }

    const { error } = await adminSupabase.from("smp_connections").delete().eq("id", id)

    if (error) {
      console.error("Erro ao excluir conexão:", error)
      localConnections = localConnections.filter((c) => c.id !== id)
      return true
    }

    return true
  } catch (error) {
    console.error("Erro ao excluir conexão:", error)
    return false
  }
}

// Função para excluir uma conexão entre dois posts
export async function deleteConnectionBetween(sourceId: string, targetId: string): Promise<boolean> {
  try {
    // Em ambiente de preview, usar dados locais
    if (isPreviewEnvironment) {
      console.log("Excluindo conexão entre posts localmente em ambiente de preview")
      localConnections = localConnections.filter((c) => !(c.source === sourceId && c.target === targetId))
      return true
    }

    // Verificar se o cliente Supabase está disponível
    if (!adminSupabase) {
      console.error("Cliente Supabase não disponível")
      localConnections = localConnections.filter((c) => !(c.source === sourceId && c.target === targetId))
      return true
    }

    const { error } = await adminSupabase.from("smp_connections").delete().eq("source", sourceId).eq("target", targetId)

    if (error) {
      console.error("Erro ao excluir conexão entre posts:", error)
      localConnections = localConnections.filter((c) => !(c.source === sourceId && c.target === targetId))
      return true
    }

    return true
  } catch (error) {
    console.error("Erro ao excluir conexão entre posts:", error)
    return false
  }
}
