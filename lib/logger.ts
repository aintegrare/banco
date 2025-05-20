type LogLevel = "debug" | "info" | "warn" | "error"

interface LogOptions {
  context?: string
  data?: any
  timestamp?: boolean
}

class Logger {
  private static instance: Logger
  private logLevel: LogLevel = "info"
  private enableConsole = true
  private logs: Array<{ level: LogLevel; message: string; context?: string; data?: any; timestamp: Date }> = []
  private maxLogs = 1000

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  public setLogLevel(level: LogLevel): void {
    this.logLevel = level
  }

  public enableConsoleLogs(enable: boolean): void {
    this.enableConsole = enable
  }

  public debug(message: string, options?: LogOptions): void {
    this.log("debug", message, options)
  }

  public info(message: string, options?: LogOptions): void {
    this.log("info", message, options)
  }

  public warn(message: string, options?: LogOptions): void {
    this.log("warn", message, options)
  }

  public error(message: string, options?: LogOptions): void {
    this.log("error", message, options)
  }

  public getRecentLogs(
    count = 50,
    level?: LogLevel,
  ): Array<{ level: LogLevel; message: string; context?: string; data?: any; timestamp: Date }> {
    let filteredLogs = this.logs
    if (level) {
      filteredLogs = this.logs.filter((log) => log.level === level)
    }
    return filteredLogs.slice(-count)
  }

  public clearLogs(): void {
    this.logs = []
  }

  private log(level: LogLevel, message: string, options?: LogOptions): void {
    const logLevels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    }

    // Verificar se o nível de log atual permite este log
    if (logLevels[level] < logLevels[this.logLevel]) {
      return
    }

    const timestamp = new Date()
    const context = options?.context || "App"
    const data = options?.data
    const includeTimestamp = options?.timestamp !== false

    // Formatar a mensagem para o console
    let formattedMessage = `[${level.toUpperCase()}] [${context}]`
    if (includeTimestamp) {
      formattedMessage = `${timestamp.toISOString()} ${formattedMessage}`
    }
    formattedMessage = `${formattedMessage}: ${message}`

    // Armazenar o log
    this.logs.push({
      level,
      message,
      context,
      data,
      timestamp,
    })

    // Limitar o número de logs armazenados
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // Exibir no console se habilitado
    if (this.enableConsole) {
      switch (level) {
        case "debug":
          console.debug(formattedMessage, data || "")
          break
        case "info":
          console.info(formattedMessage, data || "")
          break
        case "warn":
          console.warn(formattedMessage, data || "")
          break
        case "error":
          console.error(formattedMessage, data || "")
          break
      }
    }
  }
}

export const logger = Logger.getInstance()
