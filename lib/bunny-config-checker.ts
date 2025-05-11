import { logger } from "./logger"

interface BunnyConfigCheckResult {
  success: boolean
  issues: string[]
  recommendations: string[]
  details: {
    pullZoneExists: boolean
    pullZoneId?: string
    pullZoneUrl?: string
    storageZoneExists: boolean
    storageZoneId?: string
    cacheSettingsOptimal: boolean
    originShieldEnabled: boolean
    errorPageEnabled: boolean
  }
}

export async function checkBunnyConfig(): Promise<BunnyConfigCheckResult> {
  const issues: string[] = []
  const recommendations: string[] = []
  const details = {
    pullZoneExists: false,
    storageZoneExists: false,
    cacheSettingsOptimal: false,
    originShieldEnabled: false,
    errorPageEnabled: false,
  }

  try {
    logger.info("Iniciando verificação da configuração do Bunny CDN")

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.BUNNY_API_KEY) {
      issues.push("BUNNY_API_KEY não está configurada")
    }

    if (!process.env.BUNNY_STORAGE_ZONE) {
      issues.push("BUNNY_STORAGE_ZONE não está configurada")
    }

    if (!process.env.BUNNY_PULLZONE_URL) {
      issues.push("BUNNY_PULLZONE_URL não está configurada")
    }

    // Se faltam configurações básicas, não podemos continuar
    if (issues.length > 0) {
      logger.warn("Configurações básicas do Bunny CDN ausentes", { issues })
      return {
        success: false,
        issues,
        recommendations: ["Configure as variáveis de ambiente necessárias para o Bunny CDN"],
        details,
      }
    }

    // Verificar a Storage Zone
    try {
      const storageZoneResponse = await fetch(`https://api.bunny.net/storagezone`, {
        headers: {
          AccessKey: process.env.BUNNY_API_KEY!,
        },
      })

      if (storageZoneResponse.ok) {
        const storageZones = await storageZoneResponse.json()
        const targetZone = storageZones.find((zone: any) => zone.Name === process.env.BUNNY_STORAGE_ZONE)

        if (targetZone) {
          details.storageZoneExists = true
          details.storageZoneId = targetZone.Id
          logger.info("Storage Zone encontrada", { zoneId: targetZone.Id })
        } else {
          issues.push(`Storage Zone "${process.env.BUNNY_STORAGE_ZONE}" não encontrada`)
          recommendations.push("Crie a Storage Zone no painel do Bunny.net")
        }
      } else {
        issues.push("Não foi possível verificar a Storage Zone")
        logger.error("Erro ao verificar Storage Zone", {
          status: storageZoneResponse.status,
          statusText: storageZoneResponse.statusText,
        })
      }
    } catch (error) {
      issues.push("Erro ao verificar a Storage Zone")
      logger.error("Exceção ao verificar Storage Zone", { error })
    }

    // Verificar a Pull Zone
    try {
      const pullZoneResponse = await fetch(`https://api.bunny.net/pullzone`, {
        headers: {
          AccessKey: process.env.BUNNY_API_KEY!,
        },
      })

      if (pullZoneResponse.ok) {
        const pullZones = await pullZoneResponse.json()

        // Tentar encontrar a Pull Zone pelo URL
        const pullZoneUrl = process.env.BUNNY_PULLZONE_URL!.replace(/^https?:\/\//, "")
        const targetZone = pullZones.find((zone: any) =>
          zone.Hostnames.some((hostname: any) => hostname.Value === pullZoneUrl),
        )

        if (targetZone) {
          details.pullZoneExists = true
          details.pullZoneId = targetZone.Id
          details.pullZoneUrl = `https://${pullZoneUrl}`
          details.originShieldEnabled = targetZone.OriginShieldEnabled
          details.errorPageEnabled = targetZone.ErrorPageEnabled
          details.cacheSettingsOptimal = targetZone.CacheControlMaxAgeOverride > 0

          logger.info("Pull Zone encontrada", {
            zoneId: targetZone.Id,
            originShieldEnabled: targetZone.OriginShieldEnabled,
            errorPageEnabled: targetZone.ErrorPageEnabled,
            cacheSettings: targetZone.CacheControlMaxAgeOverride,
          })

          // Verificar configurações e adicionar recomendações
          if (!targetZone.OriginShieldEnabled) {
            recommendations.push(
              "Ative o Origin Shield para melhorar o desempenho e reduzir a carga no servidor de origem",
            )
          }

          if (!targetZone.ErrorPageEnabled) {
            recommendations.push("Configure uma página de erro personalizada para melhorar a experiência do usuário")
          }

          if (!targetZone.CacheControlMaxAgeOverride || targetZone.CacheControlMaxAgeOverride < 86400) {
            recommendations.push("Aumente o tempo de cache padrão para pelo menos 1 dia (86400 segundos)")
          }
        } else {
          issues.push(`Pull Zone para "${pullZoneUrl}" não encontrada`)
          recommendations.push("Crie uma Pull Zone no painel do Bunny.net e conecte-a à sua Storage Zone")
        }
      } else {
        issues.push("Não foi possível verificar a Pull Zone")
        logger.error("Erro ao verificar Pull Zone", {
          status: pullZoneResponse.status,
          statusText: pullZoneResponse.statusText,
        })
      }
    } catch (error) {
      issues.push("Erro ao verificar a Pull Zone")
      logger.error("Exceção ao verificar Pull Zone", { error })
    }

    // Verificar a conexão entre Storage Zone e Pull Zone
    if (details.pullZoneExists && details.storageZoneExists) {
      try {
        // Testar o acesso a um arquivo de teste
        const testUrl = `${details.pullZoneUrl}/test-connection-${Date.now()}.txt`
        const testContent = `Test connection at ${new Date().toISOString()}`

        // Fazer upload do arquivo de teste
        const uploadResponse = await fetch(
          `https://storage.bunnycdn.com/${process.env.BUNNY_STORAGE_ZONE}/test-connection-${Date.now()}.txt`,
          {
            method: "PUT",
            headers: {
              AccessKey: process.env.BUNNY_API_KEY!,
              "Content-Type": "text/plain",
            },
            body: testContent,
          },
        )

        if (!uploadResponse.ok) {
          issues.push("Não foi possível fazer upload de um arquivo de teste para a Storage Zone")
          logger.error("Erro ao fazer upload de arquivo de teste", {
            status: uploadResponse.status,
            statusText: uploadResponse.statusText,
          })
        } else {
          // Tentar acessar o arquivo via Pull Zone
          const accessResponse = await fetch(testUrl)

          if (!accessResponse.ok) {
            issues.push("Não foi possível acessar o arquivo de teste via Pull Zone")
            recommendations.push("Verifique se a Pull Zone está corretamente conectada à Storage Zone")
            logger.error("Erro ao acessar arquivo de teste via Pull Zone", {
              status: accessResponse.status,
              statusText: accessResponse.statusText,
            })
          } else {
            logger.info("Conexão entre Storage Zone e Pull Zone verificada com sucesso")
          }
        }
      } catch (error) {
        issues.push("Erro ao testar a conexão entre Storage Zone e Pull Zone")
        logger.error("Exceção ao testar conexão", { error })
      }
    }

    return {
      success: issues.length === 0,
      issues,
      recommendations,
      details,
    }
  } catch (error) {
    logger.error("Erro geral ao verificar configuração do Bunny CDN", { error })
    return {
      success: false,
      issues: ["Erro geral ao verificar configuração do Bunny CDN"],
      recommendations: ["Verifique os logs para mais detalhes"],
      details,
    }
  }
}
