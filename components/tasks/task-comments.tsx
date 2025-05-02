"use client"

import { useState } from "react"
import { Send, User } from "lucide-react"

// Dados de exemplo para comentários
const SAMPLE_COMMENTS = [
  {
    id: "comment-1",
    taskId: "task-1",
    author: "Ana Silva",
    content: "Já comecei a trabalhar nos primeiros 5 posts. Devo finalizar até amanhã.",
    createdAt: "2023-10-18T14:30:00Z",
  },
  {
    id: "comment-2",
    taskId: "task-1",
    author: "João Pereira",
    content: "Excelente! Lembre-se de seguir o guia de estilo que enviamos por email.",
    createdAt: "2023-10-18T15:45:00Z",
  },
  {
    id: "comment-3",
    taskId: "task-1",
    author: "Ana Silva",
    content: "Entendido! Estou seguindo o guia à risca.",
    createdAt: "2023-10-19T09:20:00Z",
  },
  {
    id: "comment-4",
    taskId: "task-2",
    author: "Carlos Mendes",
    content: "Já revisei a página inicial. Encontrei alguns erros de digitação que corrigi.",
    createdAt: "2023-10-17T10:15:00Z",
  },
  {
    id: "comment-5",
    taskId: "task-2",
    author: "Mariana Costa",
    content: "Ótimo trabalho! Pode seguir para a página Sobre.",
    createdAt: "2023-10-17T11:30:00Z",
  },
]

interface TaskCommentsProps {
  taskId: string
}

export function TaskComments({ taskId }: TaskCommentsProps) {
  const [comments, setComments] = useState(SAMPLE_COMMENTS.filter((comment) => comment.taskId === taskId))
  const [newComment, setNewComment] = useState("")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment = {
      id: `comment-${Date.now()}`,
      taskId,
      author: "Você",
      content: newComment,
      createdAt: new Date().toISOString(),
    }

    setComments([...comments, comment])
    setNewComment("")

    // Aqui você faria uma chamada à API para salvar o comentário
    console.log("Novo comentário:", comment)
  }

  return (
    <div>
      {comments.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex">
              <div className="flex-shrink-0 mr-3">
                <div className="w-8 h-8 rounded-full bg-[#4b7bb5] flex items-center justify-center text-white">
                  {comment.author.charAt(0)}
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex items-center mb-1">
                  <span className="font-medium text-gray-800">{comment.author}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                </div>
                <div className="text-gray-600">{comment.content}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-gray-200 pt-4">
        <div className="flex">
          <div className="flex-shrink-0 mr-3">
            <div className="w-8 h-8 rounded-full bg-[#4b7bb5] flex items-center justify-center text-white">
              <User size={16} />
            </div>
          </div>
          <div className="flex-grow">
            <div className="relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Adicione um comentário..."
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent resize-none"
                rows={3}
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="absolute bottom-2 right-2 text-[#4b7bb5] hover:text-[#3d649e] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
