"use client"

import type React from "react"
import { forwardRef, useImperativeHandle, useState, useEffect, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Breadcrumbs,
  Link,
  TextField,
  InputAdornment,
  CircularProgress,
  Box,
  Alert,
  Snackbar,
} from "@mui/material"
import FolderIcon from "@mui/icons-material/Folder"
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"
import DeleteIcon from "@mui/icons-material/Delete"
import UploadIcon from "@mui/icons-material/Upload"
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder"
import SearchIcon from "@mui/icons-material/Search"
import { styled } from "@mui/material/styles"
import { deleteFile, getFiles, uploadFile, createDirectory } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface File {
  name: string
  type: "directory" | "file"
  modified: string
  size: number
}

interface FileListProps {
  initialDirectory?: string
}

// Adicionar interface para o ref
interface FileListRef {
  fetchFiles: () => void
  refresh: () => void
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
}))

// Modificar a exportação para usar forwardRef
export const FileList = forwardRef<FileListRef, FileListProps>(({ initialDirectory = "documents" }, ref) => {
  const [files, setFiles] = useState<File[]>([])
  const [currentPath, setCurrentPath] = useState<string[]>([initialDirectory])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [creatingDirectory, setCreatingDirectory] = useState(false)
  const [newDirectoryName, setNewDirectoryName] = useState("")
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  const getCurrentPathString = () => currentPath.join("/")

  const fetchFiles = useCallback(async (path: string) => {
    setLoading(true)
    try {
      const filesData = await getFiles(path)
      // Garantir que filesData é um array válido
      if (Array.isArray(filesData)) {
        setFiles(filesData)
      } else {
        setFiles([])
        console.warn("Dados de arquivos inválidos recebidos:", filesData)
      }
    } catch (error: any) {
      console.error("Error fetching files:", error)
      setSnackbarMessage(`Error fetching files: ${error.message}`)
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
      setFiles([]) // Definir array vazio em caso de erro
    } finally {
      setLoading(false)
    }
  }, [])

  // Verificar autenticação com Supabase
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = getSupabaseClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/admin/login")
          return
        }

        setIsAuthenticated(true)
        fetchFiles(getCurrentPathString())
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
        router.push("/admin/login")
      }
    }

    checkAuth()
  }, [fetchFiles, router])

  const handlePathClick = (index: number) => {
    const newPath = currentPath.slice(0, index + 1)
    setCurrentPath(newPath)
    fetchFiles(newPath.join("/"))
  }

  const handleDirectoryClick = (directoryName: string) => {
    const newPath = [...currentPath, directoryName]
    setCurrentPath(newPath)
    fetchFiles(newPath.join("/"))
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value || "")
  }

  // Adicionar verificações de segurança no filtro
  const filteredFiles = files.filter((file) => {
    if (!file || !file.name) return false
    const fileName = file.name.toLowerCase()
    const query = (searchQuery || "").toLowerCase()
    return fileName.includes(query)
  })

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true)
      try {
        await Promise.all(
          acceptedFiles.map(async (file: any) => {
            await uploadFile(getCurrentPathString(), file)
          }),
        )
        setSnackbarMessage("Files uploaded successfully!")
        setSnackbarSeverity("success")
        setSnackbarOpen(true)
        fetchFiles(getCurrentPathString()) // Refresh file list
      } catch (error: any) {
        console.error("Error uploading files:", error)
        setSnackbarMessage(`Error uploading files: ${error.message}`)
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      } finally {
        setUploading(false)
      }
    },
    [fetchFiles],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleDeleteFile = async (fileName: string) => {
    try {
      await deleteFile(getCurrentPathString(), fileName)
      setSnackbarMessage("File deleted successfully!")
      setSnackbarSeverity("success")
      setSnackbarOpen(true)
      fetchFiles(getCurrentPathString()) // Refresh file list
    } catch (error: any) {
      console.error("Error deleting file:", error)
      setSnackbarMessage(`Error deleting file: ${error.message}`)
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    }
  }

  const handleCreateDirectory = async () => {
    if (!newDirectoryName.trim()) {
      setSnackbarMessage("Please enter a directory name")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
      return
    }

    setCreatingDirectory(true)
    try {
      await createDirectory(getCurrentPathString(), newDirectoryName)
      setSnackbarMessage("Directory created successfully!")
      setSnackbarSeverity("success")
      setSnackbarOpen(true)
      fetchFiles(getCurrentPathString()) // Refresh file list
      setNewDirectoryName("")
    } catch (error: any) {
      console.error("Error creating directory:", error)
      setSnackbarMessage(`Error creating directory: ${error.message}`)
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    } finally {
      setCreatingDirectory(false)
    }
  }

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return
    }
    setSnackbarOpen(false)
  }

  // Adicionar useImperativeHandle para expor métodos
  useImperativeHandle(ref, () => ({
    fetchFiles: () => fetchFiles(getCurrentPathString()),
    refresh: () => fetchFiles(getCurrentPathString()),
  }))

  // Se não estiver autenticado, não renderizar nada
  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="#" onClick={() => handlePathClick(0)}>
            Home
          </Link>
          {currentPath.slice(1).map((path, index) => {
            const pathIndex = index + 1
            return (
              <Link
                key={pathIndex}
                underline="hover"
                color="inherit"
                href="#"
                onClick={() => handlePathClick(pathIndex)}
              >
                {path}
              </Link>
            )
          })}
        </Breadcrumbs>

        <TextField
          size="small"
          placeholder="Search files"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <div
          {...getRootProps()}
          style={{ border: "1px dashed gray", padding: "20px", textAlign: "center", cursor: "pointer" }}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <CircularProgress size={24} />
          ) : isDragActive ? (
            <Typography>Drop the files here ...</Typography>
          ) : (
            <Typography>
              Drag 'n' drop some files here, or click to select files <UploadIcon />
            </Typography>
          )}
        </div>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            size="small"
            label="New directory name"
            value={newDirectoryName}
            onChange={(e) => setNewDirectoryName(e.target.value)}
            disabled={creatingDirectory}
          />
          <IconButton onClick={handleCreateDirectory} disabled={creatingDirectory || !newDirectoryName.trim()}>
            {creatingDirectory ? <CircularProgress size={24} /> : <CreateNewFolderIcon />}
          </IconButton>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Modified</TableCell>
              <TableCell>Size</TableCell>
              <TableCell align="right">Actions</TableCell>
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
                  No files found.
                </TableCell>
              </TableRow>
            ) : (
              filteredFiles.map((file) => (
                <TableRow key={file.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {file.type === "directory" ? (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
                        onClick={() => handleDirectoryClick(file.name)}
                      >
                        <FolderIcon color="primary" />
                        {file.name || "Unnamed"}
                      </Box>
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <InsertDriveFileIcon />
                        {file.name || "Unnamed"}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    {file.modified
                      ? formatDistanceToNow(new Date(file.modified), { addSuffix: true, locale: ptBR })
                      : "Unknown"}
                  </TableCell>
                  <TableCell>{file.size ? `${file.size} KB` : "Unknown"}</TableCell>
                  <TableCell align="right">
                    {file.type === "file" && (
                      <IconButton aria-label="delete" onClick={() => handleDeleteFile(file.name)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
})

FileList.displayName = "FileList"

// Manter a exportação default também
export default FileList
