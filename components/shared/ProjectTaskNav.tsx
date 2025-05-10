"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FolderKanban, BarChart3 } from "lucide-react"

export function ProjectTaskNav() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-4 mb-6">
      <Link
        href="/projetos"
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          pathname.startsWith("/projetos") ? "bg-[#4b7bb5] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        <FolderKanban size={18} />
        <span>Projetos</span>
      </Link>

      <Link
        href="/tarefas"
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          pathname.startsWith("/tarefas") ? "bg-[#4b7bb5] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        <BarChart3 size={18} />
        <span>Tarefas</span>
      </Link>
    </div>
  )
}
