import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Obter as variáveis de ambiente
    const apiKey = process.env.BUNNY_API_KEY || ""
    const storageZone = process.env.BUNNY_STORAGE_ZONE || ""

    // Construir a URL correta
    const storageUrl = `https://storage.bunnycdn.com/${storageZone}/`
    const pullZoneUrl = `https://integrare.b-cdn.net/`

    console.log(`Teste de conexão: URL de Storage: ${storageUrl}`)
    console.log(`Teste de conexão: URL da Pull Zone: ${pullZoneUrl}`)

    // Testar a conexão com a API do Bunny Storage
    const response = await fetch(`${storageUrl}`, {
      method: "GET",
      headers: {
        AccessKey: apiKey,
      },
    })

    const status = response.status
    let responseData = null

    try {
      responseData = await response.json()
    } catch (e) {
      console.error("Não foi possível ler o corpo da resposta como JSON:", e)
    }

    return NextResponse.json({
      success: response.ok,
      status,
      message: response.ok ? "Conexão bem-sucedida!" : "Falha na conexão",
      responseData,
      config: {
        storageZone,
        storageUrl: storageUrl.replace(apiKey, "[REDACTED]"),
        pullZoneUrl,
      },
    })
  } catch (error) {
    console.error("Erro ao testar conexão:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao testar conexão",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
