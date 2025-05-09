import { createClient } from "@/lib/supabase/server"

export async function createAdminUser() {
  const supabase = createClient()

  // Verifica se o usuário já existe
  const { data: existingUser } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", "estrategia@designmarketing.com.br")
    .single()

  if (existingUser) {
    console.log("Usuário admin já existe")
    return
  }

  // Cria o usuário
  const { data, error } = await supabase.auth.signUp({
    email: "estrategia@designmarketing.com.br",
    password: "Jivago14#",
  })

  if (error) {
    console.error("Erro ao criar usuário admin:", error)
    return
  }

  console.log("Usuário admin criado com sucesso:", data)
}

export async function isAuthenticated() {
  const supabase = createClient()
  const { data } = await supabase.auth.getSession()
  return !!data.session
}
