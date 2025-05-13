"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, MessageSquare, Paperclip, Edit, Trash2, CheckSquare, X, Loader2 } from "lucide-react"
import { TaskComments } from "@/components/tasks/task-comments"
import { TaskAttachments } from "@/components/tasks/task-attachments"
import { DeleteTaskConfirmation } from "@/components/tasks/delete-task-confirmation"

// Dados de exemplo para tarefas
const SAMPLE_TASKS = [
  {
    id: 1,
    title: "Criar conteúdo para Instagram",
    description: "Desenvolver 10 posts para a campanha de outubro",
    status: "todo",
    projectId: "dr-joel",
    projectName: "Dr. Joel",
    dueDate: "2023-10-25",
    creator: "João Silva",
    assignee: "Ana Silva",
    priority: "medium",
    comments: 3,
    attachments: 2,
    color: "#4b7bb5",
  },
  {
    id: 2,
    title: "Revisar textos do site",
    description: "Revisar e corrigir os textos da página inicial e sobre",
    status: "in-progress",
    projectId: "vanessa-dentista",
    projectName: "Vanessa Dentista",
    dueDate: "2023-10-20",
    creator: "Maria Oliveira",
    assignee: "Carlos Mendes",
    priority: "high",
    comments: 5,
    attachments: 1,
    color: "#e11d48",
  },
  // ... outros dados de exemplo
]

// Mapeamento de status
const STATUS_MAP: Record<string, { label: string; color: string }> = {
  backlog: { label: "Backlog", color: "bg-gray-500" },
  todo: { label: "A Fazer", color: "bg-blue-500" },
  "in-progress": { label: "Em Progresso", color: "bg-yellow-500" },
  review: { label: "Em Revisão", color: "bg-purple-500" },
  done: { label: "Concluído", color: "bg-green-500" },
}

// Lista de status disponíveis
const STATUSES = [
  { id: "backlog", name: "Backlog" },
  { id: "todo", name: "A Fazer" },
  { id: "in-progress", name: "Em Progresso" },
  { id: "review", name: "Em Revisão" },
  { id: "done", name: "Concluído" },
]

// Lista de projetos disponíveis
const PROJECTS = [
  { id: "dr-joel", name: "Dr. Joel" },
  { id: "vanessa-dentista", name: "Vanessa Dentista" },
  { id: "vanessa-cardiologista", name: "Vanessa Cardiologista" },
  { id: "eora", name: "Eora" },
  { id: "medeiros-advogados", name: "Medeiros Advogados" },
  { id: "mateus-arquiteto", name: "Mateus Arquiteto" },
  { id: "billions", name: "Billions" },
  { id: "plucio", name: "Plúcio" },
  { id: "integrare", name: "Integrare" },
]

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [task, setTask] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"comments" | "attachments">("comments")
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState("")
  const [editedDescription, setEditedDescription] = useState("")
  const [editedStatus, setEditedStatus] = useState("")
  const [editedProjectId, setEditedProjectId] = useState("")
  const [editedDueDate, setEditedDueDate] = useState("")
  const [editedAssignee, setEditedAssignee] = useState("")
  const [editedCreator, setEditedCreator] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  useEffect(() => {
    const fetchTask = async () => {
      setIsLoading(true)
      try {
        // Simular chamada à API
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Encontrar a tarefa pelo ID
        const foundTask = SAMPLE_TASKS.find((t) => t.id === Number(params.id))

        if (foundTask) {
          // Adicionar cor padrão se não existir
          if (!foundTask.color) {
            foundTask.color = "#4b7bb5"
          }
          setTask(foundTask)
          setEditedTitle(foundTask.title)
          setEditedDescription(foundTask.description || "")
          setEditedStatus(foundTask.status)
          setEditedProjectId(foundTask.projectId)
          setEditedDueDate(foundTask.dueDate)
          setEditedAssignee(foundTask.assignee || "")
          setEditedCreator(foundTask.creator || "")
        } else {
          // Redirecionar se a tarefa não for encontrada
          router.push("/tarefas")
        }
      } catch (error) {
        console.error("Erro ao carregar tarefa:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchTask()
    }
  }, [params.id, router])

  const handleSaveEdit = async () => {
    if (!editedTitle.trim()) return

    setIsSaving(true)

    try {
      // Simular chamada à API
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Atualizar a tarefa localmente
      const updatedTask = {
        ...task,
        title: editedTitle,
        description: editedDescription,
        status: editedStatus,
        projectId: editedProjectId,
        projectName: PROJECTS.find((p) => p.id === editedProjectId)?.name || "Projeto",
        dueDate: editedDueDate,
        assignee: editedAssignee,
        creator: editedCreator,
        updatedAt: new Date().toISOString(),
      }

      setTask(updatedTask)
      setIsEditing(false)

      // Aqui você faria uma chamada à API para atualizar a tarefa no servidor
      console.log("Tarefa atualizada:", updatedTask)
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteTask = async () => {
    try {
      // Simular chamada à API
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Redirecionar para a lista de tarefas
      router.push("/tarefas")
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  if (isLoading || !task) {
    return (
      <div className="min-h-screen bg-[#f2f1ef] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-[#4b7bb5] border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f2f1ef]">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <Link href="/tarefas" className="text-gray-500 hover:text-[#4b7bb5] mr-4">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex-grow">
              <div className="flex items-center">
                <span className="text-sm text-[#4b7bb5]">{task.projectName}</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm text-gray-500">Tarefa #{task.id}</span>
              </div>
              {!isEditing ? (
                <h1 className="text-xl font-bold text-gray-800">{task.title}</h1>
              ) : (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full text-xl font-bold text-gray-800 border-b border-[#4b7bb5] focus:outline-none py-1"
                  placeholder="Título da tarefa"
                />
              )}
              {!isEditing && (
                <div className="mt-1 flex items-center">
                  <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: task.color || "#4b7bb5" }}></div>
                  <span className="text-sm text-gray-500">Cor da tarefa</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-gray-500 hover:text-[#4b7bb5] hover:bg-gray-100 rounded-full transition-colors"
                    title="Editar tarefa"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirmation(true)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors"
                    title="Excluir tarefa"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors"
                    title="Cancelar edição"
                  >
                    <X size={18} />
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="p-2 text-gray-500 hover:text-green-500 hover:bg-gray-100 rounded-full transition-colors"
                    title="Salvar alterações"
                    disabled={isSaving}
                  >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <CheckSquare size={18} />}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              {!isEditing ? (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-lg font-medium text-gray-800">Descrição</h2>
                  </div>
                  <p className="text-gray-600">{task.description || "Sem descrição."}</p>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-lg font-medium text-gray-800">Descrição</h2>
                  </div>
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="w-full h-32 text-gray-600 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
                    placeholder="Adicione uma descrição..."
                  />
                </>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab("comments")}
                    className={`px-6 py-3 text-sm font-medium flex items-center ${
                      activeTab === "comments"
                        ? "border-b-2 border-[#4072b0] text-[#4072b0]"
                        : "text-gray-500 hover:text-[#6b91c1]"
                    }`}
                  >
                    <MessageSquare size={16} className="mr-2" />
                    Comentários ({task.comments})
                  </button>
                  <button
                    onClick={() => setActiveTab("attachments")}
                    className={`px-6 py-3 text-sm font-medium flex items-center ${
                      activeTab === "attachments"
                        ? "border-b-2 border-[#4072b0] text-[#4072b0]"
                        : "text-gray-500 hover:text-[#6b91c1]"
                    }`}
                  >
                    <Paperclip size={16} className="mr-2" />
                    Anexos ({task.attachments})
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "comments" ? (
                  <TaskComments taskId={task.id} />
                ) : (
                  <TaskAttachments taskId={task.id} projectId={task.projectId} />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Detalhes</h2>

              <div className="space-y-4">
                {!isEditing ? (
                  <>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Status</div>
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${STATUS_MAP[task.status].color} mr-2`}></div>
                        <span className="text-gray-800">{STATUS_MAP[task.status].label}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-1">Responsável</div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-[#4b7bb5] flex items-center justify-center text-white text-xs mr-2">
                          {task.assignee ? task.assignee.charAt(0) : "?"}
                        </div>
                        <span className="text-gray-800">{task.assignee || "Não atribuído"}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-1">Criado por</div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-[#6b91c1] flex items-center justify-center text-white text-xs mr-2">
                          {task.creator ? task.creator.charAt(0) : "?"}
                        </div>
                        <span className="text-gray-800">{task.creator || "Não especificado"}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-1">Projeto</div>
                      <div className="flex items-center">
                        <Link href={`/projetos/${task.projectId}`} className="text-[#4b7bb5] hover:underline">
                          {task.projectName}
                        </Link>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-1">Data de Entrega</div>
                      <div className="flex items-center">
                        <Calendar size={16} className="text-gray-500 mr-2" />
                        <span className="text-gray-800">{formatDate(task.dueDate)}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Status</div>
                      <select
                        value={editedStatus}
                        onChange={(e) => setEditedStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
                      >
                        {STATUSES.map((status) => (
                          <option key={status.id} value={status.id}>
                            {status.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-1">Responsável</div>
                      <input
                        type="text"
                        value={editedAssignee}
                        onChange={(e) => setEditedAssignee(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
                        placeholder="Nome do responsável"
                      />
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-1">Criado por</div>
                      <input
                        type="text"
                        value={editedCreator}
                        onChange={(e) => setEditedCreator(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
                        placeholder="Nome do criador"
                      />
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-1">Projeto</div>
                      <select
                        value={editedProjectId}
                        onChange={(e) => setEditedProjectId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
                      >
                        {PROJECTS.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-1">Data de Entrega</div>
                      <input
                        type="date"
                        value={editedDueDate}
                        onChange={(e) => setEditedDueDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteTaskConfirmation
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeleteTask}
        taskTitle={task.title}
      />
    </div>
  )
}
