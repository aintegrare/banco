"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Edit, MoreVertical, Send, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ClientNotesProps {
  clientId: number
}

type Note = {
  id: number
  client_id: number
  content: string
  user_id?: string
  user_name: string
  created_at: string
  updated_at: string
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function ClientNotes({ clientId }: ClientNotesProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [noteContent, setNoteContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingNote, setEditingNote] = useState<{
    id: number
    content: string
  } | null>(null)
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null)

  useEffect(() => {
    fetchNotes()
  }, [clientId])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/crm/clients/${clientId}/notes`)

      if (!response.ok) {
        throw new Error("Erro ao buscar notas")
      }

      const data = await response.json()
      setNotes(data)
    } catch (error) {
      console.error("Error fetching notes:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as notas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!noteContent.trim()) {
      toast({
        title: "Erro",
        description: "O conteúdo da nota é obrigatório",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const noteData = {
        content: noteContent,
      }

      const response = await fetch(`/api/crm/clients/${clientId}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      })

      if (!response.ok) {
        throw new Error("Erro ao adicionar nota")
      }

      // Reset form
      setNoteContent("")

      // Optionally, you could add the new note directly to the state
      // for a more responsive UI, but for simplicity we'll just refetch
      fetchNotes()

      toast({
        title: "Nota adicionada",
        description: "A nota foi adicionada com sucesso.",
      })
    } catch (error) {
      console.error("Error creating note:", error)
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a nota",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async () => {
    if (!editingNote) return

    try {
      const response = await fetch(`/api/crm/notes/${editingNote.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editingNote.content }),
      })

      if (!response.ok) {
        throw new Error("Erro ao atualizar nota")
      }

      // Reset edit state
      setEditingNote(null)

      // Refetch notes
      fetchNotes()

      toast({
        title: "Nota atualizada",
        description: "A nota foi atualizada com sucesso.",
      })
    } catch (error) {
      console.error("Error updating note:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a nota",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (noteToDelete === null) return

    try {
      const response = await fetch(`/api/crm/notes/${noteToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir nota")
      }

      // Reset delete state
      setNoteToDelete(null)

      // Refetch notes or update local state
      setNotes(notes.filter((note) => note.id !== noteToDelete))

      toast({
        title: "Nota excluída",
        description: "A nota foi excluída com sucesso.",
      })
    } catch (error) {
      console.error("Error deleting note:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a nota",
        variant: "destructive",
      })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-[#f8fafc] border-b rounded-t-lg">
          <CardTitle className="text-lg">Nova Nota</CardTitle>
          <CardDescription>Adicione uma nota sobre este cliente</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            <Textarea
              placeholder="Digite sua nota aqui..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={4}
              required
              className="resize-none"
            />
          </CardContent>
          <CardFooter className="bg-[#f8fafc] border-t">
            <Button type="submit" className="w-full md:w-auto bg-[#4b7bb5] hover:bg-[#3d649e]" disabled={isSubmitting}>
              {isSubmitting ? (
                "Salvando..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Adicionar Nota
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notas</CardTitle>
          <CardDescription>
            {notes.length} {notes.length === 1 ? "nota" : "notas"} registradas para este cliente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={`loading-${index}`} className="p-4 border rounded-lg animate-pulse">
                  <div className="h-16 bg-muted rounded-md w-full mb-2"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-muted rounded-md w-40"></div>
                    <div className="h-8 bg-muted rounded-md w-8"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Nenhuma nota registrada</div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10 bg-[#4b7bb5] text-white">
                      <AvatarFallback>{getInitials(note.user_name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="whitespace-pre-wrap">{note.content}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-2 text-sm text-muted-foreground">
                        <span className="font-medium">{note.user_name}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{formatDate(note.created_at)}</span>
                        {note.updated_at !== note.created_at && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span>Editado em {formatDate(note.updated_at)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingNote({ id: note.id, content: note.content })}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => setNoteToDelete(note.id)}>
                          <Trash className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Note Dialog */}
      <AlertDialog open={!!editingNote} onOpenChange={(open) => !open && setEditingNote(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar nota</AlertDialogTitle>
            <AlertDialogDescription>Faça as alterações desejadas na nota.</AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            value={editingNote?.content || ""}
            onChange={(e) => setEditingNote((prev) => (prev ? { ...prev, content: e.target.value } : null))}
            rows={4}
            className="my-4 resize-none"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleEdit} className="bg-[#4b7bb5] hover:bg-[#3d649e]">
              Salvar alterações
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Note Dialog */}
      <AlertDialog open={noteToDelete !== null} onOpenChange={(open) => !open && setNoteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir nota</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta nota? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
