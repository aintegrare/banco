"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BlogSearch() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/blog/busca?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-bold text-[#4072b0] mb-4">Buscar</h3>
      <form onSubmit={handleSearch} className="flex space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar no blog..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button type="submit" className="bg-[#4b7bb5] hover:bg-[#3d649e]">
          Buscar
        </Button>
      </form>
    </div>
  )
}
