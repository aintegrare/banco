"use client"

import Link from "next/link"
import { Folder, Clock, Users, MoreVertical, CheckSquare } from "lucide-react"
import { useState } from "react"

interface ProjectCardProps {
  project: {
    id: string
    name: string
    description: string
    tasksCount: number
    membersCount: number
    lastUpdated: string
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow relative group">
      <Link href={`/projetos/${project.id}`} className="block p-6">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full bg-[#4b7bb5] flex items-center justify-center text-white">
            <Folder size={20} />
          </div>
          <h3 className="ml-3 text-lg font-medium text-gray-800">{project.name}</h3>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <CheckSquare size={16} className="mr-1" />
            <span>{project.tasksCount} tarefas</span>
          </div>
          <div className="flex items-center">
            <Users size={16} className="mr-1" />
            <span>{project.membersCount}</span>
          </div>
        </div>

        <div className="flex items-center mt-3 text-xs text-gray-500">
          <Clock size={14} className="mr-1" />
          <span>Atualizado em {formatDate(project.lastUpdated)}</span>
        </div>
      </Link>

      {/* Menu button */}
      <button
        className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.preventDefault()
          setShowMenu(!showMenu)
        }}
      >
        <MoreVertical size={16} />
      </button>

      {/* Dropdown menu */}
      {showMenu && (
        <div
          className="absolute top-12 right-4 bg-white rounded-md shadow-lg z-10 border border-gray-200 py-1 w-40"
          onClick={(e) => e.stopPropagation()}
        >
          <Link href={`/projetos/${project.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Ver detalhes
          </Link>
          <Link
            href={`/tarefas?projeto=${project.id}`}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Ver tarefas
          </Link>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Editar projeto</button>
          <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Arquivar</button>
        </div>
      )}
    </div>
  )
}
