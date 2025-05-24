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

  // Verificar se estamos em modo de demonstração
  const isDemoMode = request.cookies.has("demo-mode")

  // Se for uma rota de admin e o usuário não estiver autenticado e não estiver em modo de demonstração,
  // redirecionar para o login
  if (isAdminRoute && !isAuthenticated && !isDemoMode) {
    const loginUrl = new URL("/admin/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Se o usuário já estiver autenticado ou em modo de demonstração e tentar acessar a página de login,
  // redirecionar para o admin
  if (path === "/admin/login" && (isAuthenticated || isDemoMode)) {
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
