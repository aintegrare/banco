"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function BlogSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/blog/busca?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <Input
        type="text"
        placeholder="Buscar no blog..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 pr-20 py-2 border-gray-200 dark:border-gray-700 focus:border-[#4b7bb5] dark:focus:border-[#6b91c1] focus:ring-[#4b7bb5] dark:focus:ring-[#6b91c1]"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Button
        type="submit"
        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 py-0 px-3 bg-[#4b7bb5] hover:bg-[#3d649e] text-white"
      >
        Buscar
      </Button>
    </form>
  )
}
