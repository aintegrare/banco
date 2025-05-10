"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function BlogSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/blog/busca?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-[#4072b0] mb-4">Buscar no Blog</h3>
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="O que você procura?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pr-10 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
        />
        <Button
          type="submit"
          className="absolute right-1 top-1 h-8 w-8 p-0 bg-[#4b7bb5] hover:bg-[#3d649e]"
          aria-label="Buscar"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>
      <div className="mt-3">
        <p className="text-xs text-gray-500 mb-2">Sugestões de busca:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSearchTerm("marketing digital")}
            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
          >
            Marketing Digital
          </button>
          <button
            onClick={() => setSearchTerm("seo")}
            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
          >
            SEO
          </button>
          <button
            onClick={() => setSearchTerm("redes sociais")}
            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
          >
            Redes Sociais
          </button>
        </div>
      </div>
    </div>
  )
}
