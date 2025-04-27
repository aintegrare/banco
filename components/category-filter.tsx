"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getCategories } from "@/app/actions"
import type { Category } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

export function CategoryFilter() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("categoria") || ""
  const currentQuery = searchParams.get("q") || ""

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true)
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (error) {
        console.error("Erro ao carregar categorias:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams()

    if (currentQuery) {
      params.set("q", currentQuery)
    }

    if (categoryId !== currentCategory) {
      params.set("categoria", categoryId)
    }

    const queryString = params.toString() ? `?${params.toString()}` : ""
    router.push(`/${queryString}`)
  }

  const clearFilter = () => {
    const params = new URLSearchParams()

    if (currentQuery) {
      params.set("q", currentQuery)
    }

    const queryString = params.toString() ? `?${params.toString()}` : ""
    router.push(`/${queryString}`)
  }

  if (loading) {
    return <div className="h-8 animate-pulse bg-muted rounded-md"></div>
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant={!currentCategory ? "default" : "outline"}
        size="sm"
        onClick={() => clearFilter()}
        className="flex items-center"
      >
        Todos
        {!currentCategory && <Check className="ml-1 h-3 w-3" />}
      </Button>

      {categories.map((category) => (
        <Button
          key={category.id}
          variant={currentCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryClick(category.id)}
          style={{
            backgroundColor: currentCategory === category.id ? "#4b7bb5" : "transparent",
            color: currentCategory === category.id ? "#f2f1ef" : undefined,
            borderColor: "#4b7bb5",
          }}
        >
          {category.name}
          {currentCategory === category.id && <Check className="ml-1 h-3 w-3" />}
        </Button>
      ))}

      {currentCategory && (
        <Button variant="ghost" size="sm" onClick={() => clearFilter()} className="ml-2">
          <X className="h-3 w-3 mr-1" />
          Limpar filtro
        </Button>
      )}
    </div>
  )
}
