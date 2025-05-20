import { logger } from "./logger"
import { getBunnyClient, getBunnyPublicUrl, deleteBunnyFile, moveBunnyFile, renameBunnyFile } from "./bunny"

export interface FileOperationResult<T = any> {
  success: boolean
  data?: T
  error?: string
  details?: string
  retryable?: boolean
}

export class FileService {
  /**
   * Lista arquivos em um diretório
   */
  static async listFiles(directory: string): Promise<FileOperationResult> {
    try {
      logger.info(`Listando arquivos no diretório: ${directory}`, { context: "FileService" })

      const bunnyClient = getBunnyClient()

      // Verificar se o diretório existe
      try {
        logger.debug(`Verificando se o diretório ${directory} existe`, { context: "FileService" })
        await bunnyClient.get(`/${directory}/`)
        logger.debug(`Diretório ${directory} existe`, { context: "FileService" })
      } catch (error) {
        logger.warn(`Diretório ${directory} não existe, criando...`, { context: "FileService", data: error })
        try {
          await bunnyClient.put(`/${directory}/`, "")
          logger.info(`Diretório ${directory} criado com sucesso`, { context: "FileService" })
        } catch (createError) {
          logger.error(`Erro ao criar diretório ${directory}`, { context: "FileService", data: createError })
          return {
            success: false,
            error: "Falha ao criar diretório",
            details: createError instanceof Error ? createError.message : String(createError),
            retryable: true,
          }
        }
      }

      // Listar arquivos
      const response = await bunnyClient.get(`/${directory}/`)

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Erro desconhecido")
        logger.error(`Erro ao listar arquivos: ${response.status} ${response.statusText}`, {
          context: "FileService",
          data: { status: response.status, text: errorText },
        })

        return {
          success: false,
          error: `Erro ao listar arquivos: ${response.status} ${response.statusText}`,
          details: errorText,
          retryable: response.status >= 500, // Erros 5xx são geralmente retentáveis
        }
      }

      const files = await response.json()
      logger.info(`${files.length} arquivos encontrados no diretório ${directory}`, { context: "FileService" })

      // Adicionar URLs públicas
      const filesWithUrls = files.map((file: any) => {
        const fullPath = file.IsDirectory ? `${directory}/${file.ObjectName}/` : `${directory}/${file.ObjectName}`
        const publicUrl = getBunnyPublicUrl(fullPath)

        return {
          ...file,
          Path: fullPath,
          PublicUrl: publicUrl,
          FileName: file.ObjectName,
        }
      })

      return {
        success: true,
        data: { files: filesWithUrls },
      }
    } catch (error) {
      logger.error("Erro ao listar arquivos", { context: "FileService", data: error })
      return {
        success: false,
        error: "Erro ao listar arquivos",
        details: error instanceof Error ? error.message : String(error),
        retryable: true,
      }
    }
  }

  /**
   * Exclui um arquivo ou pasta
   */
  static async deleteFile(path: string): Promise<FileOperationResult> {
    try {
      logger.info(`Excluindo arquivo: ${path}`, { context: "FileService" })

      // Verificar se o arquivo existe antes de tentar excluí-lo
      const bunnyClient = getBunnyClient()
      const checkResponse = await bunnyClient.get(`/${path}`)

      if (checkResponse.status === 404) {
        logger.warn(`Arquivo ${path} não encontrado para exclusão`, { context: "FileService" })
        return {
          success: true, // Consideramos sucesso se o arquivo já não existe
          data: { message: "Arquivo já não existe" },
        }
      }

      if (!checkResponse.ok) {
        const errorText = await checkResponse.text().catch(() => "Erro desconhecido")
        logger.error(`Erro ao verificar arquivo para exclusão: ${checkResponse.status}`, {
          context: "FileService",
          data: { status: checkResponse.status, text: errorText },
        })

        return {
          success: false,
          error: `Erro ao verificar arquivo: ${checkResponse.status}`,
          details: errorText,
          retryable: checkResponse.status >= 500,
        }
      }

      // Excluir o arquivo
      const result = await deleteBunnyFile(path)

      // Verificar se o arquivo foi realmente excluído
      const verifyResponse = await bunnyClient.get(`/${path}`)

      if (verifyResponse.status !== 404) {
        logger.error(`Falha na verificação após exclusão: arquivo ainda existe`, {
          context: "FileService",
          data: { path, status: verifyResponse.status },
        })

        return {
          success: false,
          error: "Falha na exclusão: o arquivo ainda existe",
          details: `O arquivo ${path} ainda existe após a tentativa de exclusão`,
          retryable: true,
        }
      }

      logger.info(`Arquivo ${path} excluído com sucesso`, { context: "FileService" })

      return {
        success: true,
        data: { message: "Arquivo excluído com sucesso" },
      }
    } catch (error) {
      logger.error("Erro ao excluir arquivo", { context: "FileService", data: { path, error } })
      return {
        success: false,
        error: "Erro ao excluir arquivo",
        details: error instanceof Error ? error.message : String(error),
        retryable: true,
      }
    }
  }

  /**
   * Move um arquivo para outro local
   */
  static async moveFile(sourcePath: string, destinationPath: string): Promise<FileOperationResult> {
    try {
      logger.info(`Movendo arquivo de ${sourcePath} para ${destinationPath}`, { context: "FileService" })

      // Verificar se o arquivo de origem existe
      const bunnyClient = getBunnyClient()
      const sourceResponse = await bunnyClient.get(`/${sourcePath}`)

      if (sourceResponse.status === 404) {
        logger.error(`Arquivo de origem ${sourcePath} não encontrado`, { context: "FileService" })
        return {
          success: false,
          error: "Arquivo de origem não encontrado",
          details: `O arquivo ${sourcePath} não existe`,
          retryable: false,
        }
      }

      if (!sourceResponse.ok) {
        const errorText = await sourceResponse.text().catch(() => "Erro desconhecido")
        logger.error(`Erro ao verificar arquivo de origem: ${sourceResponse.status}`, {
          context: "FileService",
          data: { status: sourceResponse.status, text: errorText },
        })

        return {
          success: false,
          error: `Erro ao verificar arquivo de origem: ${sourceResponse.status}`,
          details: errorText,
          retryable: sourceResponse.status >= 500,
        }
      }

      // Verificar se o destino já existe
      const destResponse = await bunnyClient.get(`/${destinationPath}`)

      if (destResponse.ok) {
        logger.warn(`Destino ${destinationPath} já existe`, { context: "FileService" })
        return {
          success: false,
          error: "Arquivo de destino já existe",
          details: `O arquivo ${destinationPath} já existe. Escolha outro nome ou exclua o arquivo existente.`,
          retryable: false,
        }
      }

      // Mover o arquivo
      const newUrl = await moveBunnyFile(sourcePath, destinationPath)

      // Verificar se o arquivo foi movido corretamente
      const verifySourceResponse = await bunnyClient.get(`/${sourcePath}`)
      const verifyDestResponse = await bunnyClient.get(`/${destinationPath}`)

      if (verifySourceResponse.ok) {
        logger.warn(`Arquivo de origem ${sourcePath} ainda existe após a movimentação`, { context: "FileService" })
      }

      if (verifyDestResponse.status === 404) {
        logger.error(`Arquivo de destino ${destinationPath} não foi criado`, { context: "FileService" })
        return {
          success: false,
          error: "Falha na movimentação: o arquivo de destino não foi criado",
          details: `O arquivo ${destinationPath} não existe após a tentativa de movimentação`,
          retryable: true,
        }
      }

      logger.info(`Arquivo movido com sucesso para ${destinationPath}`, { context: "FileService" })

      return {
        success: true,
        data: {
          message: "Arquivo movido com sucesso",
          newUrl,
        },
      }
    } catch (error) {
      logger.error("Erro ao mover arquivo", {
        context: "FileService",
        data: { sourcePath, destinationPath, error },
      })

      return {
        success: false,
        error: "Erro ao mover arquivo",
        details: error instanceof Error ? error.message : String(error),
        retryable: true,
      }
    }
  }

  /**
   * Renomeia um arquivo
   */
  static async renameFile(oldPath: string, newName: string): Promise<FileOperationResult> {
    try {
      logger.info(`Renomeando arquivo ${oldPath} para ${newName}`, { context: "FileService" })

      // Verificar se o arquivo existe
      const bunnyClient = getBunnyClient()
      const checkResponse = await bunnyClient.get(`/${oldPath}`)

      if (checkResponse.status === 404) {
        logger.error(`Arquivo ${oldPath} não encontrado para renomeação`, { context: "FileService" })
        return {
          success: false,
          error: "Arquivo não encontrado",
          details: `O arquivo ${oldPath} não existe`,
          retryable: false,
        }
      }

      if (!checkResponse.ok) {
        const errorText = await checkResponse.text().catch(() => "Erro desconhecido")
        logger.error(`Erro ao verificar arquivo para renomeação: ${checkResponse.status}`, {
          context: "FileService",
          data: { status: checkResponse.status, text: errorText },
        })

        return {
          success: false,
          error: `Erro ao verificar arquivo: ${checkResponse.status}`,
          details: errorText,
          retryable: checkResponse.status >= 500,
        }
      }

      // Renomear o arquivo
      const newUrl = await renameBunnyFile(oldPath, newName)

      // Extrair o diretório e construir o novo caminho
      const lastSlashIndex = oldPath.lastIndexOf("/")
      const directory = lastSlashIndex >= 0 ? oldPath.substring(0, lastSlashIndex + 1) : ""
      const newPath = directory + newName

      // Verificar se o arquivo foi renomeado corretamente
      const verifyOldResponse = await bunnyClient.get(`/${oldPath}`)
      const verifyNewResponse = await bunnyClient.get(`/${newPath}`)

      if (verifyOldResponse.ok) {
        logger.warn(`Arquivo original ${oldPath} ainda existe após a renomeação`, { context: "FileService" })
      }

      if (verifyNewResponse.status === 404) {
        logger.error(`Novo arquivo ${newPath} não foi criado`, { context: "FileService" })
        return {
          success: false,
          error: "Falha na renomeação: o novo arquivo não foi criado",
          details: `O arquivo ${newPath} não existe após a tentativa de renomeação`,
          retryable: true,
        }
      }

      logger.info(`Arquivo renomeado com sucesso para ${newName}`, { context: "FileService" })

      return {
        success: true,
        data: {
          message: "Arquivo renomeado com sucesso",
          newPath,
          newUrl,
        },
      }
    } catch (error) {
      logger.error("Erro ao renomear arquivo", {
        context: "FileService",
        data: { oldPath, newName, error },
      })

      return {
        success: false,
        error: "Erro ao renomear arquivo",
        details: error instanceof Error ? error.message : String(error),
        retryable: true,
      }
    }
  }
}
