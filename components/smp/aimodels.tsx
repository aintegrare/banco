"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Sparkles, Calculator, Instagram, Facebook, Twitter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface AIModel {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: string
  provider: string
  isNew?: boolean
  comingSoon?: boolean
}

export default function AIModels({
  selectedModel,
  setSelectedModel,
}: {
  selectedModel: string
  setSelectedModel: (id: string) => void
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [providerFilter, setProviderFilter] = useState<string | null>(null)

  const aiModels: AIModel[] = [
    {
      id: "instagram-feed",
      name: "Feed Instagram",
      description: "Modelo para posts no feed do Instagram",
      icon: <Instagram size={20} />,
      category: "Instagram",
      provider: "Integrare",
    },
    {
      id: "instagram-stories",
      name: "Stories Instagram",
      description: "Modelo para stories do Instagram",
      icon: <Instagram size={20} />,
      category: "Instagram",
      provider: "Integrare",
    },
    {
      id: "facebook-post",
      name: "Post Facebook",
      description: "Modelo para posts no Facebook",
      icon: <Facebook size={20} />,
      category: "Facebook",
      provider: "Integrare",
      isNew: true,
    },
    {
      id: "facebook-carousel",
      name: "Carrossel Facebook",
      description: "Modelo para carrossel no Facebook",
      icon: <Facebook size={20} />,
      category: "Facebook",
      provider: "Integrare",
    },
    {
      id: "twitter-post",
      name: "Tweet Padrão",
      description: "Modelo para tweets informativos",
      icon: <Twitter size={20} />,
      category: "Twitter",
      provider: "Integrare",
      isNew: true,
    },
    {
      id: "content-calendar",
      name: "Calendário de Conteúdo",
      description: "Modelo para planejamento mensal de conteúdo",
      icon: <Calculator size={20} />,
      category: "Planejamento",
      provider: "Integrare",
    },
    {
      id: "campaign-template",
      name: "Template de Campanha",
      description: "Estrutura para campanhas completas",
      icon: <Sparkles size={20} />,
      category: "Planejamento",
      provider: "Integrare",
      comingSoon: true,
    },
  ]

  const categories = ["Todos", ...new Set(aiModels.map((model) => model.category))]
  const providers = ["Todos", ...new Set(aiModels.map((model) => model.provider))]

  const filteredModels = aiModels.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = !categoryFilter || categoryFilter === "Todos" || model.category === categoryFilter
    const matchesProvider = !providerFilter || providerFilter === "Todos" || model.provider === providerFilter

    return matchesSearch && matchesCategory && matchesProvider
  })

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 h-full flex flex-col">
      <motion.div
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-lg font-medium text-gray-800">Templates de Conteúdo</h2>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Plus size={16} className="text-gray-600" />
        </Button>
      </motion.div>

      <div className="relative w-full mb-4">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={16} className="text-gray-500" />
        </div>
        <Input
          type="text"
          className="pl-9"
          placeholder="Buscar templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-1">Categorias:</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={categoryFilter === category ? "default" : "outline"}
              className={
                categoryFilter === category
                  ? "bg-[#4b7bb5] hover:bg-[#3d649e] cursor-pointer"
                  : "hover:bg-gray-100 cursor-pointer"
              }
              onClick={() => setCategoryFilter(category === "Todos" ? null : category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        <p className="text-xs text-gray-500 mb-1">Provedores:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {providers.map((provider) => (
            <Badge
              key={provider}
              variant={providerFilter === provider ? "default" : "outline"}
              className={
                providerFilter === provider
                  ? "bg-[#4b7bb5] hover:bg-[#3d649e] cursor-pointer"
                  : "hover:bg-gray-100 cursor-pointer"
              }
              onClick={() => setProviderFilter(provider === "Todos" ? null : provider)}
            >
              {provider}
            </Badge>
          ))}
        </div>
      </div>

      <div className="overflow-y-auto flex-grow">
        <div className="grid gap-3">
          {filteredModels.map((model) => (
            <Card
              key={model.id}
              className={`cursor-pointer transition-all ${model.comingSoon ? "opacity-70" : ""} ${
                selectedModel === model.id ? "border-[#4b7bb5] shadow-sm" : "hover:border-gray-300"
              }`}
              onClick={() => !model.comingSoon && setSelectedModel(model.id)}
            >
              <CardHeader className="p-3 pb-0">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#edf2f7] flex items-center justify-center">
                      <div className="text-[#4b7bb5]">{model.icon}</div>
                    </div>
                    <CardTitle className="text-sm font-medium">{model.name}</CardTitle>
                  </div>
                  {model.isNew && <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Novo</Badge>}
                  {model.comingSoon && (
                    <Badge variant="outline" className="text-gray-500">
                      Em breve
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-2">
                <CardDescription className="text-xs">{model.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
        <p className="text-sm text-gray-600">
          Precisa de um template personalizado? <br />
          <span className="text-[#4b7bb5] cursor-pointer hover:underline">Entre em contato</span>
        </p>
      </div>
    </div>
  )
}
