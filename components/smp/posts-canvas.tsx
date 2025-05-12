"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  ImageIcon,
  Video,
  Calendar,
  BarChart,
  MessageCircle,
  Share2,
  Heart,
  Bookmark,
  MoreHorizontal,
} from "lucide-react"

// Componente para exibir um post de exemplo
const PostPreview = ({ platform, content, image, stats }) => {
  const platformIcons = {
    instagram: <Instagram className="h-5 w-5 text-[#E1306C]" />,
    facebook: <Facebook className="h-5 w-5 text-[#4267B2]" />,
    twitter: <Twitter className="h-5 w-5 text-[#1DA1F2]" />,
    linkedin: <Linkedin className="h-5 w-5 text-[#0077B5]" />,
  }

  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {platformIcons[platform]}
              <span className="font-medium capitalize">{platform}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm mb-3">{content}</p>
          {image && (
            <div className="rounded-md overflow-hidden mb-3">
              <img src={image || "/placeholder.svg"} alt="Post image" className="w-full h-auto object-cover" />
            </div>
          )}
          <div className="flex justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{stats.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{stats.comments}</span>
            </div>
            <div className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              <span>{stats.shares}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bookmark className="h-4 w-4" />
              <span>Salvar</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function PostsCanvas() {
  const [activeTab, setActiveTab] = useState("editor")

  // Dados de exemplo para posts
  const samplePosts = [
    {
      platform: "instagram",
      content:
        "Descubra nossas novas coleções de verão! Perfeitas para os dias quentes que estão chegando. #ModaVerão #NovasColeções",
      image: "/product-launch-excitement.png",
      stats: { likes: 128, comments: 32, shares: 15 },
    },
    {
      platform: "facebook",
      content:
        "Promoção especial de verão! Todos os produtos com até 40% de desconto. Aproveite enquanto durar o estoque. #Promoção #Desconto #Verão",
      image: "/summer-sale-display.png",
      stats: { likes: 245, comments: 56, shares: 78 },
    },
    {
      platform: "twitter",
      content:
        "Acabamos de lançar nossa nova linha de produtos sustentáveis. Conheça em nossa loja online! #Sustentabilidade #NovosProdutos",
      image: "",
      stats: { likes: 89, comments: 12, shares: 34 },
    },
    {
      platform: "linkedin",
      content:
        "Estamos felizes em anunciar nossa nova parceria estratégica com a empresa XYZ para desenvolvimento de soluções inovadoras no mercado.",
      image: "",
      stats: { likes: 156, comments: 23, shares: 45 },
    },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="border-b">
        <Tabs defaultValue="editor" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4">
            <TabsList className="grid grid-cols-4 mb-2">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Visualização</TabsTrigger>
              <TabsTrigger value="analytics">Análise</TabsTrigger>
              <TabsTrigger value="schedule">Agendamento</TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>

      <div className="flex-1 overflow-hidden">
        <TabsContent value="editor" className="h-full m-0 p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 h-full">
            <div className="border-r p-4 h-full overflow-y-auto">
              <h3 className="text-lg font-medium mb-4">Editor de Conteúdo</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Plataforma</label>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Instagram className="h-4 w-4 mr-2 text-[#E1306C]" />
                      Instagram
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Facebook className="h-4 w-4 mr-2 text-[#4267B2]" />
                      Facebook
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Twitter className="h-4 w-4 mr-2 text-[#1DA1F2]" />
                      Twitter
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Conteúdo</label>
                  <textarea
                    className="w-full h-32 p-2 border rounded-md"
                    placeholder="Digite o conteúdo do seu post aqui..."
                    defaultValue="Descubra nossas novas coleções de verão! Perfeitas para os dias quentes que estão chegando. #ModaVerão #NovasColeções"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Mídia</label>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Adicionar Imagem
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Video className="h-4 w-4 mr-2" />
                      Adicionar Vídeo
                    </Button>
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="bg-[#4b7bb5] hover:bg-[#3d649e] text-white">Publicar</Button>
                  <Button variant="outline" className="ml-2">
                    Salvar Rascunho
                  </Button>
                  <Button variant="outline" className="ml-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 h-full overflow-y-auto">
              <h3 className="text-lg font-medium mb-4">Visualização</h3>
              <div className="max-w-md mx-auto">
                <PostPreview
                  platform="instagram"
                  content="Descubra nossas novas coleções de verão! Perfeitas para os dias quentes que estão chegando. #ModaVerão #NovasColeções"
                  image="/product-launch-excitement.png"
                  stats={{ likes: 0, comments: 0, shares: 0 }}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="h-full m-0 p-4 overflow-y-auto">
          <h3 className="text-lg font-medium mb-4">Visualização de Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {samplePosts.map((post, index) => (
              <PostPreview
                key={index}
                platform={post.platform}
                content={post.content}
                image={post.image}
                stats={post.stats}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="h-full m-0 p-4 overflow-y-auto">
          <h3 className="text-lg font-medium mb-4">Análise de Desempenho</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Alcance Total</p>
                    <p className="text-2xl font-bold">12,456</p>
                  </div>
                  <BarChart className="h-8 w-8 text-[#4b7bb5]" />
                </div>
                <p className="text-xs text-green-600 mt-2">↑ 12% em relação à semana anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Engajamento</p>
                    <p className="text-2xl font-bold">3,872</p>
                  </div>
                  <Heart className="h-8 w-8 text-[#4b7bb5]" />
                </div>
                <p className="text-xs text-green-600 mt-2">↑ 8% em relação à semana anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Compartilhamentos</p>
                    <p className="text-2xl font-bold">945</p>
                  </div>
                  <Share2 className="h-8 w-8 text-[#4b7bb5]" />
                </div>
                <p className="text-xs text-green-600 mt-2">↑ 15% em relação à semana anterior</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <BarChart className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <h4 className="text-lg font-medium">Gráficos de Análise</h4>
            <p className="text-gray-500 mb-4">Visualize o desempenho dos seus posts ao longo do tempo</p>
            <Button className="bg-[#4b7bb5] hover:bg-[#3d649e] text-white">Ver Relatório Completo</Button>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="h-full m-0 p-4 overflow-y-auto">
          <h3 className="text-lg font-medium mb-4">Agendamento de Posts</h3>
          <div className="bg-gray-100 rounded-lg p-6 text-center mb-6">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <h4 className="text-lg font-medium">Calendário de Publicações</h4>
            <p className="text-gray-500 mb-4">Planeje e agende seus posts para publicação automática</p>
            <Button className="bg-[#4b7bb5] hover:bg-[#3d649e] text-white">Agendar Novo Post</Button>
          </div>

          <h4 className="font-medium mb-2">Posts Agendados</h4>
          <ScrollArea className="h-64 rounded-md border">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-[#E1306C]" />
                    <span className="text-sm font-medium">Post de Instagram</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Descubra nossas novas coleções de verão!...</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">25/11/2023</p>
                  <p className="text-xs text-gray-500">10:00</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <Facebook className="h-4 w-4 text-[#4267B2]" />
                    <span className="text-sm font-medium">Post de Facebook</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Promoção especial de verão! Todos os produtos...</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">26/11/2023</p>
                  <p className="text-xs text-gray-500">14:30</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-[#1DA1F2]" />
                    <span className="text-sm font-medium">Post de Twitter</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Acabamos de lançar nossa nova linha de produtos...</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">27/11/2023</p>
                  <p className="text-xs text-gray-500">09:15</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-[#0077B5]" />
                    <span className="text-sm font-medium">Post de LinkedIn</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Estamos felizes em anunciar nossa nova parceria...</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">28/11/2023</p>
                  <p className="text-xs text-gray-500">11:45</p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </div>
    </div>
  )
}
