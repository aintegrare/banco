"use client"

import { useState, useEffect } from "react"
import { loadModules, saveUserPreference, type Module } from "@/lib/smp-service"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Check,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Video,
  Youtube,
  Mail,
  BarChart,
  Target,
  Users,
  FileText,
  MessageCircle,
  Search,
  Settings,
  Calendar,
  ChevronRight,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Mapeamento de ícones
const iconMap: Record<string, any> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  twitter: Twitter,
  video: Video,
  youtube: Youtube,
  mail: Mail,
  "bar-chart": BarChart,
  target: Target,
  users: Users,
  "file-text": FileText,
  "message-circle": MessageCircle,
  calendar: Calendar,
}

interface ModulesTabProps {
  selectedModule: string
  setSelectedModule: (module: string) => void
}

export default function ModulesTab({ selectedModule, setSelectedModule }: ModulesTabProps) {
  const [modules, setModules] = useState<Module[]>([])
  const [filteredModules, setFilteredModules] = useState<Module[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [expandedModule, setExpandedModule] = useState<string | null>(null)

  // Carregar módulos
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true)
        const data = await loadModules()
        setModules(data)
        setFilteredModules(data)
      } catch (error) {
        console.error("Erro ao carregar módulos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchModules()
  }, [])

  // Filtrar módulos quando a categoria ou busca mudar
  useEffect(() => {
    let filtered = modules

    // Filtrar por categoria
    if (activeCategory !== "all") {
      filtered = filtered.filter((module) => module.category === activeCategory)
    }

    // Filtrar por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (module) =>
          module.name.toLowerCase().includes(query) ||
          module.description.toLowerCase().includes(query) ||
          module.features.some((feature: string) => feature.toLowerCase().includes(query)),
      )
    }

    setFilteredModules(filtered)
  }, [modules, activeCategory, searchQuery])

  // Obter categorias únicas
  const categories = ["all", ...Array.from(new Set(modules.map((module) => module.category)))]

  // Selecionar um módulo
  const handleSelectModule = async (moduleId: string) => {
    setSelectedModule(moduleId)
    setExpandedModule(moduleId)
    await saveUserPreference("current_user", "selected_module", moduleId)
  }

  // Renderizar ícone
  const renderIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Settings
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
            placeholder="Buscar módulos..."
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
                {category === "all" ? "Todos" : category === "social" ? "Redes Sociais" : "Planejamento"}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {filteredModules.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum módulo encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredModules.map((module) => (
              <Card
                key={module.id}
                className={`cursor-pointer transition-all hover:border-[#4b7bb5] ${
                  selectedModule === module.id ? "border-[#4b7bb5] bg-blue-50" : ""
                } ${module.status !== "active" ? "opacity-70" : ""}`}
                onClick={() => module.status === "active" && handleSelectModule(module.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      {renderIcon(module.icon)}
                      <CardTitle className="text-lg">{module.name}</CardTitle>
                    </div>
                    <Badge
                      variant={module.status === "active" ? "outline" : "secondary"}
                      className={module.status === "active" ? "bg-green-50 text-green-700" : ""}
                    >
                      {module.status === "active" ? "Ativo" : "Em breve"}
                    </Badge>
                  </div>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {module.features.slice(0, 3).map((feature: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-white">
                        {feature}
                      </Badge>
                    ))}
                    {module.features.length > 3 && (
                      <Badge variant="outline" className="bg-white">
                        +{module.features.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Engajamento</span>
                      <span>{module.metrics.engagement || 0}%</span>
                    </div>
                    <Progress value={module.metrics.engagement || 0} className="h-1" />

                    <div className="flex justify-between text-sm">
                      <span>Alcance</span>
                      <span>{module.metrics.reach || 0}%</span>
                    </div>
                    <Progress value={module.metrics.reach || 0} className="h-1" />
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="w-full flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {Object.keys(module.settings).filter((k) => module.settings[k] === true).length} configurações
                      ativas
                    </span>
                    {selectedModule === module.id && (
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

        {expandedModule && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Detalhes do Módulo</h3>
            {modules
              .filter((m) => m.id === expandedModule)
              .map((module) => (
                <div key={module.id} className="space-y-4">
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          {renderIcon(module.icon)}
                          <CardTitle className="text-base">{module.name}</CardTitle>
                        </div>
                        <Button variant="outline" size="sm" className="h-8">
                          <Settings className="h-4 w-4 mr-1" />
                          Configurar
                        </Button>
                      </div>
                      <CardDescription>{module.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="features">
                          <AccordionTrigger className="text-sm py-2">Recursos</AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-1">
                              {module.features.map((feature, i) => (
                                <li key={i} className="text-sm flex items-start">
                                  <ChevronRight className="h-4 w-4 mr-1 text-[#4b7bb5] shrink-0 mt-0.5" />
                                  <span>{feature}</span>
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
                                  <span>Engajamento</span>
                                  <span className="text-[#4b7bb5] font-medium">{module.metrics.engagement}%</span>
                                </div>
                                <Progress value={module.metrics.engagement} className="h-2" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>Alcance</span>
                                  <span className="text-[#4b7bb5] font-medium">{module.metrics.reach}%</span>
                                </div>
                                <Progress value={module.metrics.reach} className="h-2" />
                              </div>
                              {module.metrics.conversion !== undefined && (
                                <div className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span>Conversão</span>
                                    <span className="text-[#4b7bb5] font-medium">{module.metrics.conversion}%</span>
                                  </div>
                                  <Progress value={module.metrics.conversion} className="h-2" />
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="settings">
                          <AccordionTrigger className="text-sm py-2">Configurações</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3">
                              {Object.entries(module.settings).map(([key, value], i) => (
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

// Função para formatar nomes de configurações
function formatSettingName(key: string): string {
  // Converter camelCase para espaços e capitalizar primeira letra
  const formatted = key.replace(/([A-Z])/g, " $1").trim()
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}
