"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Calendar, FileText, ArrowUpRight } from "lucide-react"
import { formatDate, formatCurrency } from "@/lib/utils"
import Link from "next/link"

// Dados de exemplo - seriam substituídos por dados reais da API
const mockProjects = [
  {
    id: "1",
    name: "Redesign do Website",
    description: "Redesign completo do website corporativo com foco em conversão",
    status: "in_progress",
    startDate: "2023-03-15",
    endDate: "2023-06-30",
    value: 12000,
  },
  {
    id: "2",
    name: "Campanha de Marketing Digital",
    description: "Campanha de marketing digital para lançamento de produto",
    status: "completed",
    startDate: "2023-01-10",
    endDate: "2023-03-10",
    value: 8500,
  },
  {
    id: "3",
    name: "Otimização de SEO",
    description: "Otimização de SEO para melhorar o posicionamento nos motores de busca",
    status: "planned",
    startDate: "2023-07-01",
    endDate: "2023-09-30",
    value: 4500,
  },
]

interface ClientProjectsProps {
  clientId: string
}

export function ClientProjects({ clientId }: ClientProjectsProps) {
  const [projects, setProjects] = useState(mockProjects)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "planned":
        return "bg-amber-100 text-amber-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluído"
      case "in_progress":
        return "Em Andamento"
      case "planned":
        return "Planejado"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Projetos</h3>

        <Link href={`/projetos/novo?clientId=${clientId}`}>
          <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Projeto
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">Nenhum projeto registrado.</CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex border-l-4 border-[#4b7bb5]">
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-[#3d649e]">{project.name}</h4>
                        <div className="text-sm text-gray-500 flex items-center gap-4">
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            {formatDate(project.startDate)} - {formatDate(project.endDate)}
                          </div>
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                        {getStatusText(project.status)}
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-3">{project.description}</p>

                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium text-[#4b7bb5]">{formatCurrency(project.value)}</div>
                      <Link href={`/projetos/${project.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 text-[#4b7bb5] hover:text-[#3d649e]">
                          <FileText className="h-4 w-4 mr-1" />
                          Ver Detalhes
                          <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
