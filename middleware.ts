import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function middleware(request: NextRequest) {
  // Verifica se a rota começa com /admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Rota pública para configuração inicial
    if (request.nextUrl.pathname === "/admin/setup-inicial") {
      return NextResponse.next()
    }

    // Página de login não precisa de autenticação
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next()
    }

    // Verifica se o usuário está autenticado
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Se não estiver autenticado, redireciona para a página de login
    if (!session) {
      const redirectUrl = new URL("/admin/login", request.url)
      redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
