"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"

export function ClientFilters() {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="mb-6 p-4 border rounded-lg bg-white">
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Buscar clientes..." className="pl-10" />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center">
          <Filter className="mr-2 h-4 w-4" />
          {showFilters ? "Ocultar Filtros" : "Filtros"}
        </Button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-4">
          <div className="w-full sm:w-auto">
            <select className="w-full sm:w-[180px] h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Status</option>
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
              <option value="lead">Leads</option>
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <select className="w-full sm:w-[180px] h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Segmento</option>
              <option value="all">Todos</option>
              <option value="ecommerce">E-commerce</option>
              <option value="saas">SaaS</option>
              <option value="retail">Varejo</option>
              <option value="education">Educação</option>
              <option value="health">Saúde</option>
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <select className="w-full sm:w-[180px] h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Ordenar por</option>
              <option value="name_asc">Nome (A-Z)</option>
              <option value="name_desc">Nome (Z-A)</option>
              <option value="recent">Mais recentes</option>
              <option value="oldest">Mais antigos</option>
              <option value="value_desc">Maior valor</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
