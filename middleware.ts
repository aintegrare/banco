import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Middleware simplificado para evitar problemas de renderização
export async function middleware(req: NextRequest) {
  // Permitir acesso à página de login
  if (req.nextUrl.pathname === "/admin/login") {
    return NextResponse.next()
  }

  // Verificar se há um token de autenticação nos cookies
  const authCookie = req.cookies.get("sb-auth-token")

  // Se não houver token e a rota começar com /admin, redirecionar para login
  if (!authCookie && req.nextUrl.pathname.startsWith("/admin")) {
    const redirectUrl = new URL("/admin/login", req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
