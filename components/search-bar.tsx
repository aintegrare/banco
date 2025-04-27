"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        router.push(`/?q=${encodeURIComponent(searchQuery)}`)
      } else {
        router.push("/")
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery, router])

  return (
    <div className="relative mb-4">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-primary" />
      <Input
        type="search"
        placeholder="Buscar contatos..."
        className="pl-8 border-primary/30 focus-visible:ring-primary/30"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  )
}
