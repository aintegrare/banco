"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Calendar, MoreVertical, Edit, Trash2, Share2 } from "lucide-react"

interface ProjectHeaderProps {
  project: {
    id: string
    name: string
    description: string
    status: string
    client: string
    startDate: string
    endDate: string
    budget: string
  }
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Link href="/projetos" className="mr-4 text-gray-500 hover:text-[#4b7bb5]">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
          <span className="ml-4 px-3 py-1 text-xs font-medium rounded-full bg-[#4b7bb5] bg-opacity-10 text-[#4b7bb5]">
            {project.status}
          </span>
        </div>

        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
            <MoreVertical size={20} />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200 py-1">
              <button className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Edit size={16} className="mr-2" />
                Editar projeto
              </button>
              <button className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Share2 size={16} className="mr-2" />
                Compartilhar
              </button>
              <button className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                <Trash2 size={16} className="mr-2" />
                Arquivar projeto
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-600 mb-6">{project.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Cliente</p>
          <p className="font-medium">{project.client}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Data de início</p>
          <div className="flex items-center">
            <Calendar size={16} className="mr-2 text-gray-400" />
            <p className="font-medium">{formatDate(project.startDate)}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Data de término</p>
          <div className="flex items-center">
            <Calendar size={16} className="mr-2 text-gray-400" />
            <p className="font-medium">{formatDate(project.endDate)}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Orçamento</p>
          <p className="font-medium">{project.budget}</p>
        </div>
      </div>
    </div>
  )
}
