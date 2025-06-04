import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Obter o caminho da URL
  const path = request.nextUrl.pathname

  // Verificar se o caminho começa com /admin (exceto /admin/login)
  const isAdminRoute = path.startsWith("/admin") && path !== "/admin/login"

  // Verificar se o usuário está autenticado
  const isAuthenticated =
    request.cookies.has("is-authenticated") || request.cookies.has("auth-token") || request.cookies.has("sb-auth-token")

  // Se for uma rota de admin e o usuário não estiver autenticado, redirecionar para o login
  if (isAdminRoute && !isAuthenticated) {
    const loginUrl = new URL("/admin/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Se o usuário já estiver autenticado e tentar acessar a página de login, redirecionar para o admin
  if (path === "/admin/login" && isAuthenticated) {
    const adminUrl = new URL("/admin", request.url)
    return NextResponse.redirect(adminUrl)
  }

  // Continuar com a requisição normalmente
  return NextResponse.next()
}

// Configurar os caminhos que o middleware deve ser executado
export const config = {
  matcher: ["/admin/:path*"],
}
