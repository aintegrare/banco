"use client"

import { useState, useEffect } from "react"
import { Box, Typography, CircularProgress, Alert } from "@mui/material"
import FileList from "@/components/admin/file-list"
import { checkBunnyCredentials } from "@/lib/bunny"

export default function FilesClient() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [configStatus, setConfigStatus] = useState<{
    configured: boolean
    missing: string[]
  }>({ configured: false, missing: [] })

  useEffect(() => {
    const checkConfig = async () => {
      try {
        // Verificar se as credenciais do Bunny.net estão configuradas
        const status = checkBunnyCredentials()
        setConfigStatus(status)

        if (!status.configured) {
          setError(`Configurações do Bunny.net incompletas. Faltando: ${status.missing.join(", ")}`)
        }
      } catch (err) {
        console.error("Erro ao verificar configurações:", err)
        setError("Erro ao verificar configurações do Bunny.net")
      } finally {
        setLoading(false)
      }
    }

    checkConfig()
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body1">
          Verifique as variáveis de ambiente necessárias para a conexão com o Bunny.net.
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: "100%" }}>
      {!configStatus.configured ? (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Algumas configurações do Bunny.net estão faltando: {configStatus.missing.join(", ")}
        </Alert>
      ) : null}
      <FileList initialDirectory="documents" />
    </Box>
  )
}
