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
  Settings,
  ChevronRight,
  Zap,
  Star,
  DollarSign,
  MessageSquare,
  FileText,
  Filter,
  X,
  ChevronDown,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"

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
  onGenerateContent?: (modelId: string) => void
  onAnalyzePost?: (modelId: string) => void
  onChatPrompt?: (modelId: string) => void
}

export default function AIModels({
  selectedModel,
  setSelectedModel,
  onGenerateContent,
  onAnalyzePost,
  onChatPrompt,
}: AIModelsProps) {
  const [models, setModels] = useState<AIModel[]>([])
  const [filteredModels, setFilteredModels] = useState<AIModel[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [expandedModel, setExpandedModel] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

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
    setExpandedModel(modelId === expandedModel ? null : modelId)
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
          <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)} className="h-10 w-10">
            <Filter className="h-4 w-4" />
          </Button>
          {searchQuery && (
            <Button variant="outline" size="icon" onClick={() => setSearchQuery("")} className="h-10 w-10">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {showFilters && (
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
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {filteredModels.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum modelo encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredModels.map((model) => (
                <Card
                  key={model.id}
                  className={`cursor-pointer transition-all hover:border-[#4b7bb5] ${
                    selectedModel === model.id ? "border-[#4b7bb5] bg-blue-50" : ""
                  } ${model.status !== "active" ? "opacity-70" : ""}`}
                  onClick={() => model.status === "active" && handleSelectModel(model.id)}
                >
                  <CardHeader className="pb-2 px-4 pt-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        {renderIcon(model.category)}
                        <CardTitle className="text-base font-semibold">{model.name}</CardTitle>
                      </div>
                      <Badge
                        variant={model.status === "active" ? "outline" : "secondary"}
                        className={model.status === "active" ? "bg-green-50 text-green-700" : ""}
                      >
                        {model.status === "active" ? "Ativo" : "Em breve"}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs mt-1 line-clamp-2">{model.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="pb-2 px-4">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {model.capabilities.slice(0, 2).map((capability: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-white text-xs">
                          {capability}
                        </Badge>
                      ))}
                      {model.capabilities.length > 2 && (
                        <Badge variant="outline" className="bg-white text-xs">
                          +{model.capabilities.length - 2}
                        </Badge>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0 px-4 pb-4 flex justify-between items-center">
                    {selectedModel === model.id ? (
                      <Badge className="bg-[#4b7bb5]">
                        <Check className="h-3 w-3 mr-1" /> Selecionado
                      </Badge>
                    ) : (
                      model.status === "active" && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 px-2">
                                <Zap className="h-3.5 w-3.5 mr-1" />
                                <span className="text-xs">Aplicar</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Selecionar este modelo</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedModel(expandedModel === model.id ? null : model.id)
                      }}
                    >
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${expandedModel === model.id ? "rotate-180" : ""}`}
                      />
                      <span className="text-xs ml-1">Detalhes</span>
                    </Button>
                  </CardFooter>

                  {expandedModel === model.id && (
                    <div className="px-4 pb-4 pt-0 border-t">
                      <Collapsible defaultOpen>
                        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium py-2">
                          <span>Ações Rápidas</span>
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {onGenerateContent && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onGenerateContent(model.id)
                                }}
                              >
                                <FileText className="h-3 w-3 mr-1" />
                                Gerar Conteúdo
                              </Button>
                            )}

                            {onAnalyzePost && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onAnalyzePost(model.id)
                                }}
                              >
                                <BarChart3 className="h-3 w-3 mr-1" />
                                Analisar Post
                              </Button>
                            )}

                            {onChatPrompt && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onChatPrompt(model.id)
                                }}
                              >
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Chat
                              </Button>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Settings className="h-3 w-3 mr-1" />
                              Configurar
                            </Button>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>

                      <Accordion type="single" collapsible className="w-full mt-2">
                        <AccordionItem value="capabilities">
                          <AccordionTrigger className="text-xs py-2">Capacidades</AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-1">
                              {model.capabilities.map((capability, i) => (
                                <li key={i} className="text-xs flex items-start">
                                  <ChevronRight className="h-3 w-3 mr-1 text-[#4b7bb5] shrink-0 mt-0.5" />
                                  <span>{capability}</span>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="metrics">
                          <AccordionTrigger className="text-xs py-2">Métricas</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="flex items-center">
                                    <Star className="h-3 w-3 mr-1 text-amber-500" />
                                    Precisão
                                  </span>
                                  <span className="text-[#4b7bb5] font-medium">{model.metrics.accuracy}%</span>
                                </div>
                                <Progress value={model.metrics.accuracy} className="h-1.5" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="flex items-center">
                                    <Zap className="h-3 w-3 mr-1 text-blue-500" />
                                    Velocidade
                                  </span>
                                  <span className="text-[#4b7bb5] font-medium">{model.metrics.speed}%</span>
                                </div>
                                <Progress value={model.metrics.speed} className="h-1.5" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="flex items-center">
                                    <DollarSign className="h-3 w-3 mr-1 text-green-500" />
                                    Custo
                                  </span>
                                  <span className="text-[#4b7bb5] font-medium">{model.metrics.cost}%</span>
                                </div>
                                <Progress value={model.metrics.cost} className="h-1.5" />
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
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
