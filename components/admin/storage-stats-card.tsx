"use client"

import { useState } from "react"
import { HardDrive, ImageIcon, FileText, Film, Music, Archive, File, PieChart, BarChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface StorageStatsCardProps {
  totalSpace: number
  usedSpace: number
  fileStats?: {
    images: number
    documents: number
    videos: number
    audio: number
    archives: number
    others: number
  }
}

export function StorageStatsCard({ totalSpace, usedSpace, fileStats }: StorageStatsCardProps) {
  const [activeTab, setActiveTab] = useState<string>("overview")
  const [showDetailedStats, setShowDetailedStats] = useState<boolean>(false)

  // Calcular porcentagem de uso
  const usagePercentage = Math.min(Math.round((usedSpace / totalSpace) * 100), 100)

  // Formatar bytes em unidades legíveis
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Determinar a cor da barra de progresso com base no uso
  const getProgressColor = () => {
    if (usagePercentage < 70) return "bg-[#4b7bb5]"
    if (usagePercentage < 90) return "bg-amber-500"
    return "bg-red-500"
  }

  // Determinar a mensagem de status com base no uso
  const getStatusMessage = () => {
    if (usagePercentage < 70) return "Espaço suficiente disponível"
    if (usagePercentage < 90) return "Espaço limitado disponível"
    return "Pouco espaço disponível"
  }

  // Calcular espaço livre
  const freeSpace = totalSpace - usedSpace

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium flex items-center">
            <HardDrive className="h-4 w-4 mr-2 text-[#4b7bb5]" />
            Armazenamento
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetailedStats(!showDetailedStats)}
            className="h-8 w-8 p-0"
          >
            {showDetailedStats ? <BarChart className="h-4 w-4" /> : <PieChart className="h-4 w-4" />}
          </Button>
        </div>
        <CardDescription className="text-xs">
          {formatBytes(usedSpace)} de {formatBytes(totalSpace)} utilizados
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <Progress value={usagePercentage} className={`h-2 ${getProgressColor()}`} />

          <div className="flex justify-between text-xs text-gray-500">
            <span>{usagePercentage}% utilizado</span>
            <span>{formatBytes(freeSpace)} livre</span>
          </div>

          {showDetailedStats && fileStats && (
            <Tabs defaultValue="overview" className="mt-4" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="details">Detalhes</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="pt-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ImageIcon className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="text-xs">Imagens</span>
                    </div>
                    <span className="text-xs font-medium">{formatBytes(fileStats.images)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-red-500" />
                      <span className="text-xs">Documentos</span>
                    </div>
                    <span className="text-xs font-medium">{formatBytes(fileStats.documents)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Film className="h-4 w-4 mr-2 text-purple-500" />
                      <span className="text-xs">Vídeos</span>
                    </div>
                    <span className="text-xs font-medium">{formatBytes(fileStats.videos)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Music className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-xs">Áudio</span>
                    </div>
                    <span className="text-xs font-medium">{formatBytes(fileStats.audio)}</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="pt-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Archive className="h-4 w-4 mr-2 text-amber-500" />
                      <span className="text-xs">Arquivos</span>
                    </div>
                    <span className="text-xs font-medium">{formatBytes(fileStats.archives)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <File className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-xs">Outros</span>
                    </div>
                    <span className="text-xs font-medium">{formatBytes(fileStats.others)}</span>
                  </div>

                  <div className="h-[1px] bg-gray-200 my-2"></div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Total</span>
                    <span className="text-xs font-medium">{formatBytes(usedSpace)}</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-xs text-gray-500">{getStatusMessage()}</p>
      </CardFooter>
    </Card>
  )
}
