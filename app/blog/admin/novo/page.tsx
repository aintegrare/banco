"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BlogEditor } from "@/components/blog/blog-editor"
import { ArrowLeft, Save, Upload, X, Calendar, Tag, User, FileText } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "@/components/ui/use-toast"

export default function NewBlogPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [authorId, setAuthorId] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">("draft")
  const [publishDate, setPublishDate] = useState<Date | null>(null)
  const [featuredImage, setFeaturedImage] = useState("")
  const [previewImage, setPreviewImage] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [authors, setAuthors] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")

  // Carregar categorias e autores ao montar o componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()

        // Buscar categorias
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("blog_categories")
          .select("*")
          .order("name")

        if (categoriesError) throw categoriesError

        // Buscar autores
        const { data: authorsData, error: authorsError } = await supabase.from("blog_authors").select("*").order("name")

        if (authorsError) throw authorsError

        setCategories(categoriesData || [])
        setAuthors(authorsData || [])
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar categorias e autores. Tente novamente mais tarde.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Gerar slug a partir do título
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle))
    }
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      setImageFile(file)

      // Criar URL temporária para preview
      const objectUrl = URL.createObjectURL(file)
      setPreviewImage(objectUrl)

      // Limpar URL quando o componente for desmontado
      return () => URL.revokeObjectURL(objectUrl)
    }
  }

  const uploadImage = async () => {
    if (!imageFile) return null

    try {
      const supabase = createClient()
      const fileExt = imageFile.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `blog/${fileName}`

      const { error: uploadError, data } = await supabase.storage.from("media").upload(filePath, imageFile)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from("media").getPublicUrl(filePath)
      return urlData.publicUrl
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error)
      toast({
        title: "Erro ao fazer upload",
        description: "Não foi possível fazer o upload da imagem. Tente novamente.",
        variant: "destructive",
      })
      return null
    }
  }

  const handleEditorImageUpload = async (file: File) => {
    try {
      const supabase = createClient()
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `blog/content/${fileName}`

      const { error: uploadError } = await supabase.storage.from("media").upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from("media").getPublicUrl(filePath)
      return urlData.publicUrl
    } catch (error) {
      console.error("Erro ao fazer upload da imagem do editor:", error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validar campos obrigatórios
      if (!title || !slug || !excerpt || !content || !categoryId || !authorId) {
        throw new Error("Por favor, preencha todos os campos obrigatórios")
      }

      // Upload da imagem de capa, se houver
      let imageUrl = featuredImage
      if (imageFile) {
        const uploadedUrl = await uploadImage()
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        }
      }

      // Determinar data de publicação
      let publishedAt = null
      if (status === "published") {
        publishedAt = new Date().toISOString()
      } else if (status === "scheduled" && publishDate) {
        publishedAt = publishDate.toISOString()
      }

      // Preparar dados para envio
      const postData = {
        title,
        slug,
        excerpt,
        content,
        featured_image: imageUrl,
        author_id: authorId,
        category_id: categoryId,
        status,
        published_at: publishedAt,
        tags: tags.join(", "),
        meta_title: metaTitle || title,
        meta_description: metaDescription || excerpt,
      }

      // Enviar para a API
      const response = await fetch("/api/blog/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erro ao criar post")
      }

      toast({
        title: "Post criado com sucesso!",
        description: "Seu post foi salvo e está pronto para ser publicado.",
      })

      router.push("/blog/admin")
    } catch (error: any) {
      console.error("Erro ao salvar post:", error)
      toast({
        title: "Erro ao salvar post",
        description: error.message || "Ocorreu um erro ao salvar o post. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f2f1ef] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4b7bb5] mx-auto"></div>
          <p className="mt-4 text-[#4b7bb5]">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f2f1ef]">
      <PageHeader
        title="Novo Post"
        description="Crie um novo post para o blog da Integrare"
        actions={
          <div className="flex space-x-3">
            <Link href="/blog/admin">
              <Button variant="outline" className="border-[#4b7bb5] text-[#4b7bb5]">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </Link>
            <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]" onClick={handleSubmit} disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Salvando..." : "Salvar Post"}
            </Button>
          </div>
        }
      />

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna principal */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-base font-medium">
                      Título do Post <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="Digite o título do post"
                      className="mt-1"
                      value={title}
                      onChange={handleTitleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="slug" className="text-base font-medium">
                      Slug (URL) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="slug"
                      placeholder="url-do-post"
                      className="mt-1"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      URL: https://integrare.com.br/blog/<span className="text-[#4b7bb5]">{slug || "url-do-post"}</span>
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="excerpt" className="text-base font-medium">
                      Resumo <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="excerpt"
                      placeholder="Digite um breve resumo do post"
                      className="mt-1 h-24"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      O resumo aparece nos resultados de busca e na listagem de posts. Recomendamos entre 150-160
                      caracteres.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Label className="text-base font-medium">
                    Conteúdo <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-2">
                    <BlogEditor value={content} onChange={setContent} onImageUpload={handleEditorImageUpload} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-medium text-[#4072b0] flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Imagem de Capa
                  </h3>

                  {previewImage && (
                    <div className="relative">
                      <img
                        src={previewImage || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => {
                          setPreviewImage("")
                          setImageFile(null)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {!previewImage && (
                    <>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <input
                          type="file"
                          id="coverImage"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        <div className="space-y-2">
                          <div className="text-gray-500">Arraste uma imagem ou</div>
                          <label htmlFor="coverImage">
                            <Button
                              type="button"
                              variant="outline"
                              className="border-[#4b7bb5] text-[#4b7bb5]"
                              onClick={() => document.getElementById("coverImage")?.click()}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Selecionar Arquivo
                            </Button>
                          </label>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="featuredImage">Ou informe a URL da imagem</Label>
                        <Input
                          id="featuredImage"
                          placeholder="https://exemplo.com/imagem.jpg"
                          className="mt-1"
                          value={featuredImage}
                          onChange={(e) => setFeaturedImage(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  <div className="text-sm text-gray-500">Recomendado: 1200 x 600 pixels, máximo 2MB (JPG, PNG)</div>
                </CardContent>
              </Card>
            </div>

            {/* Barra lateral */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-medium text-[#4072b0] flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Publicação
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={status}
                      onValueChange={(value: "draft" | "published" | "scheduled") => setStatus(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Rascunho</SelectItem>
                        <SelectItem value="published">Publicado</SelectItem>
                        <SelectItem value="scheduled">Agendado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {status === "scheduled" && (
                    <div className="space-y-2">
                      <Label>Data de Publicação</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <Calendar className="mr-2 h-4 w-4" />
                            {publishDate ? (
                              format(publishDate, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={publishDate || undefined}
                            onSelect={(date) => setPublishDate(date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-medium text-[#4072b0] flex items-center">
                    <Tag className="mr-2 h-5 w-5" />
                    Categorização
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Categoria <span className="text-red-500">*</span>
                    </Label>
                    <Select value={categoryId} onValueChange={setCategoryId} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <Input
                      id="tagInput"
                      placeholder="Digite uma tag e pressione Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-medium text-[#4072b0] flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Autor
                  </h3>

                  <div>
                    <Label htmlFor="author">
                      Autor do Post <span className="text-red-500">*</span>
                    </Label>
                    <Select value={authorId} onValueChange={setAuthorId} required>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione o autor" />
                      </SelectTrigger>
                      <SelectContent>
                        {authors.map((author) => (
                          <SelectItem key={author.id} value={author.id.toString()}>
                            {author.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Tabs defaultValue="seo">
                    <TabsList className="grid w-full grid-cols-1">
                      <TabsTrigger value="seo">SEO</TabsTrigger>
                    </TabsList>
                    <TabsContent value="seo" className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="metaTitle">Título SEO</Label>
                        <Input
                          id="metaTitle"
                          placeholder="Título para SEO"
                          className="mt-1"
                          value={metaTitle}
                          onChange={(e) => setMetaTitle(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Recomendado: até 60 caracteres. Se vazio, o título do post será usado.
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="metaDescription">Descrição SEO</Label>
                        <Textarea
                          id="metaDescription"
                          placeholder="Descrição para SEO"
                          className="mt-1"
                          value={metaDescription}
                          onChange={(e) => setMetaDescription(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Recomendado: entre 150-160 caracteres. Se vazio, o resumo será usado.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
