import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, Upload, Save, ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"

// Dados de exemplo para o post
const post = {
  id: "1",
  title: "Como o Marketing Digital Transformou os Negócios em 2023",
  slug: "como-o-marketing-digital-transformou-os-negocios-em-2023",
  excerpt:
    "Descubra as principais tendências de marketing digital que impactaram os negócios no último ano e como se preparar para o futuro.",
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  status: "Publicado",
  category: "Marketing Digital",
  publishedAt: "2023-12-15T10:00:00Z",
  author: {
    name: "Ana Silva",
  },
  featured: true,
  allowComments: true,
  tags: ["marketing", "digital", "tendências", "negócios"],
  views: 1245,
  comments: 32,
}

export default function EditarBlogPostPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-[#f2f1ef]">
      <PageHeader
        title="Editar Post"
        description="Edite o post do blog da Integrare"
        actions={
          <div className="flex space-x-2">
            <Link href="/blog/admin">
              <Button variant="outline" className="border-[#4b7bb5] text-[#4b7bb5]">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]">
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          </div>
        }
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      placeholder="Digite o título do post"
                      className="text-lg"
                      defaultValue={post.title}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Resumo</Label>
                    <Textarea
                      id="excerpt"
                      placeholder="Digite um breve resumo do post"
                      className="min-h-[100px]"
                      defaultValue={post.excerpt}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Conteúdo</Label>
                    <Tabs defaultValue="editor" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="editor">Editor</TabsTrigger>
                        <TabsTrigger value="preview">Pré-visualização</TabsTrigger>
                      </TabsList>
                      <TabsContent value="editor" className="mt-2">
                        <Textarea
                          placeholder="Escreva o conteúdo do seu post aqui..."
                          className="min-h-[400px]"
                          defaultValue={post.content}
                        />
                      </TabsContent>
                      <TabsContent value="preview" className="mt-2">
                        <div className="border rounded-md p-4 min-h-[400px] bg-white">
                          <div className="prose max-w-none">
                            <p>{post.content}</p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      defaultValue={
                        post.status === "Publicado" ? "published" : post.status === "Rascunho" ? "draft" : "scheduled"
                      }
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

                  <div className="space-y-2">
                    <Label>Data de Publicação</Label>
                    <div className="flex">
                      <Button variant="outline" className="w-full justify-start text-left font-normal border-[#4b7bb5]">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>{new Date(post.publishedAt).toLocaleDateString("pt-BR")}</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select defaultValue={post.category.toLowerCase().replace(/\s+/g, "-")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marketing-digital">Marketing Digital</SelectItem>
                        <SelectItem value="seo">SEO</SelectItem>
                        <SelectItem value="redes-sociais">Redes Sociais</SelectItem>
                        <SelectItem value="email-marketing">E-mail Marketing</SelectItem>
                        <SelectItem value="analise-dados">Análise de Dados</SelectItem>
                        <SelectItem value="tendencias">Tendências</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Autor</Label>
                    <Select defaultValue={post.author.name.toLowerCase().replace(/\s+/g, "-")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o autor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ana-silva">Ana Silva</SelectItem>
                        <SelectItem value="carlos-mendes">Carlos Mendes</SelectItem>
                        <SelectItem value="juliana-costa">Juliana Costa</SelectItem>
                        <SelectItem value="ricardo-oliveira">Ricardo Oliveira</SelectItem>
                        <SelectItem value="fernanda-lima">Fernanda Lima</SelectItem>
                        <SelectItem value="paulo-santos">Paulo Santos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Imagem de Capa</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                      <div className="mb-4">
                        <img
                          src="/digital-marketing-concept.png"
                          alt="Imagem de capa atual"
                          className="h-32 mx-auto object-cover rounded-md"
                        />
                      </div>
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Arraste uma nova imagem ou clique para fazer upload</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG ou GIF até 2MB</p>
                      <Button variant="outline" size="sm" className="mt-4">
                        Alterar Imagem
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured" className="cursor-pointer">
                      Destacar post
                    </Label>
                    <Switch id="featured" defaultChecked={post.featured} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="comments" className="cursor-pointer">
                      Permitir comentários
                    </Label>
                    <Switch id="comments" defaultChecked={post.allowComments} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <Input placeholder="Adicione tags separadas por vírgula" defaultValue={post.tags.join(", ")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Personalizada</Label>
                    <Input id="slug" placeholder="url-personalizada" defaultValue={post.slug} />
                    <p className="text-xs text-gray-500">
                      https://integrare.com.br/blog/<span className="text-[#4b7bb5]">{post.slug}</span>
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir Post
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
