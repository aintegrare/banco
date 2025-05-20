"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2, FileText, BarChart, PieChart, Calendar, Download } from "lucide-react"
import { exportPostsReport } from "@/lib/smp-service"

export function ReportGenerator() {
  const [loading, setLoading] = useState(false)
  const [reportType, setReportType] = useState<"summary" | "detailed" | "analytics">("summary")
  const [dateRange, setDateRange] = useState<"7days" | "30days" | "90days" | "custom">("30days")
  const [format, setFormat] = useState<"pdf" | "json" | "csv">("pdf")

  const [includeOptions, setIncludeOptions] = useState({
    images: true,
    metrics: true,
    hashtags: true,
    connections: false,
    comments: false,
  })

  const handleGenerateReport = async () => {
    setLoading(true)
    try {
      const downloadUrl = await exportPostsReport(format)

      // Simular download
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = `smp-report-${reportType}-${Date.now()}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Relatório gerado",
        description: `O relatório foi gerado com sucesso no formato ${format.toUpperCase()}.`,
      })
    } catch (error) {
      console.error("Erro ao gerar relatório:", error)
      toast({
        title: "Erro",
        description: "Não foi possível gerar o relatório. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleIncludeOption = (option: keyof typeof includeOptions) => {
    setIncludeOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gerador de Relatórios</CardTitle>
        <CardDescription>Configure e exporte relatórios do seu planejamento de conteúdo</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="visual">Visual</TabsTrigger>
            <TabsTrigger value="options">Opções</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Tipo de Relatório</Label>
                <Select value={reportType} onValueChange={(value) => setReportType(value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de relatório" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Resumo
                      </div>
                    </SelectItem>
                    <SelectItem value="detailed">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Detalhado
                      </div>
                    </SelectItem>
                    <SelectItem value="analytics">
                      <div className="flex items-center">
                        <BarChart className="h-4 w-4 mr-2" />
                        Análise de Desempenho
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Período</Label>
                <Select value={dateRange} onValueChange={(value) => setDateRange(value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Últimos 7 dias</SelectItem>
                    <SelectItem value="30days">Últimos 30 dias</SelectItem>
                    <SelectItem value="90days">Últimos 90 dias</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="visual">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Gráficos Incluídos</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-3 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-center h-24">
                      <BarChart className="h-16 w-16 text-[#4b7bb5]" />
                    </div>
                    <p className="text-center text-sm font-medium mt-2">Desempenho por Post</p>
                  </Card>

                  <Card className="p-3 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-center h-24">
                      <PieChart className="h-16 w-16 text-[#4b7bb5]" />
                    </div>
                    <p className="text-center text-sm font-medium mt-2">Distribuição por Tipo</p>
                  </Card>

                  <Card className="p-3 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-center h-24">
                      <Calendar className="h-16 w-16 text-[#4b7bb5]" />
                    </div>
                    <p className="text-center text-sm font-medium mt-2">Calendário de Publicação</p>
                  </Card>

                  <Card className="p-3 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-center h-24">
                      <BarChart className="h-16 w-16 text-[#4b7bb5]" />
                    </div>
                    <p className="text-center text-sm font-medium mt-2">Análise de Hashtags</p>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="options">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Incluir no Relatório</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="images"
                      checked={includeOptions.images}
                      onCheckedChange={() => toggleIncludeOption("images")}
                    />
                    <Label htmlFor="images">Imagens dos posts</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="metrics"
                      checked={includeOptions.metrics}
                      onCheckedChange={() => toggleIncludeOption("metrics")}
                    />
                    <Label htmlFor="metrics">Métricas de desempenho</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hashtags"
                      checked={includeOptions.hashtags}
                      onCheckedChange={() => toggleIncludeOption("hashtags")}
                    />
                    <Label htmlFor="hashtags">Análise de hashtags</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="connections"
                      checked={includeOptions.connections}
                      onCheckedChange={() => toggleIncludeOption("connections")}
                    />
                    <Label htmlFor="connections">Conexões entre posts</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="comments"
                      checked={includeOptions.comments}
                      onCheckedChange={() => toggleIncludeOption("comments")}
                    />
                    <Label htmlFor="comments">Comentários e feedback</Label>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Formato de Exportação</Label>
                <Select value={format} onValueChange={(value) => setFormat(value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateReport} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando relatório...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Gerar Relatório
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
