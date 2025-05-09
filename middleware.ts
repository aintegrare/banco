import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  console.log("Middleware executando para:", request.nextUrl.pathname)

  // Verificar se a rota é /admin ou subpasta
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  const isLoginRoute = request.nextUrl.pathname === "/admin/login"

  // Se não for rota admin, não aplicar middleware
  if (!isAdminRoute) {
    return NextResponse.next()
  }

  // Se for a rota de login, permitir acesso
  if (isLoginRoute) {
    return NextResponse.next()
  }

  // Verificar se o usuário está autenticado
  const authToken = request.cookies.get("auth-token")
  console.log("Token de autenticação encontrado:", !!authToken)

  // Se não estiver autenticado, redirecionar para login
  if (!authToken) {
    console.log("Redirecionando para login")
    const loginUrl = new URL("/admin/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Usuário autenticado, permitir acesso
  console.log("Usuário autenticado, permitindo acesso")
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
