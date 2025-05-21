"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter, X, Calendar, FileType, ChevronDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface AdvancedSearchProps {
  onSearch: (params: SearchParams) => void
  fileTypes?: string[]
}

export interface SearchParams {
  query: string
  fileTypes: string[]
  dateFrom?: Date
  dateTo?: Date
  minSize?: number
  maxSize?: number
}

export function AdvancedSearch({ onSearch, fileTypes = [] }: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([])
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [minSize, setMinSize] = useState<string>("")
  const [maxSize, setMaxSize] = useState<string>("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // Função para limpar todos os filtros
  const clearAllFilters = () => {
    setSelectedFileTypes([])
    setDateFrom(undefined)
    setDateTo(undefined)
    setMinSize("")
    setMaxSize("")
    setActiveFilters([])
  }

  // Função para remover um filtro específico
  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))

    if (filter === "fileTypes") {
      setSelectedFileTypes([])
    } else if (filter === "dateRange") {
      setDateFrom(undefined)
      setDateTo(undefined)
    } else if (filter === "sizeRange") {
      setMinSize("")
      setMaxSize("")
    }
  }

  // Função para adicionar um filtro
  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter])
    }
  }

  // Função para converter tamanho para bytes
  const sizeToBytes = (size: string): number | undefined => {
    if (!size) return undefined

    const value = Number.parseFloat(size)
    if (isNaN(value)) return undefined

    const unit = size
      .replace(/[0-9.]/g, "")
      .trim()
      .toLowerCase()

    switch (unit) {
      case "kb":
        return value * 1024
      case "mb":
        return value * 1024 * 1024
      case "gb":
        return value * 1024 * 1024 * 1024
      default:
        return value
    }
  }

  // Função para executar a busca
  const handleSearch = () => {
    const params: SearchParams = {
      query: searchQuery,
      fileTypes: selectedFileTypes,
      dateFrom,
      dateTo,
      minSize: sizeToBytes(minSize),
      maxSize: sizeToBytes(maxSize),
    }

    onSearch(params)
    setIsOpen(false)
  }

  // Função para busca rápida (sem filtros)
  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch({ query: searchQuery, fileTypes: [] })
  }

  return (
    <div className="w-full max-w-xl">
      <form onSubmit={handleQuickSearch} className="relative flex w-full">
        <Input
          type="text"
          placeholder="Buscar arquivos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-20"
        />

        <div className="absolute right-0 top-0 h-full flex items-center">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-full rounded-l-none border-l" type="button">
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <h3 className="font-medium">Busca Avançada</h3>
                <p className="text-xs text-gray-500 mt-1">Refine sua busca com filtros adicionais</p>
              </div>

              <div className="p-4 space-y-4">
                {/* Filtro por tipo de arquivo */}
                <div>
                  <button
                    type="button"
                    onClick={() => addFilter("fileTypes")}
                    className="flex items-center text-sm text-gray-700 hover:text-gray-900"
                  >
                    <FileType className="h-4 w-4 mr-2" />
                    <span>Tipo de arquivo</span>
                    {!activeFilters.includes("fileTypes") && <ChevronDown className="h-4 w-4 ml-auto" />}
                  </button>

                  {activeFilters.includes("fileTypes") && (
                    <div className="mt-2 border rounded-md">
                      <Command>
                        <CommandInput placeholder="Buscar tipos de arquivo..." />
                        <CommandList>
                          <CommandEmpty>Nenhum tipo encontrado.</CommandEmpty>
                          <CommandGroup>
                            {fileTypes.map((type) => (
                              <CommandItem
                                key={type}
                                onSelect={() => {
                                  setSelectedFileTypes(
                                    selectedFileTypes.includes(type)
                                      ? selectedFileTypes.filter((t) => t !== type)
                                      : [...selectedFileTypes, type],
                                  )
                                }}
                              >
                                <div
                                  className={cn(
                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                    selectedFileTypes.includes(type)
                                      ? "bg-primary text-primary-foreground"
                                      : "opacity-50",
                                  )}
                                >
                                  {selectedFileTypes.includes(type) && <Check className="h-3 w-3" />}
                                </div>
                                <span>{type.toUpperCase()}</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>

                      {selectedFileTypes.length > 0 && (
                        <div className="p-2 flex flex-wrap gap-1">
                          {selectedFileTypes.map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {type.toUpperCase()}
                              <button
                                onClick={() => setSelectedFileTypes(selectedFileTypes.filter((t) => t !== type))}
                                className="ml-1 hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Filtro por data */}
                <div>
                  <button
                    type="button"
                    onClick={() => addFilter("dateRange")}
                    className="flex items-center text-sm text-gray-700 hover:text-gray-900"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Intervalo de datas</span>
                    {!activeFilters.includes("dateRange") && <ChevronDown className="h-4 w-4 ml-auto" />}
                  </button>

                  {activeFilters.includes("dateRange") && (
                    <div className="mt-2 space-y-2">
                      <div>
                        <label className="text-xs text-gray-500">De:</label>
                        <div className="border rounded-md p-2">
                          <CalendarComponent mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-gray-500">Até:</label>
                        <div className="border rounded-md p-2">
                          <CalendarComponent
                            mode="single"
                            selected={dateTo}
                            onSelect={setDateTo}
                            initialFocus
                            disabled={(date) => (dateFrom ? date < dateFrom : false)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Filtro por tamanho */}
                <div>
                  <button
                    type="button"
                    onClick={() => addFilter("sizeRange")}
                    className="flex items-center text-sm text-gray-700 hover:text-gray-900"
                  >
                    <FileType className="h-4 w-4 mr-2" />
                    <span>Tamanho do arquivo</span>
                    {!activeFilters.includes("sizeRange") && <ChevronDown className="h-4 w-4 ml-auto" />}
                  </button>

                  {activeFilters.includes("sizeRange") && (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <div>
                          <label className="text-xs text-gray-500">Mínimo:</label>
                          <Input
                            type="text"
                            placeholder="Ex: 1MB"
                            value={minSize}
                            onChange={(e) => setMinSize(e.target.value)}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-gray-500">Máximo:</label>
                          <Input
                            type="text"
                            placeholder="Ex: 10MB"
                            value={maxSize}
                            onChange={(e) => setMaxSize(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <p className="text-xs text-gray-500">Use KB, MB ou GB para especificar a unidade (ex: 5MB)</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="p-4 flex justify-between">
                <Button variant="ghost" size="sm" onClick={clearAllFilters} disabled={activeFilters.length === 0}>
                  Limpar filtros
                </Button>

                <Button size="sm" onClick={handleSearch}>
                  Buscar
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button type="submit" variant="ghost" size="icon" className="h-full">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Mostrar filtros ativos */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {activeFilters.map((filter) => {
            let label = ""
            let count = 0

            if (filter === "fileTypes" && selectedFileTypes.length > 0) {
              label = "Tipos"
              count = selectedFileTypes.length
            } else if (filter === "dateRange" && (dateFrom || dateTo)) {
              label = "Datas"
              count = (dateFrom ? 1 : 0) + (dateTo ? 1 : 0)
            } else if (filter === "sizeRange" && (minSize || maxSize)) {
              label = "Tamanho"
              count = (minSize ? 1 : 0) + (maxSize ? 1 : 0)
            } else {
              return null
            }

            if (count === 0) return null

            return (
              <Badge key={filter} variant="outline" className="text-xs">
                {label}: {count}
                <button onClick={() => removeFilter(filter)} className="ml-1 hover:text-red-500">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )
          })}

          {activeFilters.length > 0 && (
            <Button variant="ghost" size="sm" className="h-5 text-xs px-2" onClick={clearAllFilters}>
              Limpar todos
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
