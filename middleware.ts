import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Rotas públicas que não precisam de autenticação
  const publicRoutes = [
    "/", // Página inicial
    "/blog", // Blog
    "/contato", // Página de contato
    "/sobre", // Página sobre
    "/servicos", // Página de serviços
    "/admin/login", // Página de login
  ]

  // Verificar se a rota atual é uma rota pública
  const isPublicRoute = publicRoutes.some(
    (route) =>
      request.nextUrl.pathname === route ||
      request.nextUrl.pathname.startsWith("/blog/") ||
      request.nextUrl.pathname.startsWith("/_next/") ||
      request.nextUrl.pathname.startsWith("/api/auth/") ||
      request.nextUrl.pathname.includes("."), // Arquivos estáticos
  )

  // Se for uma rota pública, permitir acesso
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Verificar se a rota é /admin ou subpasta
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")

  // Se não for rota admin, permitir acesso (não proteger outras rotas)
  if (!isAdminRoute) {
    return NextResponse.next()
  }

  // Verificar se o usuário está autenticado
  const authToken = request.cookies.get("auth-token")
  const isAuthenticated = request.cookies.get("is-authenticated")

  // Se não estiver autenticado, redirecionar para login
  if (!authToken || !isAuthenticated) {
    const loginUrl = new URL("/admin/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Usuário autenticado, permitir acesso
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Proteger todas as rotas, exceto as especificadas no middleware
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
