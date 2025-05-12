"use client"

import { useState, useEffect } from "react"
import { loadAIModels, saveUserPreference, type AIModel } from "@/lib/smp-service"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Check,
  Sparkles,
  ImageIcon,
  BarChart3,
  Hash,
  Video,
  Clock,
  TrendingUp,
  Search,
  Settings,
  ChevronRight,
  Zap,
  Star,
  DollarSign,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Mapeamento de ícones
const iconMap: Record<string, any> = {
  content: Sparkles,
  visual: ImageIcon,
  analytics: BarChart3,
  hashtag: Hash,
  video: Video,
  planning: Clock,
  trend: TrendingUp,
}

interface AIModelsProps {
  selectedModel: string
  setSelectedModel: (model: string) => void
}

export default function AIModels({ selectedModel, setSelectedModel }: AIModelsProps) {
  const [models, setModels] = useState<AIModel[]>([])
  const [filteredModels, setFilteredModels] = useState<AIModel[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [expandedModel, setExpandedModel] = useState<string | null>(null)

  // Carregar modelos
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true)
        const data = await loadAIModels()
        setModels(data)
        setFilteredModels(data)
      } catch (error) {
        console.error("Erro ao carregar modelos de IA:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchModels()
  }, [])

  // Filtrar modelos quando a categoria ou busca mudar
  useEffect(() => {
    let filtered = models

    // Filtrar por categoria
    if (activeCategory !== "all") {
      filtered = filtered.filter((model) => model.category === activeCategory)
    }

    // Filtrar por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (model) =>
          model.name.toLowerCase().includes(query) ||
          model.description.toLowerCase().includes(query) ||
          model.capabilities.some((capability: string) => capability.toLowerCase().includes(query)),
      )
    }

    setFilteredModels(filtered)
  }, [models, activeCategory, searchQuery])

  // Obter categorias únicas
  const categories = ["all", ...Array.from(new Set(models.map((model) => model.category)))]

  // Selecionar um modelo
  const handleSelectModel = async (modelId: string) => {
    setSelectedModel(modelId)
    setExpandedModel(modelId)
    await saveUserPreference("current_user", "selected_model", modelId)
  }

  // Renderizar ícone
  const renderIcon = (category: string) => {
    const IconComponent = iconMap[category] || Sparkles
    return <IconComponent className="h-5 w-5 text-[#4b7bb5]" />
  }

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="h-8 bg-gray-200 rounded w-full animate-pulse mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-32 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-32 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-32 bg-gray-200 rounded w-full animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2 mb-4">
          <Input
            placeholder="Buscar modelos de IA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
            <Search className="h-4 w-4 mr-2" />
            Limpar
          </Button>
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="w-full flex overflow-x-auto pb-1 mb-2">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="flex-shrink-0 data-[state=active]:bg-[#4b7bb5] data-[state=active]:text-white"
              >
                {category === "all" ? "Todos" : formatCategoryName(category)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {filteredModels.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum modelo encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredModels.map((model) => (
              <Card
                key={model.id}
                className={`cursor-pointer transition-all hover:border-[#4b7bb5] ${
                  selectedModel === model.id ? "border-[#4b7bb5] bg-blue-50" : ""
                } ${model.status !== "active" ? "opacity-70" : ""}`}
                onClick={() => model.status === "active" && handleSelectModel(model.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      {renderIcon(model.category)}
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                    </div>
                    <Badge
                      variant={model.status === "active" ? "outline" : "secondary"}
                      className={model.status === "active" ? "bg-green-50 text-green-700" : ""}
                    >
                      {model.status === "active" ? "Ativo" : "Em breve"}
                    </Badge>
                  </div>
                  <CardDescription>{model.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {model.capabilities.slice(0, 3).map((capability: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-white">
                        {capability}
                      </Badge>
                    ))}
                    {model.capabilities.length > 3 && (
                      <Badge variant="outline" className="bg-white">
                        +{model.capabilities.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center">
                        <Star className="h-3 w-3 mr-1 text-amber-500" />
                        Precisão
                      </span>
                      <span>{model.metrics.accuracy}%</span>
                    </div>
                    <Progress value={model.metrics.accuracy} className="h-1" />

                    <div className="flex justify-between text-sm">
                      <span className="flex items-center">
                        <Zap className="h-3 w-3 mr-1 text-blue-500" />
                        Velocidade
                      </span>
                      <span>{model.metrics.speed}%</span>
                    </div>
                    <Progress value={model.metrics.speed} className="h-1" />
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="w-full flex justify-between items-center">
                    <span className="text-xs text-gray-500 flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Custo: {model.metrics.cost}%
                    </span>
                    {selectedModel === model.id && (
                      <Badge className="bg-[#4b7bb5]">
                        <Check className="h-3 w-3 mr-1" /> Selecionado
                      </Badge>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {expandedModel && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Detalhes do Modelo</h3>
            {models
              .filter((m) => m.id === expandedModel)
              .map((model) => (
                <div key={model.id} className="space-y-4">
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          {renderIcon(model.category)}
                          <CardTitle className="text-base">{model.name}</CardTitle>
                        </div>
                        <Button variant="outline" size="sm" className="h-8">
                          <Settings className="h-4 w-4 mr-1" />
                          Configurar
                        </Button>
                      </div>
                      <CardDescription>{model.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="capabilities">
                          <AccordionTrigger className="text-sm py-2">Capacidades</AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-1">
                              {model.capabilities.map((capability, i) => (
                                <li key={i} className="text-sm flex items-start">
                                  <ChevronRight className="h-4 w-4 mr-1 text-[#4b7bb5] shrink-0 mt-0.5" />
                                  <span>{capability}</span>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="metrics">
                          <AccordionTrigger className="text-sm py-2">Métricas</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="flex items-center">
                                    <Star className="h-4 w-4 mr-1 text-amber-500" />
                                    Precisão
                                  </span>
                                  <span className="text-[#4b7bb5] font-medium">{model.metrics.accuracy}%</span>
                                </div>
                                <Progress value={model.metrics.accuracy} className="h-2" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="flex items-center">
                                    <Zap className="h-4 w-4 mr-1 text-blue-500" />
                                    Velocidade
                                  </span>
                                  <span className="text-[#4b7bb5] font-medium">{model.metrics.speed}%</span>
                                </div>
                                <Progress value={model.metrics.speed} className="h-2" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="flex items-center">
                                    <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                                    Custo
                                  </span>
                                  <span className="text-[#4b7bb5] font-medium">{model.metrics.cost}%</span>
                                </div>
                                <Progress value={model.metrics.cost} className="h-2" />
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="settings">
                          <AccordionTrigger className="text-sm py-2">Configurações</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3">
                              {Object.entries(model.settings).map(([key, value], i) => (
                                <div key={i} className="flex justify-between items-center">
                                  <span className="text-sm">{formatSettingName(key)}</span>
                                  <Badge
                                    variant={value === true ? "default" : "outline"}
                                    className={value === true ? "bg-[#4b7bb5]" : ""}
                                  >
                                    {value === true ? "Ativo" : "Inativo"}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Função para formatar nomes de categorias
function formatCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    content: "Conteúdo",
    visual: "Visual",
    analytics: "Análise",
    planning: "Planejamento",
  }

  return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1)
}

// Função para formatar nomes de configurações
function formatSettingName(key: string): string {
  // Converter camelCase para espaços e capitalizar primeira letra
  const formatted = key.replace(/([A-Z])/g, " $1").trim()
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}
