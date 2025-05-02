"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

// Colunas do quadro Kanban
const COLUMNS = [
  { id: "backlog", title: "Backlog" },
  { id: "todo", title: "A Fazer" },
  { id: "in-progress", title: "Em Progresso" },
  { id: "review", title: "Em Revisão" },
  { id: "done", title: "Concluído" },
]

interface ProjectKanbanProps {
  tasks: Array<{
    id: string
    title: string
    status: string
    assignee: string
    priority: string
    dueDate: string
    projectId: string
  }>
}

export function ProjectKanban({ tasks }: ProjectKanbanProps) {
  const [taskList, setTaskList] = useState(tasks)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "bg-red-500"
      case "média":
        return "bg-orange-500"
      case "baixa":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result

    // Se não houver destino ou se o destino for o mesmo que a origem, não fazer nada
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Atualizar o status da tarefa
    const updatedTasks = taskList.map((task) => {
      if (task.id === draggableId) {
        return { ...task, status: destination.droppableId }
      }
      return task
    })

    setTaskList(updatedTasks)

    // Aqui você faria uma chamada à API para atualizar o status da tarefa no servidor
    console.log(`Tarefa ${draggableId} movida de ${source.droppableId} para ${destination.droppableId}`)
  }

  // Organizar tarefas por coluna
  const tasksByColumn = COLUMNS.reduce((acc: any, column) => {
    acc[column.id] = taskList.filter((task) => task.status === column.id)
    return acc
  }, {})

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-800">Quadro Kanban</h2>
        <Link
          href={`/tarefas?projeto=${tasks[0]?.projectId}`}
          className="inline-flex items-center text-sm text-[#4b7bb5] hover:underline"
        >
          Ver quadro completo
          <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex overflow-x-auto pb-4 -mx-2">
          {COLUMNS.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-64 mx-2 first:ml-0 last:mr-0">
              <div className="bg-gray-100 rounded-lg h-full flex flex-col">
                <div className="p-2 font-medium text-sm text-gray-700 border-b border-gray-200 bg-gray-200 rounded-t-lg flex justify-between items-center">
                  <span>{column.title}</span>
                  <span className="bg-white text-gray-600 text-xs font-normal py-1 px-2 rounded-full">
                    {tasksByColumn[column.id].length}
                  </span>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-grow p-2 overflow-y-auto"
                      style={{ maxHeight: "300px", minHeight: "100px" }}
                    >
                      {tasksByColumn[column.id].map((task: any, index: number) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-2 last:mb-0"
                            >
                              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                                <div className="flex items-start justify-between">
                                  <Link href={`/tarefas/${task.id}`} className="block flex-grow">
                                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{task.title}</h3>
                                  </Link>
                                  <div
                                    className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)} ml-2 flex-shrink-0`}
                                  ></div>
                                </div>
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                                  <div className="flex items-center">
                                    <div className="w-5 h-5 rounded-full bg-[#4b7bb5] flex items-center justify-center text-white text-xs">
                                      {task.assignee.charAt(0)}
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-500">{formatDate(task.dueDate)}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
