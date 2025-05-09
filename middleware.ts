import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
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
  const session = request.cookies.get("session")

  // Se não estiver autenticado, redirecionar para login
  if (!session) {
    const loginUrl = new URL("/admin/login", request.url)
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Usuário autenticado, permitir acesso
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
