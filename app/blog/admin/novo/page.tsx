import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, Upload, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NovoBlogPostPage() {
  return (
    <div className="min-h-screen bg-[#f2f1ef]">
      <PageHeader
        title="Novo Post"
        description="Crie um novo post para o blog da Integrare"
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
              Salvar
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
                    <Input id="title" placeholder="Digite o título do post" className="text-lg" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Resumo</Label>
                    <Textarea id="excerpt" placeholder="Digite um breve resumo do post" className="min-h-[100px]" />
                  </div>

                  <div className="space-y-2">
                    <Label>Conteúdo</Label>
                    <Tabs defaultValue="editor" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="editor">Editor</TabsTrigger>
                        <TabsTrigger value="preview">Pré-visualização</TabsTrigger>
                      </TabsList>
                      <TabsContent value="editor" className="mt-2">
                        <Textarea placeholder="Escreva o conteúdo do seu post aqui..." className="min-h-[400px]" />
                      </TabsContent>
                      <TabsContent value="preview" className="mt-2">
                        <div className="border rounded-md p-4 min-h-[400px] bg-white">
                          <p className="text-gray-500 text-center">Pré-visualização do conteúdo</p>
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
                    <Select defaultValue="draft">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Rascunho</SelectItem>
                        <SelectItem value="published">Publicar agora</SelectItem>
                        <SelectItem value="scheduled">Agendar publicação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Data de Publicação</Label>
                    <div className="flex">
                      <Button variant="outline" className="w-full justify-start text-left font-normal border-[#4b7bb5]">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>Selecionar data</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select>
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
                    <Select>
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
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Arraste uma imagem ou clique para fazer upload</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG ou GIF até 2MB</p>
                      <Button variant="outline" size="sm" className="mt-4">
                        Selecionar Arquivo
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured" className="cursor-pointer">
                      Destacar post
                    </Label>
                    <Switch id="featured" />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="comments" className="cursor-pointer">
                      Permitir comentários
                    </Label>
                    <Switch id="comments" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <Input placeholder="Adicione tags separadas por vírgula" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Personalizada</Label>
                    <Input id="slug" placeholder="url-personalizada" />
                    <p className="text-xs text-gray-500">
                      https://integrare.com.br/blog/<span className="text-[#4b7bb5]">url-personalizada</span>
                    </p>
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
