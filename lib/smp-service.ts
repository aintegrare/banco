import { adminSupabase, supabase } from "./api"

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
  id?: string
  source: string
  target: string
}

// Função para carregar todos os posts
export async function loadPosts(): Promise<SMPPost[]> {
  try {
    const { data, error } = await supabase.from("smp_posts").select("*")

    if (error) {
      console.error("Erro ao carregar posts:", error)
      throw error
    }

    return data.map((post) => ({
      id: post.id,
      title: post.title,
      caption: post.caption,
      hashtags: post.hashtags || [],
      theme: post.theme || "",
      type: post.type as "PLM" | "PLC",
      position: { x: post.position_x, y: post.position_y },
    }))
  } catch (error) {
    console.error("Erro ao carregar posts:", error)
    return []
  }
}

// Função para carregar todas as conexões
export async function loadConnections(): Promise<SMPConnection[]> {
  try {
    const { data, error } = await supabase.from("smp_connections").select("*")

    if (error) {
      console.error("Erro ao carregar conexões:", error)
      throw error
    }

    return data.map((conn) => ({
      id: conn.id,
      source: conn.source_id,
      target: conn.target_id,
    }))
  } catch (error) {
    console.error("Erro ao carregar conexões:", error)
    return []
  }
}

// Função para criar um novo post
export async function createPost(post: Omit<SMPPost, "id">): Promise<SMPPost | null> {
  try {
    const { data, error } = await adminSupabase
      .from("smp_posts")
      .insert({
        title: post.title,
        caption: post.caption,
        hashtags: post.hashtags,
        theme: post.theme,
        type: post.type,
        position_x: post.position.x,
        position_y: post.position.y,
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar post:", error)
      throw error
    }

    return {
      id: data.id,
      title: data.title,
      caption: data.caption,
      hashtags: data.hashtags || [],
      theme: data.theme || "",
      type: data.type as "PLM" | "PLC",
      position: { x: data.position_x, y: data.position_y },
    }
  } catch (error) {
    console.error("Erro ao criar post:", error)
    return null
  }
}

// Função para atualizar um post existente
export async function updatePost(post: SMPPost): Promise<boolean> {
  try {
    const { error } = await adminSupabase
      .from("smp_posts")
      .update({
        title: post.title,
        caption: post.caption,
        hashtags: post.hashtags,
        theme: post.theme,
        type: post.type,
        position_x: post.position.x,
        position_y: post.position.y,
        updated_at: new Date().toISOString(),
      })
      .eq("id", post.id)

    if (error) {
      console.error("Erro ao atualizar post:", error)
      throw error
    }

    return true
  } catch (error) {
    console.error("Erro ao atualizar post:", error)
    return false
  }
}

// Função para excluir um post
export async function deletePost(postId: string): Promise<boolean> {
  try {
    const { error } = await adminSupabase.from("smp_posts").delete().eq("id", postId)

    if (error) {
      console.error("Erro ao excluir post:", error)
      throw error
    }

    return true
  } catch (error) {
    console.error("Erro ao excluir post:", error)
    return false
  }
}

// Função para criar uma nova conexão
export async function createConnection(connection: Omit<SMPConnection, "id">): Promise<SMPConnection | null> {
  try {
    const { data, error } = await adminSupabase
      .from("smp_connections")
      .insert({
        source_id: connection.source,
        target_id: connection.target,
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar conexão:", error)
      throw error
    }

    return {
      id: data.id,
      source: data.source_id,
      target: data.target_id,
    }
  } catch (error) {
    console.error("Erro ao criar conexão:", error)
    return null
  }
}

// Função para excluir uma conexão
export async function deleteConnection(sourceId: string, targetId: string): Promise<boolean> {
  try {
    const { error } = await adminSupabase
      .from("smp_connections")
      .delete()
      .eq("source_id", sourceId)
      .eq("target_id", targetId)

    if (error) {
      console.error("Erro ao excluir conexão:", error)
      throw error
    }

    return true
  } catch (error) {
    console.error("Erro ao excluir conexão:", error)
    return false
  }
}

// Função para atualizar a posição de um post
export async function updatePostPosition(postId: string, position: { x: number; y: number }): Promise<boolean> {
  try {
    const { error } = await adminSupabase
      .from("smp_posts")
      .update({
        position_x: position.x,
        position_y: position.y,
        updated_at: new Date().toISOString(),
      })
      .eq("id", postId)

    if (error) {
      console.error("Erro ao atualizar posição do post:", error)
      throw error
    }

    return true
  } catch (error) {
    console.error("Erro ao atualizar posição do post:", error)
    return false
  }
}
