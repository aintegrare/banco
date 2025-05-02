"use client"

import { CheckCircle, Clock, AlertCircle } from "lucide-react"

interface ProjectMetricsProps {
  project: {
    progress: number
  }
  tasks: Array<{
    status: string
    priority: string
    dueDate: string
  }>
}

export function ProjectMetrics({ project, tasks }: ProjectMetricsProps) {
  // Calcular métricas
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "done").length
  const pendingTasks = totalTasks - completedTasks
  const highPriorityTasks = tasks.filter((task) => task.priority === "alta").length

  // Verificar tarefas atrasadas
  const today = new Date()
  const overdueTasks = tasks.filter((task) => {
    const dueDate = new Date(task.dueDate)
    return dueDate < today && task.status !== "done"
  }).length

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-medium text-gray-800 mb-4">Visão Geral</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Progresso</p>
              <p className="text-2xl font-semibold mt-1">{project.progress}%</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#4b7bb5] bg-opacity-10 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#4b7bb5] flex items-center justify-center text-white">
                {project.progress}%
              </div>
            </div>
          </div>
          <div className="mt-2 bg-gray-200 h-2 rounded-full">
            <div className="bg-[#4b7bb5] h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tarefas Concluídas</p>
              <p className="text-2xl font-semibold mt-1">
                {completedTasks}/{totalTasks}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle size={24} className="text-green-500" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {Math.round((completedTasks / totalTasks) * 100) || 0}% concluído
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tarefas Pendentes</p>
              <p className="text-2xl font-semibold mt-1">{pendingTasks}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Clock size={24} className="text-blue-500" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">{highPriorityTasks} com alta prioridade</div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tarefas Atrasadas</p>
              <p className="text-2xl font-semibold mt-1">{overdueTasks}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle size={24} className="text-red-500" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">Necessitam atenção imediata</div>
        </div>
      </div>
    </div>
  )
}
