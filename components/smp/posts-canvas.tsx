"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
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
  ChevronDown,
  Upload,
  Clock,
  Hash,
  AtSign,
  Smile,
  PlusCircle,
  BarChart3,
  TrendingUp,
  Users,
  Eye,
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
  const [selectedPlatforms, setSelectedPlatforms] = useState(["instagram"])
  const [postContent, setPostContent] = useState(
    "Descubra nossas novas coleções de verão! Perfeitas para os dias quentes que estão chegando. #ModaVerão #NovasColeções",
  )
  const [postImage, setPostImage] = useState("/product-launch-excitement.png")

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

  const togglePlatform = (platform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform))
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform])
    }
  }

  return (
    <div className="h-full flex flex-col flex-1 overflow-hidden">
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
        <TabsContent value="editor" className="h-full m-0 p-0 data-[state=active]:block">
          <div className="grid grid-cols-1 md:grid-cols-2 h-full">
            <div className="border-r p-4 h-full overflow-y-auto">
              <h3 className="text-lg font-medium mb-4">Editor de Conteúdo</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Plataforma</label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedPlatforms.includes("instagram") ? "default" : "outline"}
                      size="sm"
                      className={`flex items-center ${selectedPlatforms.includes("instagram") ? "bg-[#E1306C] hover:bg-[#c1255b]" : ""}`}
                      onClick={() => togglePlatform("instagram")}
                    >
                      <Instagram className="h-4 w-4 mr-2" />
                      Instagram
                    </Button>
                    <Button
                      variant={selectedPlatforms.includes("facebook") ? "default" : "outline"}
                      size="sm"
                      className={`flex items-center ${selectedPlatforms.includes("facebook") ? "bg-[#4267B2] hover:bg-[#365899]" : ""}`}
                      onClick={() => togglePlatform("facebook")}
                    >
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </Button>
                    <Button
                      variant={selectedPlatforms.includes("twitter") ? "default" : "outline"}
                      size="sm"
                      className={`flex items-center ${selectedPlatforms.includes("twitter") ? "bg-[#1DA1F2] hover:bg-[#1a91da]" : ""}`}
                      onClick={() => togglePlatform("twitter")}
                    >
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </Button>
                    <Button
                      variant={selectedPlatforms.includes("linkedin") ? "default" : "outline"}
                      size="sm"
                      className={`flex items-center ${selectedPlatforms.includes("linkedin") ? "bg-[#0077B5] hover:bg-[#006699]" : ""}`}
                      onClick={() => togglePlatform("linkedin")}
                    >
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Conteúdo</label>
                  <Textarea
                    className="w-full h-32 p-2 border rounded-md"
                    placeholder="Digite o conteúdo do seu post aqui..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Hash className="h-3 w-3 mr-1" />
                      Hashtags
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <AtSign className="h-3 w-3 mr-1" />
                      Menções
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Smile className="h-3 w-3 mr-1" />
                      Emojis
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Mídia</label>
                  <div className="flex space-x-2 mb-2">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Adicionar Imagem
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Video className="h-4 w-4 mr-2" />
                      Adicionar Vídeo
                    </Button>
                  </div>
                  {postImage && (
                    <div className="relative rounded-md overflow-hidden border border-gray-200 mb-2">
                      <img
                        src={postImage || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-auto max-h-[200px] object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 rounded-full"
                        onClick={() => setPostImage(null)}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                    <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Arraste e solte arquivos aqui ou clique para selecionar</p>
                    <input type="file" className="hidden" />
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
                {selectedPlatforms.map((platform) => (
                  <PostPreview
                    key={platform}
                    platform={platform}
                    content={postContent}
                    image={postImage}
                    stats={{ likes: 0, comments: 0, shares: 0 }}
                  />
                ))}
                {selectedPlatforms.length === 0 && (
                  <div className="text-center p-8 border border-dashed rounded-md">
                    <p className="text-gray-500">Selecione pelo menos uma plataforma para visualizar o post</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="h-full m-0 p-4 overflow-y-auto data-[state=active]:block">
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

        <TabsContent value="analytics" className="h-full m-0 p-4 overflow-y-auto data-[state=active]:block">
          <h3 className="text-lg font-medium mb-4">Análise de Desempenho</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Alcance Total</p>
                    <p className="text-2xl font-bold">12,456</p>
                  </div>
                  <Eye className="h-8 w-8 text-[#4b7bb5]" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-4">Desempenho por Plataforma</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center">
                        <Instagram className="h-4 w-4 text-[#E1306C] mr-2" />
                        <span className="text-sm">Instagram</span>
                      </div>
                      <span className="text-sm font-medium">5,234</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#E1306C] h-2 rounded-full" style={{ width: "70%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center">
                        <Facebook className="h-4 w-4 text-[#4267B2] mr-2" />
                        <span className="text-sm">Facebook</span>
                      </div>
                      <span className="text-sm font-medium">3,891</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#4267B2] h-2 rounded-full" style={{ width: "55%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center">
                        <Twitter className="h-4 w-4 text-[#1DA1F2] mr-2" />
                        <span className="text-sm">Twitter</span>
                      </div>
                      <span className="text-sm font-medium">2,156</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#1DA1F2] h-2 rounded-full" style={{ width: "40%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center">
                        <Linkedin className="h-4 w-4 text-[#0077B5] mr-2" />
                        <span className="text-sm">LinkedIn</span>
                      </div>
                      <span className="text-sm font-medium">1,175</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#0077B5] h-2 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-4">Métricas de Crescimento</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-[#4b7bb5] mr-2" />
                      <div>
                        <p className="text-sm font-medium">Novos Seguidores</p>
                        <p className="text-xs text-gray-500">Últimos 30 dias</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">+487</p>
                      <p className="text-xs text-green-600">↑ 12.4%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-[#4b7bb5] mr-2" />
                      <div>
                        <p className="text-sm font-medium">Taxa de Crescimento</p>
                        <p className="text-xs text-gray-500">Mensal</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">8.7%</p>
                      <p className="text-xs text-green-600">↑ 2.1%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BarChart3 className="h-5 w-5 text-[#4b7bb5] mr-2" />
                      <div>
                        <p className="text-sm font-medium">Engajamento Médio</p>
                        <p className="text-xs text-gray-500">Por post</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">243</p>
                      <p className="text-xs text-green-600">↑ 5.8%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <BarChart className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <h4 className="text-lg font-medium">Relatório Detalhado</h4>
            <p className="text-gray-500 mb-4">Visualize métricas avançadas e insights personalizados</p>
            <Button className="bg-[#4b7bb5] hover:bg-[#3d649e] text-white">Ver Relatório Completo</Button>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="h-full m-0 p-4 overflow-y-auto data-[state=active]:block">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Agendamento de Posts</h3>
            <Button className="bg-[#4b7bb5] hover:bg-[#3d649e] text-white">
              <PlusCircle className="h-4 w-4 mr-2" />
              Agendar Novo Post
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6 border rounded-lg p-4">
            <div className="md:col-span-7 mb-2">
              <h4 className="font-medium">Calendário de Publicações</h4>
              <p className="text-sm text-gray-500">Maio 2023</p>
            </div>

            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day, i) => (
              <div key={i} className="text-center font-medium text-sm p-2 bg-gray-100 rounded">
                {day}
              </div>
            ))}

            {Array.from({ length: 35 }).map((_, i) => {
              const day = i - 1 // Ajuste para começar no dia correto
              const hasPost = [3, 8, 12, 15, 22, 27].includes(day)
              const isToday = day === 15

              return (
                <div
                  key={i}
                  className={`border rounded min-h-[80px] p-1 ${day < 1 || day > 31 ? "bg-gray-50 border-dashed" : ""} ${isToday ? "border-blue-400 border-2" : ""}`}
                >
                  {day > 0 && day <= 31 && (
                    <>
                      <div className="text-right text-xs mb-1">{day}</div>
                      {hasPost && (
                        <div className="bg-blue-100 text-blue-800 text-xs p-1 rounded mb-1 truncate flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Post {day < 16 ? "publicado" : "agendado"}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            })}
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
                  <p className="text-xs font-medium">25/05/2023</p>
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
                  <p className="text-xs font-medium">26/05/2023</p>
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
                  <p className="text-xs font-medium">27/05/2023</p>
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
                  <p className="text-xs font-medium">28/05/2023</p>
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
