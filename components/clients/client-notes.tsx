"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, User, Edit, Trash2 } from "lucide-react"
import { formatDate } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Dados de exemplo - seriam substituídos por dados reais da API
const mockNotes = [
  {
    id: "1",
    content: "Cliente demonstrou interesse em expandir os serviços para incluir gestão de redes sociais.",
    createdAt: "2023-05-15T14:30:00",
    createdBy: "Ana Oliveira",
  },
  {
    id: "2",
    content: "Reunião agendada para 28/05 para discutir renovação de contrato.",
    createdAt: "2023-05-10T09:15:00",
    createdBy: "Carlos Santos",
  },
  {
    id: "3",
    content: "Cliente mencionou problemas com o atual fornecedor de hospedagem. Podemos oferecer nossa solução.",
    createdAt: "2023-04-28T10:00:00",
    createdBy: "Ana Oliveira",
  },
]

interface ClientNotesProps {
  clientId: string
}

export function ClientNotes({ clientId }: ClientNotesProps) {
  const [notes, setNotes] = useState(mockNotes)
  const [newNote, setNewNote] = useState("")
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")

  const handleAddNote = () => {
    if (!newNote.trim()) return

    const note = {
      id: Date.now().toString(),
      content: newNote,
      createdAt: new Date().toISOString(),
      createdBy: "Usuário Atual",
    }

    setNotes([note, ...notes])
    setNewNote("")
  }

  const handleEditNote = (id: string) => {
    const note = notes.find((note) => note.id === id)
    if (note) {
      setEditingNote(id)
      setEditContent(note.content)
    }
  }

  const handleSaveEdit = () => {
    if (!editingNote || !editContent.trim()) return

    setNotes(notes.map((note) => (note.id === editingNote ? { ...note, content: editContent } : note)))

    setEditingNote(null)
    setEditContent("")
  }

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Notas</h3>

      <Card className="mb-6">
        <CardContent className="p-4">
          <Textarea
            placeholder="Adicione uma nova nota..."
            className="min-h-[100px] mb-4"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <div className="flex justify-end">
            <Button onClick={handleAddNote} disabled={!newNote.trim()} className="bg-[#4b7bb5] hover:bg-[#3d649e]">
              Adicionar Nota
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {notes.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">Nenhuma nota registrada.</CardContent>
          </Card>
        ) : (
          notes.map((note) => (
            <Card key={note.id}>
              <CardContent className="p-4">
                {editingNote === note.id ? (
                  <div>
                    <Textarea
                      className="min-h-[100px] mb-4"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setEditingNote(null)}>
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSaveEdit}
                        disabled={!editContent.trim()}
                        className="bg-[#4b7bb5] hover:bg-[#3d649e]"
                      >
                        Salvar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-700 mb-3">{note.content}</p>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500 flex items-center gap-4">
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {formatDate(note.createdAt, true)}
                        </div>
                        <div className="flex items-center">
                          <User className="h-3.5 w-3.5 mr-1" />
                          {note.createdBy}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditNote(note.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir nota</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir esta nota? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteNote(note.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
