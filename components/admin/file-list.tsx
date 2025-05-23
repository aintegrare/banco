"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Breadcrumbs,
  Link,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import {
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  CreateNewFolder as CreateNewFolderIcon,
  Search as SearchIcon,
  ArrowUpward as ArrowUpwardIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface File {
  name: string
  type: "directory" | "file"
  modified: string
  size: number
  path: string
  url?: string
}

interface FileListProps {
  initialDirectory?: string
}

export { FileList }
export default function FileList({ initialDirectory = "documents" }: FileListProps) {
  const [files, setFiles] = useState<File[]>([])
  const [currentPath, setCurrentPath] = useState<string[]>([initialDirectory])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [creatingFolder, setCreatingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<File | null>(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  })

  const getCurrentPathString = () => currentPath.join("/")

  const fetchFiles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/files?directory=${getCurrentPathString()}`)
      if (!response.ok) {
        throw new Error(`Erro ao buscar arquivos: ${response.status}`)
      }
      const data = await response.json()

      if (data.files && Array.isArray(data.files)) {
        // Transformar os dados para o formato esperado pelo componente
        const formattedFiles = data.files.map((file: any) => ({
          name: file.ObjectName,
          type: file.IsDirectory ? "directory" : "file",
          modified: file.LastChanged,
          size: Math.floor(file.Length / 1024), // Converter para KB
          path: file.Path,
          url: file.PublicUrl,
        }))
        setFiles(formattedFiles)
      } else {
        setFiles([])
        console.warn("Formato de dados inválido:", data)
      }
    } catch (err) {
      console.error("Erro ao buscar arquivos:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido ao buscar arquivos")
      setFiles([])
    } finally {
      setLoading(false)
    }
  }, [currentPath])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  const handlePathClick = (index: number) => {
    const newPath = currentPath.slice(0, index + 1)
    setCurrentPath(newPath)
  }

  const handleDirectoryClick = (directoryName: string) => {
    setCurrentPath([...currentPath, directoryName])
  }

  const handleParentDirectory = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1))
    }
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const filteredFiles = files.filter((file) => {
    if (!file || !file.name) return false
    return file.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      setUploading(true)
      try {
        for (const file of acceptedFiles) {
          const formData = new FormData()
          formData.append("file", file)
          formData.append("directory", getCurrentPathString())

          const response = await fetch("/api/files/upload", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || `Erro ao fazer upload: ${response.status}`)
          }
        }

        setSnackbar({
          open: true,
          message: `${acceptedFiles.length} arquivo(s) enviado(s) com sucesso!`,
          severity: "success",
        })

        // Atualizar a lista de arquivos
        fetchFiles()
      } catch (err) {
        console.error("Erro ao fazer upload:", err)
        setSnackbar({
          open: true,
          message: err instanceof Error ? err.message : "Erro ao fazer upload de arquivos",
          severity: "error",
        })
      } finally {
        setUploading(false)
      }
    },
    [fetchFiles],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleDeleteClick = (file: File) => {
    setFileToDelete(file)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return

    try {
      const response = await fetch("/api/files/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: fileToDelete.path }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Erro ao excluir: ${response.status}`)
      }

      setSnackbar({
        open: true,
        message: "Arquivo excluído com sucesso!",
        severity: "success",
      })

      // Atualizar a lista de arquivos
      fetchFiles()
    } catch (err) {
      console.error("Erro ao excluir arquivo:", err)
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : "Erro ao excluir arquivo",
        severity: "error",
      })
    } finally {
      setShowDeleteDialog(false)
      setFileToDelete(null)
    }
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      setSnackbar({
        open: true,
        message: "Nome da pasta não pode estar vazio",
        severity: "error",
      })
      return
    }

    setCreatingFolder(true)
    try {
      const response = await fetch("/api/files/create-directory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: `${getCurrentPathString()}/${newFolderName}` }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Erro ao criar pasta: ${response.status}`)
      }

      setSnackbar({
        open: true,
        message: "Pasta criada com sucesso!",
        severity: "success",
      })

      // Limpar o campo e atualizar a lista
      setNewFolderName("")
      fetchFiles()
    } catch (err) {
      console.error("Erro ao criar pasta:", err)
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : "Erro ao criar pasta",
        severity: "error",
      })
    } finally {
      setCreatingFolder(false)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <Box sx={{ width: "100%" }}>
      {/* Breadcrumbs de navegação */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ flexGrow: 1 }}>
          {currentPath.map((segment, index) => (
            <Link
              key={index}
              component="button"
              variant="body1"
              onClick={() => handlePathClick(index)}
              color={index === currentPath.length - 1 ? "text.primary" : "inherit"}
              sx={{ textDecoration: "none" }}
            >
              {segment}
            </Link>
          ))}
        </Breadcrumbs>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ArrowUpwardIcon />}
            onClick={handleParentDirectory}
            disabled={currentPath.length <= 1}
          >
            Voltar
          </Button>
          <Button variant="outlined" size="small" startIcon={<RefreshIcon />} onClick={fetchFiles} disabled={loading}>
            Atualizar
          </Button>
        </Box>
      </Box>

      {/* Barra de pesquisa e criação de pasta */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Pesquisar"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: "action.active", mr: 1 }} />,
          }}
          sx={{ flexGrow: 1 }}
        />

        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            label="Nova pasta"
            variant="outlined"
            size="small"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            disabled={creatingFolder}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<CreateNewFolderIcon />}
            onClick={handleCreateFolder}
            disabled={creatingFolder || !newFolderName.trim()}
          >
            {creatingFolder ? <CircularProgress size={24} /> : "Criar"}
          </Button>
        </Box>
      </Box>

      {/* Área de upload */}
      <Paper
        {...getRootProps()}
        sx={{
          p: 2,
          mb: 2,
          border: "2px dashed",
          borderColor: isDragActive ? "primary.main" : "divider",
          bgcolor: isDragActive ? "action.hover" : "background.paper",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <CircularProgress size={40} sx={{ mb: 1 }} />
            <Typography>Enviando arquivos...</Typography>
          </Box>
        ) : isDragActive ? (
          <Typography>Solte os arquivos aqui...</Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <UploadIcon sx={{ fontSize: 40, mb: 1, color: "action.active" }} />
            <Typography>Arraste e solte arquivos aqui, ou clique para selecionar</Typography>
          </Box>
        )}
      </Paper>

      {/* Mensagem de erro */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Tabela de arquivos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Modificado</TableCell>
              <TableCell>Tamanho</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredFiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Nenhum arquivo encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredFiles.map((file) => (
                <TableRow key={file.name} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {file.type === "directory" ? (
                        <FolderIcon sx={{ mr: 1, color: "primary.main" }} />
                      ) : (
                        <FileIcon sx={{ mr: 1, color: "text.secondary" }} />
                      )}
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() =>
                          file.type === "directory" ? handleDirectoryClick(file.name) : window.open(file.url, "_blank")
                        }
                        sx={{ textDecoration: "none" }}
                      >
                        {file.name}
                      </Link>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {file.modified
                      ? formatDistanceToNow(new Date(file.modified), { addSuffix: true, locale: ptBR })
                      : "-"}
                  </TableCell>
                  <TableCell>{file.type === "directory" ? "-" : `${file.size} KB`}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(file)}
                      disabled={file.type === "directory"}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir o arquivo "{fileToDelete?.name}"? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensagens */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
