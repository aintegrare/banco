"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"

// Definição das fases do projeto (em vez de status)
const PHASES = [
  { id: "planejamento", title: "Planejamento" },
  { id: "execucao", title: "Execução" },
  { id: "revisao", title: "Revisão" },
  { id: "entrega", title: "Entrega" },
  { id: "concluido", title: "Concluído" },
]

// Interface para os itens do projeto
interface ProjectItem {
  id: number
  title: string
  description?: string
  phase: string
  project_id: number
  assigned_to?: string
  due_date?: string
  priority?: string
  created_at?: string
}

interface ProjectPhasesProps {
  projectId: number
}

export function ProjectPhases({ projectId }: ProjectPhasesProps) {
  const [items, setItems] = useState<ProjectItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<ProjectItem | null>(null)
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    phase: "planejamento",
  })
  const { toast } = useToast()
  const supabase = createClient()

  // Carregar itens do projeto
  useEffect(() => {
    async function loadProjectItems() {
      if (!projectId) return

      setIsLoading(true)
      try {
        // Buscar itens do projeto da tabela project_items
        const { data, error } = await supabase
          .from("project_items")
          .select("*")
          .eq("project_id", projectId)
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        console.log("Itens carregados:", data)
        setItems(data || [])
      } catch (error: any) {
        console.error("Erro ao carregar itens do projeto:", error.message)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os itens do projeto",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProjectItems()
  }, [projectId, toast, supabase])

  // Agrupar itens por fase
  const itemsByPhase = PHASES.reduce((acc: Record<string, ProjectItem[]>, phase) => {
    acc[phase.id] = items.filter((item) => item.phase === phase.id)
    return acc
  }, {})

  // Manipular o fim do arrasto
  const handleDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result

    // Se não houver destino ou se o destino for o mesmo que a origem, não fazer nada
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    try {
      // Encontrar o item que está sendo movido
      const itemId = Number.parseInt(draggableId)
      const itemToUpdate = items.find((item) => item.id === itemId)

      if (!itemToUpdate) {
        console.error("Item não encontrado:", itemId)
        return
      }

      // Atualizar a fase do item localmente
      const updatedItems = items.map((item) => {
        if (item.id === itemId) {
          return { ...item, phase: destination.droppableId }
        }
        return item
      })

      // Atualizar o estado local imediatamente para feedback visual
      setItems(updatedItems)
      setIsSaving(true)

      // Atualizar a fase do item no banco de dados
      const { error } = await supabase.from("project_items").update({ phase: destination.droppableId }).eq("id", itemId)

      if (error) {
        throw error
      }

      toast({
        title: "Item movido",
        description: "O item foi movido para outra fase com sucesso",
      })
    } catch (error: any) {
      console.error("Erro ao atualizar fase do item:", error.message)
      toast({
        title: "Erro",
        description: "Não foi possível mover o item para outra fase",
        variant: "destructive",
      })

      // Reverter a alteração local em caso de erro
      setItems([...items])
    } finally {
      setIsSaving(false)
    }
  }

  // Criar novo item
  const handleCreateItem = async () => {
    if (!newItem.title.trim()) {
      toast({
        title: "Erro",
        description: "O título do item é obrigatório",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)

      // Inserir novo item no banco de dados
      const { data, error } = await supabase
        .from("project_items")
        .insert({
          title: newItem.title,
          description: newItem.description,
          phase: newItem.phase,
          project_id: projectId,
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      // Adicionar novo item à lista local
      setItems([data, ...items])

      // Limpar formulário e fechar diálogo
      setNewItem({
        title: "",
        description: "",
        phase: "planejamento",
      })
      setIsCreateDialogOpen(false)

      toast({
        title: "Item criado",
        description: "O item foi criado com sucesso",
      })
    } catch (error: any) {
      console.error("Erro ao criar item:", error.message)
      toast({
        title: "Erro",
        description: "Não foi possível criar o item",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Atualizar item existente
  const handleUpdateItem = async () => {
    if (!currentItem || !currentItem.title.trim()) {
      toast({
        title: "Erro",
        description: "O título do item é obrigatório",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)

      // Atualizar item no banco de dados
      const { error } = await supabase
        .from("project_items")
        .update({
          title: currentItem.title,
          description: currentItem.description,
        })
        .eq("id", currentItem.id)

      if (error) {
        throw error
      }

      // Atualizar item na lista local
      setItems(
        items.map((item) => {
          if (item.id === currentItem.id) {
            return { ...item, title: currentItem.title, description: currentItem.description }
          }
          return item
        }),
      )

      // Fechar diálogo
      setIsEditDialogOpen(false)
      setCurrentItem(null)

      toast({
        title: "Item atualizado",
        description: "O item foi atualizado com sucesso",
      })
    } catch (error: any) {
      console.error("Erro ao atualizar item:", error.message)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o item",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Excluir item
  const handleDeleteItem = async () => {
    if (!currentItem) return

    try {
      setIsSaving(true)

      // Excluir item do banco de dados
      const { error } = await supabase.from("project_items").delete().eq("id", currentItem.id)

      if (error) {
        throw error
      }

      // Remover item da lista local
      setItems(items.filter((item) => item.id !== currentItem.id))

      // Fechar diálogo
      setIsEditDialogOpen(false)
      setCurrentItem(null)

      toast({
        title: "Item excluído",
        description: "O item foi excluído com sucesso",
      })
    } catch (error: any) {
      console.error("Erro ao excluir item:", error.message)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o item",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Formatar data
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
  }

  // Obter cor da prioridade
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-orange-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-800">Quadro de Fases</h2>
          <Button size="sm" onClick={() => setIsCreateDialogOpen(true)} className="bg-[#4b7bb5] hover:bg-[#3d649e]">
            <Plus size={16} className="mr-1" />
            Novo Item
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 size={30} className="text-[#4b7bb5] animate-spin" />
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex overflow-x-auto pb-4 -mx-2">
              {PHASES.map((phase) => (
                <div key={phase.id} className="flex-shrink-0 w-64 mx-2 first:ml-0 last:mr-0">
                  <div className="bg-gray-100 rounded-lg h-full flex flex-col">
                    <div className="p-2 font-medium text-sm text-gray-700 border-b border-gray-200 bg-gray-200 rounded-t-lg flex justify-between items-center">
                      <span>{phase.title}</span>
                      <Badge variant="secondary" className="bg-white text-gray-600 text-xs">
                        {itemsByPhase[phase.id]?.length || 0}
                      </Badge>
                    </div>

                    <Droppable droppableId={phase.id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="flex-grow p-2 overflow-y-auto"
                          style={{ maxHeight: "400px", minHeight: "100px" }}
                        >
                          {itemsByPhase[phase.id]?.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="mb-2 last:mb-0"
                                  onClick={() => {
                                    setCurrentItem(item)
                                    setIsEditDialogOpen(true)
                                  }}
                                >
                                  <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 cursor-pointer hover:border-[#4b7bb5] transition-colors">
                                    <div className="flex items-start justify-between">
                                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{item.title}</h3>
                                      {item.priority && (
                                        <div
                                          className={`w-2 h-2 rounded-full ${getPriorityColor(
                                            item.priority,
                                          )} ml-2 flex-shrink-0`}
                                        ></div>
                                      )}
                                    </div>
                                    {item.description && (
                                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                                    )}
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                                      <div className="flex items-center">
                                        {item.assigned_to && (
                                          <div className="w-5 h-5 rounded-full bg-[#4b7bb5] flex items-center justify-center text-white text-xs">
                                            {item.assigned_to.charAt(0).toUpperCase()}
                                          </div>
                                        )}
                                      </div>
                                      {item.due_date && (
                                        <div className="text-xs text-gray-500">{formatDate(item.due_date)}</div>
                                      )}
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
        )}

        {/* Diálogo para criar novo item */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Novo Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Título
                </label>
                <Input
                  id="title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="Digite o título do item"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Descrição
                </label>
                <Textarea
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Digite a descrição do item"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phase" className="text-sm font-medium">
                  Fase
                </label>
                <select
                  id="phase"
                  value={newItem.phase}
                  onChange={(e) => setNewItem({ ...newItem, phase: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {PHASES.map((phase) => (
                    <option key={phase.id} value={phase.id}>
                      {phase.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateItem} disabled={isSaving} className="bg-[#4b7bb5] hover:bg-[#3d649e]">
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Criar Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo para editar item existente */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Item</DialogTitle>
            </DialogHeader>
            {currentItem && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="edit-title" className="text-sm font-medium">
                    Título
                  </label>
                  <Input
                    id="edit-title"
                    value={currentItem.title}
                    onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                    placeholder="Digite o título do item"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-description" className="text-sm font-medium">
                    Descrição
                  </label>
                  <Textarea
                    id="edit-description"
                    value={currentItem.description || ""}
                    onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                    placeholder="Digite a descrição do item"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fase Atual</label>
                  <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                    {PHASES.find((phase) => phase.id === currentItem.phase)?.title || "Desconhecida"}
                  </div>
                  <p className="text-xs text-gray-500">
                    Para mudar a fase, arraste o item para outra coluna no quadro.
                  </p>
                </div>
              </div>
            )}
            <DialogFooter className="flex justify-between sm:justify-between">
              <Button variant="destructive" onClick={handleDeleteItem} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Excluir
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdateItem} disabled={isSaving} className="bg-[#4b7bb5] hover:bg-[#3d649e]">
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Salvar Alterações
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
