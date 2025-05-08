import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { BlogAuthor } from "@/components/blog/blog-author"
import { BlogRelatedPosts } from "@/components/blog/blog-related-posts"
import { BlogShareButtons } from "@/components/blog/blog-share-buttons"
import { BlogCategories } from "@/components/blog/blog-categories"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock } from "lucide-react"

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
      <p>Em um mundo saturado de informações, o conteúdo superficial já não é suficiente. As marcas que se destacaram em 2023 foram aquelas que investiram em conteúdo aprofundado, oferecendo valor real e insights significativos para seus públicos. Estudos de caso detalhados, guias abrangentes e análises de especialistas ganharam destaque.</p>
      
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="text-[#4b7bb5] hover:text-[#3d649e] hover:bg-[#f2f1ef]/80">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o Blog
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cabeçalho do post */}
            <div>
              <div className="inline-block px-3 py-1 bg-[#4b7bb5] text-white text-sm rounded-md mb-4">
                {post.category}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#4072b0] mb-4">{post.title}</h1>
              <div className="flex items-center text-sm text-gray-600 mb-6 space-x-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{post.readTime} de leitura</span>
                </div>
              </div>
            </div>

            {/* Imagem de capa */}
            <div className="rounded-lg overflow-hidden mb-8">
              <img src={post.coverImage || "/placeholder.svg"} alt={post.title} className="w-full h-auto" />
            </div>

            {/* Conteúdo do post */}
            <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

            {/* Autor */}
            <BlogAuthor author={post.author} />

            {/* Compartilhar */}
            <BlogShareButtons title={post.title} url={`https://integrare.com.br/blog/${post.slug}`} />
          </div>

          {/* Barra lateral */}
          <div className="space-y-8">
            {/* Categorias */}
            <BlogCategories />

            {/* Posts relacionados */}
            <BlogRelatedPosts posts={relatedPosts} />

            {/* Newsletter */}
            <div className="bg-[#4b7bb5] rounded-lg shadow-sm p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Inscreva-se na Newsletter</h3>
              <p className="text-sm mb-4">Receba nossos conteúdos exclusivos diretamente no seu e-mail.</p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="w-full px-3 py-2 rounded-md text-gray-800 text-sm"
                />
                <Button className="w-full bg-white text-[#4b7bb5] hover:bg-gray-100">Inscrever-se</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
