import { listBunnyFiles } from "@/lib/bunny"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  Folder,
  FileText,
  ImageIcon,
  Film,
  Music,
  Archive,
  FileIcon,
  ChevronRight,
  Download,
  ArrowLeft,
} from "lucide-react"

interface SharedPageProps {
  params: {
    path: string[]
  }
}

export default async function SharedPage({ params }: SharedPageProps) {
  // Decodificar e juntar os segmentos do caminho
  const pathSegments = params.path.map((segment) => decodeURIComponent(segment))
  const fullPath = pathSegments.join("/")

  try {
    // Buscar arquivos e pastas no caminho especificado
    const files = await listBunnyFiles(fullPath)

    // Se for um único arquivo, redirecionar para a URL pública
    if (files.length === 1 && !files[0].IsDirectory) {
      return (
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <h1 className="text-2xl font-bold text-gray-900">Arquivo Compartilhado</h1>
                <p className="text-gray-500 mt-1">Você está visualizando um arquivo compartilhado da Integrare.</p>
              </div>

              <div className="p-6">
                <div className="flex items-center mb-6">
                  <FileIcon className="h-8 w-8 text-[#4b7bb5] mr-3" />
                  <div>
                    <h2 className="text-lg font-medium">{files[0].ObjectName}</h2>
                    <p className="text-sm text-gray-500">
                      {formatBytes(files[0].Length)} • Última modificação: {formatDate(files[0].LastChanged)}
                    </p>
                  </div>
                </div>

                {isImage(files[0].ObjectName) ? (
                  <div className="mt-4 flex justify-center">
                    <div className="max-w-2xl border rounded-lg overflow-hidden shadow-sm">
                      <Image
                        src={files[0].PublicUrl || "/placeholder.svg"}
                        alt={files[0].ObjectName}
                        width={800}
                        height={600}
                        className="max-w-full h-auto"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-8 border rounded-lg flex flex-col items-center justify-center bg-gray-50">
                    {getFileIcon(files[0].ObjectName, 64)}
                    <p className="mt-4 text-gray-700">Visualização não disponível para este tipo de arquivo.</p>
                  </div>
                )}

                <div className="mt-6 flex justify-center">
                  <a
                    href={files[0].PublicUrl}
                    download
                    className="inline-flex items-center px-4 py-2 bg-[#4b7bb5] text-white rounded-md hover:bg-[#3d649e] transition-colors"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Baixar Arquivo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Renderizar lista de arquivos e pastas
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-900">Pasta Compartilhada</h1>
              <p className="text-gray-500 mt-1">Você está visualizando uma pasta compartilhada da Integrare.</p>
            </div>

            {/* Breadcrumbs */}
            <div className="px-6 py-3 bg-gray-50 border-b flex items-center overflow-x-auto">
              <Link href="/shared" className="text-[#4b7bb5] hover:underline flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Início
              </Link>

              {pathSegments.length > 0 && <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />}

              {pathSegments.map((segment, index) => (
                <div key={index} className="flex items-center">
                  <Link
                    href={`/shared/${pathSegments.slice(0, index + 1).join("/")}`}
                    className={`hover:underline ${
                      index === pathSegments.length - 1 ? "font-medium text-gray-900" : "text-[#4b7bb5]"
                    }`}
                  >
                    {segment}
                  </Link>
                  {index < pathSegments.length - 1 && <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />}
                </div>
              ))}
            </div>

            {/* Lista de arquivos */}
            <div className="p-6">
              {files.length === 0 ? (
                <div className="text-center py-12">
                  <Folder className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">Pasta vazia</h3>
                  <p className="text-gray-500 mt-1">Esta pasta não contém nenhum arquivo ou subpasta.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {files.map((file) => (
                    <Link
                      key={file.ObjectName}
                      href={
                        file.IsDirectory
                          ? `/shared/${fullPath}/${file.ObjectName}`.replace(/\/+/g, "/").replace(/^\//, "")
                          : file.PublicUrl
                      }
                      target={file.IsDirectory ? "_self" : "_blank"}
                      className="block p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full mr-3">
                          {file.IsDirectory ? (
                            <Folder className="h-6 w-6 text-[#4b7bb5]" />
                          ) : (
                            getFileIcon(file.ObjectName, 24)
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <h3 className="font-medium text-gray-900 truncate">{file.ObjectName}</h3>
                          <p className="text-xs text-gray-500">
                            {file.IsDirectory ? "Pasta" : formatBytes(file.Length)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Integrare. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Erro ao buscar arquivos compartilhados:", error)
    notFound()
  }
}

// Função para formatar bytes em unidades legíveis
function formatBytes(bytes = 0) {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Função para formatar data
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

// Verificar se é uma imagem
function isImage(filename: string) {
  const fileType = filename.split(".").pop()?.toLowerCase() || ""
  return ["jpg", "jpeg", "png", "gif", "webp"].includes(fileType)
}

// Obter ícone com base no tipo de arquivo
function getFileIcon(filename: string, size: number) {
  const fileType = filename.split(".").pop()?.toLowerCase() || ""

  if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileType)) {
    return <ImageIcon size={size} className="text-green-500" />
  } else if (["pdf"].includes(fileType)) {
    return <FileText size={size} className="text-red-500" />
  } else if (["mp4", "avi", "mov", "webm"].includes(fileType)) {
    return <Film size={size} className="text-purple-500" />
  } else if (["mp3", "wav", "ogg"].includes(fileType)) {
    return <Music size={size} className="text-blue-500" />
  } else if (["zip", "rar", "7z", "tar", "gz"].includes(fileType)) {
    return <Archive size={size} className="text-amber-500" />
  } else {
    return <FileIcon size={size} className="text-gray-500" />
  }
}
