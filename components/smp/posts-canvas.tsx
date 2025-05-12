"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, X, Link, Edit, Trash, Hash, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import {
  type SMPPost,
  type SMPConnection,
  loadPosts,
  loadConnections,
  createPost,
  updatePost,
  deletePost,
  createConnection,
  updatePostPosition,
} from "@/lib/smp-service"

export function PostsCanvas() {
  const [posts, setPosts] = useState<SMPPost[]>([])
  const [connections, setConnections] = useState<SMPConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [dragging, setDragging] = useState<string | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectingSource, setConnectingSource] = useState<string | null>(null)
  const [newPost, setNewPost] = useState<Omit<SMPPost, "id" | "position">>({
    title: "",
    caption: "",
    hashtags: [],
    theme: "",
    type: "PLM",
  })
  const [newHashtag, setNewHashtag] = useState("")

  // Carregar posts e conexões ao iniciar
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [postsData, connectionsData] = await Promise.all([loadPosts(), loadConnections()])
        setPosts(postsData)
        setConnections(connectionsData)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os posts. Tente novamente mais tarde.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    if (isConnecting) {
      if (connectingSource === null) {
        setConnectingSource(id)
      } else if (connectingSource !== id) {
        // Create new connection
        handleCreateConnection(connectingSource, id)
        setConnectingSource(null)
        setIsConnecting(false)
      }
      return
    }

    const post = posts.find((p) => p.id === id)
    if (post) {
      // Calcular o offset correto considerando a posição atual do post
      setOffset({
        x: e.clientX - post.position.x,
        y: e.clientY - post.position.y,
      })
      setDragging(id)
      e.stopPropagation() // Impedir propagação do evento
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === dragging) {
            return {
              ...post,
              position: {
                x: e.clientX - offset.x,
                y: e.clientY - offset.y,
              },
            }
          }
          return post
        }),
      )
    }
  }

  const handleMouseUp = async (e: React.MouseEvent) => {
    if (dragging) {
      e.preventDefault()

      // Salvar a nova posição no banco de dados
      const post = posts.find((p) => p.id === dragging)
      if (post) {
        try {
          await updatePostPosition(post.id, post.position)
        } catch (error) {
          console.error("Erro ao salvar posição:", error)
          toast({
            title: "Erro",
            description: "Não foi possível salvar a posição do post.",
            variant: "destructive",
          })
        }
      }
    }
    setDragging(null)
  }

  const handleCreatePost = async () => {
    setSaving(true)
    try {
      const newPostData = {
        ...newPost,
        position: { x: 200, y: 200 },
      }

      const createdPost = await createPost(newPostData)

      if (createdPost) {
        setPosts([...posts, createdPost])
        toast({
          title: "Sucesso",
          description: "Post criado com sucesso!",
        })
      }
    } catch (error) {
      console.error("Erro ao criar post:", error)
      toast({
        title: "Erro",
        description: "Não foi possível criar o post. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
      setNewPost({
        title: "",
        caption: "",
        hashtags: [],
        theme: "",
        type: "PLM",
      })
      setIsCreating(false)
    }
  }

  const handleUpdatePost = async () => {
    if (isEditing) {
      setSaving(true)
      try {
        const postToUpdate = posts.find((p) => p.id === isEditing)
        if (postToUpdate) {
          const updatedPost = {
            ...postToUpdate,
            ...newPost,
          }

          const success = await updatePost(updatedPost)

          if (success) {
            setPosts((prev) => prev.map((post) => (post.id === isEditing ? updatedPost : post)))
            toast({
              title: "Sucesso",
              description: "Post atualizado com sucesso!",
            })
          }
        }
      } catch (error) {
        console.error("Erro ao atualizar post:", error)
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o post. Tente novamente.",
          variant: "destructive",
        })
      } finally {
        setSaving(false)
        setIsEditing(null)
        setNewPost({
          title: "",
          caption: "",
          hashtags: [],
          theme: "",
          type: "PLM",
        })
      }
    }
  }

  const handleEditPost = (post: SMPPost) => {
    setNewPost({
      title: post.title,
      caption: post.caption,
      hashtags: [...post.hashtags],
      theme: post.theme,
      type: post.type,
    })
    setIsEditing(post.id)
  }

  const handleDeletePost = async (id: string) => {
    try {
      const success = await deletePost(id)

      if (success) {
        setPosts((prev) => prev.filter((post) => post.id !== id))
        setConnections((prev) => prev.filter((conn) => conn.source !== id && conn.target !== id))
        toast({
          title: "Sucesso",
          description: "Post excluído com sucesso!",
        })
      }
    } catch (error) {
      console.error("Erro ao excluir post:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o post. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleCreateConnection = async (sourceId: string, targetId: string) => {
    try {
      const newConnection = await createConnection({ source: sourceId, target: targetId })

      if (newConnection) {
        setConnections([...connections, newConnection])
        toast({
          title: "Sucesso",
          description: "Conexão criada com sucesso!",
        })
      }
    } catch (error) {
      console.error("Erro ao criar conexão:", error)
      toast({
        title: "Erro",
        description: "Não foi possível criar a conexão. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleAddHashtag = () => {
    if (newHashtag.trim() && !newPost.hashtags.includes(newHashtag.trim())) {
      setNewPost({
        ...newPost,
        hashtags: [...newPost.hashtags, newHashtag.trim()],
      })
      setNewHashtag("")
    }
  }

  const handleRemoveHashtag = (tag: string) => {
    setNewPost({
      ...newPost,
      hashtags: newPost.hashtags.filter((t) => t !== tag),
    })
  }

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Carregando posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="h-full w-full relative overflow-hidden bg-gray-50 p-4"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={(e) => handleMouseUp(e as React.MouseEvent)}
    >
      {/* Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map((connection, index) => {
          const source = posts.find((p) => p.id === connection.source)
          const target = posts.find((p) => p.id === connection.target)
          if (source && target) {
            const sourceX = source.position.x + 150
            const sourceY = source.position.y + 100
            const targetX = target.position.x + 150
            const targetY = target.position.y + 100

            // Calculate control points for curved lines
            const dx = targetX - sourceX
            const dy = targetY - sourceY
            const controlX1 = sourceX + dx * 0.25
            const controlY1 = sourceY + dy * 0.1
            const controlX2 = sourceX + dx * 0.75
            const controlY2 = sourceY + dy * 0.9

            return (
              <path
                key={index}
                d={`M ${sourceX} ${sourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetX} ${targetY}`}
                stroke="#4b7bb5"
                strokeWidth={2}
                strokeDasharray={isConnecting ? "5,5" : "none"}
                fill="none"
                markerEnd="url(#arrowhead)"
              />
            )
          }
          return null
        })}

        {/* SVG definitions for arrow markers */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#4b7bb5" />
          </marker>
        </defs>
      </svg>

      {/* Posts */}
      {posts.map((post) => (
        <motion.div
          key={post.id}
          className={`absolute cursor-move ${dragging === post.id ? "z-10" : "z-0"} ${
            connectingSource === post.id ? "ring-2 ring-blue-500" : ""
          }`}
          style={{
            left: post.position.x,
            top: post.position.y,
            width: 300,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          onMouseDown={(e) => handleMouseDown(e, post.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className={post.type === "PLM" ? "border-l-4 border-l-blue-500" : "border-l-4 border-l-green-500"}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{post.title}</CardTitle>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEditPost(post)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeletePost(post.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{post.theme}</span>
                <Badge variant={post.type === "PLM" ? "default" : "secondary"}>{post.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-gray-700">{post.caption}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {post.hashtags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Floating action buttons */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <Button
          className="rounded-full w-12 h-12 shadow-lg"
          onClick={() => {
            setIsConnecting(!isConnecting)
            setConnectingSource(null)
          }}
          variant={isConnecting ? "destructive" : "default"}
        >
          <Link className="h-5 w-5" />
        </Button>
        <Button className="rounded-full w-12 h-12 shadow-lg" onClick={() => setIsCreating(true)}>
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Create/Edit Post Dialog */}
      <Dialog
        open={isCreating || isEditing !== null}
        onOpenChange={(open) => !open && (setIsCreating(false), setIsEditing(null))}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Post" : "Criar Novo Post"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Atualize os detalhes do post" : "Preencha os detalhes para criar um novo post"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="Título do post"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="caption">Legenda</Label>
              <Textarea
                id="caption"
                value={newPost.caption}
                onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
                placeholder="Legenda do post"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="theme">Tema</Label>
              <Input
                id="theme"
                value={newPost.theme}
                onChange={(e) => setNewPost({ ...newPost, theme: e.target.value })}
                placeholder="Tema do post"
              />
            </div>
            <div className="grid gap-2">
              <Label>Tipo</Label>
              <RadioGroup
                value={newPost.type}
                onValueChange={(value) => setNewPost({ ...newPost, type: value as "PLM" | "PLC" })}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PLM" id="plm" />
                  <Label htmlFor="plm">Planejamento (PLM)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PLC" id="plc" />
                  <Label htmlFor="plc">Campanha (PLC)</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-2">
              <Label>Hashtags</Label>
              <div className="flex gap-2">
                <Input
                  value={newHashtag}
                  onChange={(e) => setNewHashtag(e.target.value)}
                  placeholder="Adicionar hashtag"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddHashtag())}
                />
                <Button type="button" onClick={handleAddHashtag} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {newPost.hashtags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    {tag}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleRemoveHashtag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={isEditing ? handleUpdatePost : handleCreatePost}
              disabled={!newPost.title || !newPost.caption || saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Salvando..." : "Criando..."}
                </>
              ) : isEditing ? (
                "Salvar Alterações"
              ) : (
                "Criar Post"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Connection instructions */}
      {isConnecting && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-lg shadow-lg z-20 text-sm">
          {connectingSource
            ? "Agora clique no post de destino para criar a conexão"
            : "Clique em um post para iniciar a conexão"}
        </div>
      )}
    </div>
  )
}
