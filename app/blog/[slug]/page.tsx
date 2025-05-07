import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  MessageSquare,
  Bookmark,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
  Mail,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { BlogPostCard } from "@/components/blog/blog-post-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
      
      <h2>Marketing de Conteúdo Aprofundado</h2>
      <p>Em um mundo saturado de informações, o conteúdo superficial já não é suficiente. As marcas que se destacaram em 2023 foram aquelas que investiram em conteúdo aprofundado, oferecendo valor real e insights significativos para seus públicos. Estudos de caso detalhados, guias abrangentes e análises de especialistas ganharam destaque.
      
      <h2>Experiências Imersivas</h2>
      <p>Com o avanço da realidade aumentada (RA) e realidade virtual (RV), as marcas começaram a oferecer experiências imersivas que permitem aos consumidores interagir com produtos e serviços de maneiras inovadoras. Desde provar roupas virtualmente até visualizar móveis em suas próprias casas, essas tecnologias estão redefinindo a jornada do cliente.</p>
      
      <h2>Sustentabilidade como Diferencial</h2>
      <p>Os consumidores estão cada vez mais conscientes do impacto ambiental de suas escolhas de compra. Em 2023, vimos um aumento significativo no marketing focado em sustentabilidade, com empresas destacando suas iniciativas ecológicas e práticas responsáveis como um diferencial competitivo.</p>
      
      <h2>Marketing de Influência Evoluído</h2>
      <p>O marketing de influência amadureceu, com marcas buscando parcerias mais autênticas e de longo prazo com criadores de conteúdo. Micro e nano influenciadores ganharam destaque por oferecerem engajamento mais genuíno e taxas de conversão mais altas em nichos específicos.</p>
      
      <h2>Privacidade e Transparência</h2>
      <p>Com o fim dos cookies de terceiros se aproximando e regulamentações de privacidade mais rigorosas, as empresas tiveram que adaptar suas estratégias de coleta e uso de dados. Transparência e construção de confiança tornaram-se elementos centrais nas comunicações de marketing.</p>
      
      <h2>Conclusão</h2>
      <p>O marketing digital em 2023 foi marcado por uma maior sofisticação tecnológica, autenticidade e foco no cliente. As empresas que conseguiram equilibrar inovação tecnológica com conexões humanas genuínas foram as que mais se destacaram. Olhando para o futuro, podemos esperar que essas tendências continuem a evoluir, com a IA e a personalização desempenhando papéis ainda mais significativos na forma como as marcas se comunicam com seus públicos.</p>
    `,
    coverImage: "/digital-marketing-concept.png",
    author: {
      name: "Ana Silva",
      avatar: "/woman-profile.png",
      bio: "Especialista em Marketing Digital com mais de 10 anos de experiência no mercado. Apaixonada por estratégias inovadoras e novas tecnologias.",
    },
    category: "Marketing Digital",
    publishedAt: "2023-12-15T10:00:00Z",
    readTime: "5 min",
    featured: true,
  },
  // Outros posts omitidos para brevidade
]

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts.find((post) => post.slug === params.slug)

  if (!post) {
    return {
      title: "Post não encontrado | Blog Integrare",
      description: "O post que você está procurando não foi encontrado.",
    }
  }

  return {
    title: `${post.title} | Blog Integrare`,
    description: post.excerpt,
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((post) => post.slug === params.slug)

  if (!post) {
    notFound()
  }

  // Formatar a data de publicação
  const publishDate = new Date(post.publishedAt)
  const formattedDate = publishDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  // Encontrar posts relacionados (mesma categoria)
  const relatedPosts = blogPosts.filter((p) => p.category === post.category && p.id !== post.id).slice(0, 3)

  return (
    <div className="min-h-screen bg-[#f2f1ef]">
      <div className="bg-gradient-to-b from-[#4b7bb5] to-[#3d649e] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/blog">
              <Button variant="ghost" className="text-white hover:text-white/80 hover:bg-white/10 mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o Blog
              </Button>
            </Link>

            <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 mb-4">{post.category}</Badge>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3 border-2 border-white">
                  <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{post.author.name}</div>
                  <div className="text-xs text-white/70">Autor</div>
                </div>
              </div>

              <div className="flex items-center text-sm space-x-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 opacity-70" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 opacity-70" />
                  <span>{post.readTime} de leitura</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Imagem de capa */}
            <div className="rounded-lg overflow-hidden shadow-md">
              <img src={post.coverImage || "/placeholder.svg"} alt={post.title} className="w-full h-auto" />
            </div>

            {/* Ações do post */}
            <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-3">
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#4b7bb5]">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  <span className="text-sm">42</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#4b7bb5]">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <span className="text-sm">12</span>
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#4b7bb5]">
                  <Bookmark className="h-4 w-4 mr-2" />
                  <span className="text-sm">Salvar</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#4b7bb5]">
                  <Share2 className="h-4 w-4 mr-2" />
                  <span className="text-sm">Compartilhar</span>
                </Button>
              </div>
            </div>

            {/* Conteúdo do post */}
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
              </CardContent>
            </Card>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-gray-50">
                marketing digital
              </Badge>
              <Badge variant="outline" className="bg-gray-50">
                tendências
              </Badge>
              <Badge variant="outline" className="bg-gray-50">
                inteligência artificial
              </Badge>
              <Badge variant="outline" className="bg-gray-50">
                conteúdo
              </Badge>
              <Badge variant="outline" className="bg-gray-50">
                2023
              </Badge>
            </div>

            {/* Autor */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <Avatar className="h-20 w-20 border">
                    <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold text-[#4072b0] mb-2">Sobre {post.author.name}</h3>
                    <p className="text-gray-600 mb-4">{post.author.bio}</p>
                    <div className="flex space-x-3">
                      <Button variant="outline" size="sm" className="text-[#4b7bb5] border-[#4b7bb5]">
                        Ver todos os posts
                      </Button>
                      <Button size="sm" className="bg-[#4b7bb5] hover:bg-[#3d649e]">
                        Seguir
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navegação entre posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <Link href="#" className="group">
                <div className="bg-white rounded-lg shadow-sm p-4 h-full flex items-center hover:border-l-4 hover:border-[#4b7bb5] transition-all">
                  <ChevronLeft className="h-5 w-5 mr-2 text-[#4b7bb5]" />
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Post Anterior</div>
                    <div className="font-medium text-[#4b7bb5] group-hover:text-[#3d649e]">
                      Estratégias de SEO para Pequenas Empresas
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="#" className="group">
                <div className="bg-white rounded-lg shadow-sm p-4 h-full flex items-center justify-end hover:border-r-4 hover:border-[#4b7bb5] transition-all">
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">Próximo Post</div>
                    <div className="font-medium text-[#4b7bb5] group-hover:text-[#3d649e]">
                      O Poder das Redes Sociais para Engajamento
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 ml-2 text-[#4b7bb5]" />
                </div>
              </Link>
            </div>

            {/* Comentários */}
            <Card>
              <CardHeader>
                <CardTitle>Comentários (12)</CardTitle>
                <CardDescription>Participe da discussão sobre este artigo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4 mb-6">
                  <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <textarea
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
                      placeholder="Escreva seu comentário..."
                      rows={3}
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]">Comentar</Button>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Lista de comentários */}
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex space-x-4">
                      <Avatar>
                        <AvatarFallback>{`U${i}`}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="font-medium mr-2">Usuário Exemplo {i}</span>
                          <span className="text-xs text-gray-500">
                            há {i} dia{i > 1 ? "s" : ""}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">
                          Este é um comentário de exemplo. Excelente artigo com informações muito úteis sobre marketing
                          digital!
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <button className="hover:text-[#4b7bb5]">Responder</button>
                          <button className="hover:text-[#4b7bb5]">Curtir</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-6">
                  <Button variant="outline" className="text-[#4b7bb5] border-[#4b7bb5]">
                    Ver mais comentários
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Barra lateral */}
          <div className="space-y-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Categorias</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-1">
                {["Marketing Digital", "SEO", "Redes Sociais", "E-mail Marketing"].map((category) => (
                  <Link
                    key={category}
                    href={`/blog/categoria/${category.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex items-center justify-between py-2 hover:bg-gray-50 px-2 rounded-md group"
                  >
                    <span className="text-[#4b7bb5] group-hover:text-[#3d649e]">{category}</span>
                    <Badge variant="outline" className="bg-gray-100">
                      {Math.floor(Math.random() * 20) + 1}
                    </Badge>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="pb-3 bg-[#4b7bb5] text-white">
                <CardTitle>Posts Relacionados</CardTitle>
                <CardDescription className="text-white/80">Mais conteúdo sobre {post.category}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {relatedPosts.map((relatedPost) => (
                    <BlogPostCard key={relatedPost.id} post={relatedPost} variant="compact" />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#4b7bb5] text-white">
              <CardHeader>
                <CardTitle>Newsletter</CardTitle>
                <CardDescription className="text-white/80">
                  Receba nossos conteúdos exclusivos diretamente no seu e-mail
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Seu melhor e-mail" className="pl-10 bg-white text-gray-800 border-0" />
                  </div>
                  <Button className="w-full bg-white text-[#4b7bb5] hover:bg-gray-100">Inscrever-se</Button>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-white/70 border-t border-white/10 pt-4">
                Não enviamos spam. Você pode cancelar a qualquer momento.
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Tags Populares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-200">
                    marketing
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-200">
                    seo
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-200">
                    redes sociais
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-200">
                    estratégia
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-200">
                    vendas
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-200">
                    conteúdo
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-200">
                    analytics
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
