"use client"

import { useState, useEffect } from "react"
import { logger } from "@/lib/logger"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Info, AlertTriangle, Bug, RefreshCw, Download, Trash2 } from "lucide-react"

type LogLevel = "debug" | "info" | "warn" | "error" | "all"

export function LogViewer() {
  const [logs, setLogs] = useState<
    Array<{ level: string; message: string; context?: string; data?: any; timestamp: Date }>
  >([])
  const [filter, setFilter] = useState<LogLevel>("all")
  const [isAutoRefresh, setIsAutoRefresh] = useState(false)

  const fetchLogs = () => {
    // @ts-ignore - Acessando a propriedade interna do logger
    const allLogs = logger.getRecentLogs(100)
    setLogs(allLogs)
  }

  useEffect(() => {
    fetchLogs()

    let interval: NodeJS.Timeout | null = null

    if (isAutoRefresh) {
      interval = setInterval(fetchLogs, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isAutoRefresh])

  const filteredLogs = filter === "all" ? logs : logs.filter((log) => log.level === filter)

  const downloadLogs = () => {
    const logText = filteredLogs
      .map(
        (log) =>
          `[${log.timestamp.toISOString()}] [${log.level.toUpperCase()}] [${log.context || "App"}] ${log.message}${log.data ? " " + JSON.stringify(log.data) : ""}`,
      )
      .join("\n")

    const blob = new Blob([logText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `logs-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const clearLogs = () => {
    // @ts-ignore - Acessando a propriedade interna do logger
    logger.clearLogs()
    fetchLogs()
  }

  const getLogIcon = (level: string) => {
    switch (level) {
      case "debug":
        return <Bug className="h-4 w-4 text-purple-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      case "warn":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getLogClass = (level: string) => {
    switch (level) {
      case "debug":
        return "bg-purple-50 border-purple-200"
      case "info":
        return "bg-blue-50 border-blue-200"
      case "warn":
        return "bg-amber-50 border-amber-200"
      case "error":
        return "bg-red-50 border-red-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Logs do Sistema</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchLogs} title="Atualizar logs">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className={isAutoRefresh ? "bg-blue-50 text-blue-600 border-blue-200" : ""}
            title={isAutoRefresh ? "Desativar atualização automática" : "Ativar atualização automática"}
          >
            Auto {isAutoRefresh ? "ON" : "OFF"}
          </Button>
          <Button variant="outline" size="sm" onClick={downloadLogs} title="Baixar logs">
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearLogs}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            title="Limpar logs"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <div className="px-6 pb-2">
        <Tabs defaultValue="all" value={filter} onValueChange={(value) => setFilter(value as LogLevel)}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="debug" className="text-purple-600">
              Debug
            </TabsTrigger>
            <TabsTrigger value="info" className="text-blue-600">
              Info
            </TabsTrigger>
            <TabsTrigger value="warn" className="text-amber-600">
              Avisos
            </TabsTrigger>
            <TabsTrigger value="error" className="text-red-600">
              Erros
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <CardContent>
        <div className="max-h-96 overflow-y-auto border rounded-md">
          {filteredLogs.length === 0 ? (
            <div className="p-4 text-center text-gray-500">Nenhum log encontrado</div>
          ) : (
            <div className="divide-y">
              {filteredLogs.map((log, index) => (
                <div key={index} className={`p-3 ${getLogClass(log.level)}`}>
                  <div className="flex items-start">
                    <div className="mr-2 mt-0.5">{getLogIcon(log.level)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <span className="font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                        <span className="mx-1">•</span>
                        <span className="font-medium">{log.context || "App"}</span>
                      </div>
                      <p className="text-sm">{log.message}</p>
                      {log.data && (
                        <details className="mt-1">
                          <summary className="text-xs cursor-pointer hover:underline">Detalhes</summary>
                          <pre className="mt-1 p-2 bg-white bg-opacity-50 rounded text-xs overflow-auto max-h-32 border border-current border-opacity-10">
                            {typeof log.data === "object" ? JSON.stringify(log.data, null, 2) : String(log.data)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
