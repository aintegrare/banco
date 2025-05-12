import { type NextRequest, NextResponse } from "next/server"
import { loadPosts } from "@/lib/smp-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get("format") || "pdf"

    // Carregar os posts
    const posts = await loadPosts()

    // Processar de acordo com o formato solicitado
    switch (format) {
      case "json":
        return NextResponse.json(posts, {
          headers: {
            "Content-Disposition": `attachment; filename="posts-report-${Date.now()}.json"`,
          },
        })

      case "csv":
        // Converter posts para CSV
        const headers = "id,title,caption,theme,type,status,scheduledDate\n"
        const rows = posts
          .map((post) => {
            return `"${post.id}","${post.title.replace(/"/g, '""')}","${post.caption.replace(/"/g, '""')}","${post.theme}","${post.type}","${post.status || "draft"}","${post.scheduledDate || ""}"`
          })
          .join("\n")

        const csv = headers + rows

        return new NextResponse(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="posts-report-${Date.now()}.csv"`,
          },
        })

      case "pdf":
      default:
        // Para PDF, retornamos um JSON simulado com uma URL
        // Em um ambiente real, você geraria um PDF real
        return NextResponse.json({
          success: true,
          downloadUrl: `/api/export/posts?format=json&timestamp=${Date.now()}`,
          message: "PDF gerado com sucesso (simulação)",
        })
    }
  } catch (error) {
    console.error("Erro ao exportar posts:", error)
    return NextResponse.json({ error: "Erro ao exportar posts" }, { status: 500 })
  }
}
