"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipForward, SkipBack } from "lucide-react"

interface VideoPreviewProps {
  fileUrl: string
  fileName: string
  onClose: () => void
}

export function VideoPreview({ fileUrl, fileName, onClose }: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Inicializar o vídeo quando o componente montar
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handleError = () => {
      setError("Erro ao carregar o vídeo. Verifique se o formato é suportado pelo seu navegador.")
      setIsLoading(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("error", handleError)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("error", handleError)
      video.removeEventListener("ended", handleEnded)
    }
  }, [])

  // Função para alternar entre play e pause
  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }

    setIsPlaying(!isPlaying)
  }

  // Função para atualizar o tempo do vídeo
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newTime = Number.parseFloat(e.target.value)
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  // Função para atualizar o volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = Number.parseFloat(e.target.value)
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  // Função para alternar mudo
  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.volume = volume || 0.5
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }

  // Função para alternar tela cheia
  const toggleFullscreen = () => {
    const container = containerRef.current
    if (!container) return

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  // Detectar mudanças no estado de tela cheia
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Função para avançar 10 segundos
  const skipForward = () => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.min(video.currentTime + 10, video.duration)
  }

  // Função para retroceder 10 segundos
  const skipBackward = () => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(video.currentTime - 10, 0)
  }

  // Formatar tempo em MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div
        ref={containerRef}
        className="bg-black rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative"
      >
        {/* Cabeçalho */}
        <div className="p-4 flex justify-between items-center bg-gray-900 text-white">
          <h3 className="font-medium flex items-center truncate">{fileName}</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Área do vídeo */}
        <div className="relative flex-1 bg-black flex items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="animate-spin h-10 w-10 border-3 border-[#4b7bb5] border-t-transparent rounded-full"></div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-white text-center p-4">
                <p className="text-red-500 font-medium mb-2">Erro ao carregar o vídeo</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            src={fileUrl}
            className="max-w-full max-h-[70vh] w-full h-full object-contain"
            onClick={togglePlay}
            playsInline
          />

          {/* Overlay de controles que aparece ao passar o mouse */}
          <div className="absolute inset-0 flex flex-col justify-end opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-t from-black/70 to-transparent">
            {/* Controles de vídeo */}
            <div className="p-4 text-white">
              {/* Barra de progresso */}
              <div className="flex items-center mb-2">
                <span className="text-sm mr-2">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-1.5 bg-gray-600 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #4b7bb5 ${(currentTime / (duration || 1)) * 100}%, #4b4b4b ${
                      (currentTime / (duration || 1)) * 100
                    }%)`,
                  }}
                />
                <span className="text-sm ml-2">{formatTime(duration)}</span>
              </div>

              {/* Botões de controle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={skipBackward}
                    className="p-1.5 hover:bg-gray-800 rounded-full transition-colors"
                    title="Retroceder 10 segundos"
                  >
                    <SkipBack size={20} />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="p-2 bg-[#4b7bb5] hover:bg-[#3d649e] rounded-full transition-colors"
                    title={isPlaying ? "Pausar" : "Reproduzir"}
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                  <button
                    onClick={skipForward}
                    className="p-1.5 hover:bg-gray-800 rounded-full transition-colors"
                    title="Avançar 10 segundos"
                  >
                    <SkipForward size={20} />
                  </button>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <button
                      onClick={toggleMute}
                      className="p-1.5 hover:bg-gray-800 rounded-full transition-colors"
                      title={isMuted ? "Ativar som" : "Desativar som"}
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1.5 bg-gray-600 rounded-full appearance-none cursor-pointer ml-2"
                      style={{
                        background: `linear-gradient(to right, #4b7bb5 ${(isMuted ? 0 : volume) * 100}%, #4b4b4b ${
                          (isMuted ? 0 : volume) * 100
                        }%)`,
                      }}
                    />
                  </div>
                  <button
                    onClick={toggleFullscreen}
                    className="p-1.5 hover:bg-gray-800 rounded-full transition-colors"
                    title={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
                  >
                    {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
