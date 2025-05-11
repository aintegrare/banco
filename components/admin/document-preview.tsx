"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, ZoomIn, ZoomOut, RotateCw, X, Maximize2, Minimize2 } from "lucide-react"

interface DocumentPreviewProps {
  isOpen: boolean
  onClose: () => void
  file: {
    name: string
    url: string
    fileType?: string
  } | null
}

export function DocumentPreview({ isOpen, onClose, file }: DocumentPreviewProps) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const isPdf = file?.fileType === "pdf"
  const isImage = file?.fileType && ["jpg", "jpeg", "png", "gif", "webp"].includes(file.fileType)

  // Lidar com teclas de atalho
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "+":
          setScale((prev) => Math.min(prev + 0.1, 3))
          break
        case "-":
          setScale((prev) => Math.max(prev - 0.1, 0.5))
          break
        case "r":
          setRotation((prev) => (prev + 90) % 360)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Alternar modo de tela cheia
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true)
        })
        .catch((err) => {
          console.error("Erro ao entrar em modo de tela cheia:", err)
        })
    } else if (document.fullscreenElement) {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(false)
        })
        .catch((err) => {
          console.error("Erro ao sair do modo de tela cheia:", err)
        })
    }
  }

  // Aumentar zoom
  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 3))
  }

  // Diminuir zoom
  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5))
  }

  // Rotacionar documento
  const rotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  // Renderizar conteúdo do documento
  const renderContent = () => {
    if (!file) return null

    if (isPdf) {
      return (
        <div className="flex flex-col items-center w-full h-full">
          <iframe
            ref={iframeRef}
            src={`${file.url}#view=FitH`}
            className="w-full h-full border-0 shadow-lg"
            style={{ minHeight: "70vh" }}
            title={file.name}
          />
        </div>
      )
    } else if (isImage) {
      return (
        <div className="flex justify-center">
          <img
            src={file.url || "/placeholder.svg"}
            alt={file.name}
            style={{
              maxHeight: "70vh",
              maxWidth: "100%",
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              transformOrigin: "center center",
              transition: "transform 0.2s ease",
            }}
            className="shadow-lg"
          />
        </div>
      )
    } else {
      return (
        <div className="text-center py-10">
          <p>Visualização não disponível para este tipo de arquivo.</p>
          <Button asChild className="mt-4 bg-[#4b7bb5] hover:bg-[#3d649e]">
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              Abrir em nova aba
            </a>
          </Button>
        </div>
      )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col" ref={containerRef}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-medium truncate max-w-[70%]">
            {file?.name || "Visualização de documento"}
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </Button>
            <Button variant="outline" size="icon" onClick={onClose} title="Fechar">
              <X size={16} />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-4">{renderContent()}</div>

        <div className="flex justify-between items-center p-4 border-t">
          <div className="flex items-center gap-2">
            {/* Controles específicos para PDFs são removidos, pois o iframe gerencia isso */}
          </div>

          <div className="flex items-center gap-2">
            {!isPdf && (
              <>
                <Button variant="outline" size="sm" onClick={zoomOut} title="Diminuir zoom">
                  <ZoomOut size={16} />
                </Button>
                <span className="text-sm">{Math.round(scale * 100)}%</span>
                <Button variant="outline" size="sm" onClick={zoomIn} title="Aumentar zoom">
                  <ZoomIn size={16} />
                </Button>
                <Button variant="outline" size="sm" onClick={rotate} title="Rotacionar">
                  <RotateCw size={16} />
                </Button>
              </>
            )}
            {file?.url && (
              <Button variant="outline" size="sm" asChild title="Download">
                <a href={file.url} download={file.name}>
                  <Download size={16} className="mr-2" />
                  <span className="hidden sm:inline">Download</span>
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
