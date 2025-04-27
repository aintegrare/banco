import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Capturar erros de runtime
  try {
    // Continuar com a requisição normal
    return NextResponse.next()
  } catch (error) {
    console.error("Erro capturado no middleware:", error)

    // Redirecionar para uma página de erro
    return NextResponse.redirect(new URL("/error", request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
