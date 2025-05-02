"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Clock, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react"

interface ProjectTasksProps {
  tasks: Array<{
    id: string
    title: string
    description: string
    status: string
    dueDate: string
    assignee: string
    priority: string
  }>
}

export function ProjectTasks({ tasks }: ProjectTasksProps) {
  const [filter, setFilter] = useState("all")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    })
  }

  const isOverdue = (dateString: string) => {
    const today = new Date()
    const dueDate = new Date(dateString)
    return dueDate < today
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "text-red-500 bg-red-50"
      case "média":
        return "text-orange-500 bg-orange-50"
      case "baixa":
        return "text-green-500 bg-green-50"
      default:
        return "text-gray-500 bg-gray-50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle size={16} className="text-green-500" />
      case "in-progress":
        return <Clock size={16} className="text-blue-500" />
      case "review":
        return <AlertTriangle size={16} className="text-orange-500" />
      default:
        return null
    }
  }

  // Filtrar tarefas
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true
    if (filter === "pending") return task.status !== "done"
    if (filter === "completed") return task.status === "done"
    if (filter === "overdue") return isOverdue(task.dueDate) && task.status !== "done"
    return true
  })

  // Ordenar tarefas por data de vencimento
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const dateA = new Date(a.dueDate)
    const dateB = new Date(b.dueDate)
    return dateA.getTime() - dateB.getTime()
  })

  // Limitar a 5 tarefas
  const displayTasks = sortedTasks.slice(0, 5)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-800">Tarefas</h2>

        <div className="flex space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 text-xs rounded-full ${
              filter === "all" ? "bg-[#4b7bb5] text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 text-xs rounded-full ${
              filter === "pending" ? "bg-[#4b7bb5] text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            Pendentes
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1 text-xs rounded-full ${
              filter === "completed" ? "bg-[#4b7bb5] text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            Concluídas
          </button>
          <button
            onClick={() => setFilter("overdue")}
            className={`px-3 py-1 text-xs rounded-full ${
              filter === "overdue" ? "bg-[#4b7bb5] text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            Atrasadas
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {displayTasks.length > 0 ? (
          displayTasks.map((task) => (
            <Link href={`/tarefas/${task.id}`} key={task.id} className="block">
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">{getStatusIcon(task.status)}</div>
                    <div>
                      <h3 className="font-medium text-gray-800">{task.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1 mt-1">{task.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <div
                      className={`flex items-center mt-2 text-xs ${
                        isOverdue(task.dueDate) && task.status !== "done" ? "text-red-500" : "text-gray-500"
                      }`}
                    >
                      <Calendar size={14} className="mr-1" />
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Responsável: {task.assignee}</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">Nenhuma tarefa encontrada para os filtros selecionados</div>
        )}
      </div>

      {tasks.length > 5 && (
        <div className="mt-4 text-center">
          <Link
            href={`/tarefas?projeto=${tasks[0]?.projectId}`}
            className="inline-flex items-center text-sm text-[#4b7bb5] hover:underline"
          >
            Ver todas as tarefas
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      )}
    </div>
  )
}
