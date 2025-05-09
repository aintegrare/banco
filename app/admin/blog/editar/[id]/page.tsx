"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Save, ImageIcon, Eye } from "lucide-react"
import Link from "next/link"

export default function EditBlogPostPage({ params }) {
  const router = useRouter()
  const { id } = params
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState([])
  const [authors, setAuthors] = useState([])
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category_id: "",
    author_id: "",
    featured_image: "",
    published: false,
  })
  const [imagePreview, setImagePreview] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [post, setPost] = useState(null)

  useEffect(() => {
    fetchPost()
    fetchCategories()
    fetchAuthors()
  }, [id])

  const fetchPost = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/blog/posts/${id}`)
      if (!response.ok) throw new Error("Erro ao buscar post")

      const data = await response.json()
      setPost(data)
      setFormData({
        title: data.title || "",
        slug: data.slug || "",
        excerpt: data.excerpt || "",
        content: data.content || "",
        category_id: data.category_id ? data.category_id.toString() : "",
        author_id: data.author_id ? data.author_id.toString() : "",
        featured_image: data.featured_image || "",
        published: data.published || false,
      })

      if (data.featured_image) {
        setImagePreview(data.featured_image)
      }
    } catch (error) {
      console.error("Erro ao buscar post:", error)
      alert("Não foi possível carregar o post. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const supabase = createClient()
      const { data } = await supabase.from("blog_categories").select("*").order("name")
      setCategories(data || [])
    } catch (error) {
      console.error("Erro ao buscar categorias:", error)
    }
  }

  const fetchAuthors = async () => {
    try {
      const supabase = createClient()
      const { data } = await supabase.from("blog_authors").select("*").order("name")
      setAuthors(data || [])
    } catch (error) {
      console.error("Erro ao buscar autores:", error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Gerar slug automaticamente a partir do título apenas se o slug estiver vazio ou for igual ao slug original
    if (name === "title" && (!formData.slug || formData.slug === post?.slug)) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked) => {
    setFormData((prev) => ({ ...prev, published: checked }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async () => {
    if (!imageFile) return formData.featured_image

    try {
      const formData = new FormData()
      formData.append("file", imageFile)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Erro ao fazer upload da imagem")

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error)
      return formData.featured_image
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Upload da imagem, se houver
      let imageUrl = formData.featured_image
      if (imageFile) {
        imageUrl = await uploadImage()
      }

      // Preparar dados para envio
      const postData = {
        ...formData,
        featured_image: imageUrl,
        updated_at: new Date().toISOString(),
        published_at: formData.published && !post.published_at ? new Date().toISOString() : post.published_at,
      }

      // Enviar para a API
      const response = await fetch(`/api/blog/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })

      if (!response.ok) throw new Error("Erro ao atualizar post")

      // Redirecionar para a lista de posts
      router.push("/admin/blog")
    } catch (error) {
      console.error("Erro ao atualizar post:", error)
      alert("Ocorreu um erro ao atualizar o post. Por favor, tente novamente.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f2f1ef]">
        <PageHeader title="Editar Post" description="Carregando post..." />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4b7bb5] mx-auto"></div>
            <p className="mt-4 text-[#4b7bb5]">Carregando post...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f2f1ef]">
      <PageHeader
        title="Editar Post"
        description={`Editando: ${post?.title}`}
        actions={
          <div className="flex gap-2">
            <Link href="/admin/blog">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
            {post?.slug && (
              <Link href={`/blog/${post.slug}`} target="_blank">
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Visualizar
                </Button>
              </Link>
            )}
            <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]" onClick={handleSubmit} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        }
      />

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Coluna principal */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Digite o título do post"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        placeholder="slug-do-post"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        URL do post: {`https://seusite.com/blog/${formData.slug}`}
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="excerpt">Resumo</Label>
                      <Textarea
                        id="excerpt"
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        placeholder="Digite um breve resumo do post"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="content">Conteúdo</Label>
                      <Textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Digite o conteúdo do post"
                        rows={12}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Coluna lateral */}
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="published">Publicar</Label>
                      <Switch id="published" checked={formData.published} onCheckedChange={handleSwitchChange} />
                    </div>

                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <Select
                        value={formData.category_id}
                        onValueChange={(value) => handleSelectChange("category_id", value)}
                      >
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

                    <div>
                      <Label htmlFor="author">Autor</Label>
                      <Select
                        value={formData.author_id}
                        onValueChange={(value) => handleSelectChange("author_id", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um autor" />
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
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <Label>Imagem Destacada</Label>
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-md"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2 bg-white"
                          onClick={() => {
                            setImagePreview("")
                            setImageFile(null)
                            setFormData((prev) => ({ ...prev, featured_image: "" }))
                          }}
                        >
                          Remover
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">Clique para selecionar uma imagem</p>
                        </div>
                        <input
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={handleImageChange}
                          accept="image/*"
                        />
                      </div>
                    )}
                    <p className="text-xs text-gray-500">Recomendado: 1200 x 630 pixels. JPG ou PNG.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
