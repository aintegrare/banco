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
import { Switch } from "@/components/ui/switch"
import { BlogEditor } from "@/components/blog/blog-editor"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

// Categorias de exemplo
const categories = [
  { id: "1", name: "Marketing Digital" },
  { id: "2", name: "SEO" },
  { id: "3", name: "Redes Sociais" },
  { id: "4", name: "E-mail Marketing" },
  { id: "5", name: "Análise de Dados" },
  { id: "6", name: "Tendências" },
  { id: "7", name: "Estratégia" },
  { id: "8", name: "Branding" },
]

// Autores de exemplo
const authors = [
  { id: "1", name: "Ana Silva" },
  { id: "2", name: "Carlos Mendes" },
  { id: "3", name: "Juliana Costa" },
  { id: "4", name: "Ricardo Oliveira" },
  { id: "5", name: "Fernanda Lima" },
  { id: "6", name: "Paulo Santos" },
]

// Dados de exemplo para os posts do blog
const blogPosts = [
  {
    id: "1",
    title: "Como o Marketing Digital Transformou os Negócios em 2023",
    slug: "como-o-marketing-digital-transformou-os-negocios-em-2023",
    excerpt:
      "Descubra as principais tendências de marketing digital que impactaram os negócios no último ano e como se preparar para o futuro.",
    content: `
      <p>O marketing digital continua a evoluir rapidamente, transformando a maneira como as empresas se conectam com seus clientes. Em 2023, vimos mudanças significativas que redefiniram estratégias e abriram novas oportunidades para negócios de todos os tamanhos.</p>
      
      <h2>Inteligência Artificial no Marketing</h2>
      <p>A IA deixou de ser uma tecnologia futurista para se tornar uma ferramenta essencial no arsenal de marketing. Empresas estão utilizando IA para personalizar experiências, analisar dados de clientes e automatizar tarefas repetitivas, permitindo que as equipes de marketing se concentrem em estratégias criativas e inovadoras.</p>
    `,
    coverImage: "/digital-marketing-concept.png",
    authorId: "1",
    categoryId: "1",
    status: "published",
    publishedAt: "2023-12-15T10:00:00Z",
    featured: true,
    metaTitle: "Marketing Digital em 2023: Transformações nos Negócios",
    metaDescription:
      "Descubra como o marketing digital transformou os negócios em 2023 e quais tendências continuarão a impactar o mercado.",
    tags: "marketing digital, tendências, negócios, 2023",
  },
]

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState<any>(null)
  const [isFeatured, setIsFeatured] = useState(false)
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Simulação de carregamento de dados
    const foundPost = blogPosts.find((p) => p.id === params.id)

    if (foundPost) {
      setPost(foundPost)
      setContent(foundPost.content)
      setIsFeatured(foundPost.featured)
    }

    setIsLoading(false)
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulação de envio para API
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/blog/admin")
    }, 1500)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f2f1ef] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4b7bb5] mx-auto"></div>
          <p className="mt-4 text-[#4b7bb5]">Carregando post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f2f1ef] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#4072b0] mb-4">Post não encontrado</h2>
          <p className="text-gray-600 mb-6">O post que você está procurando não existe ou foi removido.</p>
          <Link href="/blog/admin">
            <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]">Voltar para Administração</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f2f1ef]">
      <PageHeader
        title="Editar Post"
        description="Edite as informações do post do blog"
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
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
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
                    defaultValue={post.title}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Resumo</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Digite um breve resumo do post"
                    className="mt-1 h-24"
                    defaultValue={post.excerpt}
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
                <div className="mb-4">
                  <img
                    src={post.coverImage || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="space-y-2">
                    <div className="text-gray-500">Arraste uma nova imagem ou</div>
                    <Button variant="outline" className="border-[#4b7bb5] text-[#4b7bb5]">
                      Selecionar Arquivo
                    </Button>
                  </div>
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
                  <Select defaultValue={post.status}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="scheduled">Agendado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="publishDate">Data de Publicação</Label>
                  <Input
                    id="publishDate"
                    type="datetime-local"
                    className="mt-1"
                    defaultValue={post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : ""}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="featured" className="cursor-pointer">
                    Post em Destaque
                  </Label>
                  <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <h3 className="text-lg font-medium text-[#4072b0]">Categorização</h3>

                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select defaultValue={post.categoryId}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input id="tags" placeholder="Separe as tags por vírgula" className="mt-1" defaultValue={post.tags} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <h3 className="text-lg font-medium text-[#4072b0]">Autor</h3>

                <div>
                  <Label htmlFor="author">Autor do Post</Label>
                  <Select defaultValue={post.authorId}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione o autor" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map((author) => (
                        <SelectItem key={author.id} value={author.id}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <h3 className="text-lg font-medium text-[#4072b0]">SEO</h3>

                <div>
                  <Label htmlFor="metaTitle">Título SEO</Label>
                  <Input id="metaTitle" placeholder="Título para SEO" className="mt-1" defaultValue={post.metaTitle} />
                </div>

                <div>
                  <Label htmlFor="metaDescription">Descrição SEO</Label>
                  <Textarea
                    id="metaDescription"
                    placeholder="Descrição para SEO"
                    className="mt-1"
                    defaultValue={post.metaDescription}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
