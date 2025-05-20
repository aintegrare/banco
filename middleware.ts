import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  console.log("Middleware: Verificando rota:", request.nextUrl.pathname)

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
  const isAuthenticated = request.cookies.get("is-authenticated")

  console.log("Middleware: Token de autenticação:", !!authToken)
  console.log("Middleware: Cookie is-authenticated:", isAuthenticated?.value)

  // Se não estiver autenticado, redirecionar para login
  if (!authToken || !isAuthenticated) {
    console.log("Middleware: Usuário não autenticado, redirecionando para login")
    const loginUrl = new URL("/admin/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Usuário autenticado, permitir acesso
  console.log("Middleware: Usuário autenticado, permitindo acesso")
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
