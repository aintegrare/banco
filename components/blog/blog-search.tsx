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
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-bold text-[#4072b0] mb-4">Buscar no Blog</h3>
      <div className="flex">
        <input
          type="text"
          placeholder="O que você procura?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#4b7bb5]"
        />
        <Button className="bg-[#4b7bb5] hover:bg-[#3d649e] rounded-l-none">
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
