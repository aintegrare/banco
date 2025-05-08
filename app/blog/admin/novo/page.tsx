"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { BlogEditor } from "@/components/blog/blog-editor"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function NewBlogPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [authorId, setAuthorId] = useState("")
  const [tags, setTags] = useState("")
  const [published, setPublished] = useState(false)
  const [publishedAt, setPublishedAt] = useState("")
  const [featuredImage, setFeaturedImage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState([])
  const [authors, setAuthors] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Carregar categorias e autores ao montar o componente
  useState(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Buscar categorias
      const { data: categoriesData } = await supabase.from("blog_categories").select("*").order("name")

      // Buscar autores
      const { data: authorsData } = await supabase.from("blog_authors").select("*").order("name")

      setCategories(categoriesData || [])
      setAuthors(authorsData || [])
      setIsLoading(false)
    }

    fetchData()
  }, [])

  // Gerar slug a partir do título
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
  }

  const handleTitleChange = (e) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    setSlug(generateSlug(newTitle))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/blog/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          featuredImage,
          authorId,
          categoryId,
          published,
          publishedAt: publishedAt || null,
          tags,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao criar post")
      }

      router.push("/blog/admin")
    } catch (error) {
      console.error("Erro ao salvar post:", error)
      alert("Ocorreu um erro ao salvar o post. Por favor, tente novamente.")
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
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <div>
                  <Label htmlFor="title">Título do Post</Label>
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
                  <Label htmlFor="slug">Slug (URL)</Label>
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
                  <Label htmlFor="excerpt">Resumo</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Digite um breve resumo do post"
                    className="mt-1 h-24"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label>Conteúdo</Label>
                  <div className="mt-1 border rounded-md">
                    <BlogEditor value={content} onChange={setContent} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <h3 className="text-lg font-medium text-[#4072b0]">Imagem de Capa</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="space-y-2">
                    <div className="text-gray-500">Arraste uma imagem ou</div>
                    <Button variant="outline" className="border-[#4b7bb5] text-[#4b7bb5]">
                      Selecionar Arquivo
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="featuredImage" className="mt-4">
                    Ou informe a URL da imagem
                  </Label>
                  <Input
                    id="featuredImage"
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="mt-1"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                  />
                </div>
                <div className="text-sm text-gray-500">Recomendado: 1200 x 600 pixels, máximo 2MB (JPG, PNG)</div>
              </div>
            </div>

            {/* Barra lateral */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <h3 className="text-lg font-medium text-[#4072b0]">Publicação</h3>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <div className="flex items-center justify-between mt-2">
                    <Label htmlFor="published" className="cursor-pointer">
                      {published ? "Publicado" : "Rascunho"}
                    </Label>
                    <Switch id="published" checked={published} onCheckedChange={setPublished} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="publishDate">Data de Publicação</Label>
                  <Input
                    id="publishDate"
                    type="datetime-local"
                    className="mt-1"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <h3 className="text-lg font-medium text-[#4072b0]">Categorização</h3>

                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="mt-1">
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

                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="Separe as tags por vírgula"
                    className="mt-1"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <h3 className="text-lg font-medium text-[#4072b0]">Autor</h3>

                <div>
                  <Label htmlFor="author">Autor do Post</Label>
                  <Select value={authorId} onValueChange={setAuthorId}>
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
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
