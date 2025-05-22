"use client"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { BlogShareButtons } from "@/components/blog/blog-share-buttons"
import { BlogRelatedPosts } from "@/components/blog/blog-related-posts"
import { BlogCategories } from "@/components/blog/blog-categories"
import { getPostBySlug, getRelatedPosts, getAdjacentPosts } from "@/lib/blog-utils"

export function BlogPostPageClient({ params }: { params: { slug: string } }) {
  console.log(`Renderizando página para slug: ${params.slug}`)

  // Buscar o post pelo slug
  const post = getPostBySlug(params.slug) as any

  // Se o post não foi encontrado, mostrar página 404
  if (!post) {
    console.log(`Post não encontrado para slug: ${params.slug}`)
    notFound()
  }

  // Formatar a data de publicação
  const publishDate = post?.published_at ? new Date(post.published_at) : new Date()
  const formattedDate = publishDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  // Buscar posts relacionados
  const relatedPosts = post?.category?.id ? (getRelatedPosts(post.category.id, post.id) as any) : []

  // Buscar posts adjacentes (anterior e próximo)
  const adjacentPosts = getAdjacentPosts(post.id) as any

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8">
      <div className="container mx-auto px-4">
        {/* Navegação superior */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="text-[#4b7bb5] hover:text-[#3d649e] hover:bg-[#f2f1ef]/80">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o Blog
            </Button>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Conteúdo principal - Estilo LaTeX */}
          <div className="lg:w-3/4 bg-white rounded-md shadow-sm overflow-hidden">
            {/* Cabeçalho do artigo */}
            <div className="border-b border-gray-200 p-8 pb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <span className="bg-[#4b7bb5] text-white px-2 py-0.5 rounded text-xs">
                  {post?.category?.name || "Sem categoria"}
                </span>
                <span>•</span>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formattedDate}</span>
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{post?.read_time || "3 min"} de leitura</span>
                </div>
              </div>

              <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {post?.title || "Post não encontrado"}
              </h1>

              {post?.excerpt && (
                <p className="font-serif text-lg text-gray-600 italic border-l-4 border-[#4b7bb5] pl-4 py-1">
                  {post.excerpt}
                </p>
              )}

              {post?.author && (
                <div className="flex items-center mt-6">
                  {post.author.avatar_url && (
                    <img
                      src={post.author.avatar_url || "/placeholder.svg"}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{post.author.name}</p>
                    <p className="text-sm text-gray-600">Autor</p>
                  </div>
                </div>
              )}
            </div>

            {/* Conteúdo do artigo - Estilo LaTeX */}
            <div className="latex-content p-8 md:p-16">
              <style jsx global>{`
                .latex-content {
                  font-family: 'Georgia', serif;
                  line-height: 1.6;
                  color: #333;
                }
                
                .latex-content h1, 
                .latex-content h2, 
                .latex-content h3, 
                .latex-content h4, 
                .latex-content h5, 
                .latex-content h6 {
                  font-family: 'Georgia', serif;
                  margin-top: 2em;
                  margin-bottom: 1em;
                  font-weight: bold;
                  color: #222;
                }
                
                .latex-content h2 {
                  font-size: 1.8em;
                  border-bottom: 1px solid #eee;
                  padding-bottom: 0.3em;
                }
                
                .latex-content h3 {
                  font-size: 1.5em;
                }
                
                .latex-content p {
                  margin-bottom: 1.5em;
                  text-align: justify;
                  hyphens: auto;
                }
                
                .latex-content ul, 
                .latex-content ol {
                  margin-bottom: 1.5em;
                  padding-left: 2em;
                }
                
                .latex-content li {
                  margin-bottom: 0.5em;
                }
                
                .latex-content blockquote {
                  font-style: italic;
                  border-left: 3px solid #ddd;
                  padding-left: 1em;
                  margin-left: 0;
                  margin-right: 0;
                  margin-bottom: 1.5em;
                  color: #555;
                }
                
                .latex-content img {
                  max-width: 100%;
                  height: auto;
                  margin: 2em auto;
                  display: block;
                }
                
                .latex-content a {
                  color: #4b7bb5;
                  text-decoration: none;
                  border-bottom: 1px solid #4b7bb5;
                }
                
                .latex-content a:hover {
                  border-bottom: 2px solid #4b7bb5;
                }
                
                .latex-content code {
                  font-family: 'Courier New', monospace;
                  background-color: #f5f5f5;
                  padding: 0.2em 0.4em;
                  border-radius: 3px;
                  font-size: 0.9em;
                }
                
                .latex-content pre {
                  background-color: #f5f5f5;
                  padding: 1em;
                  border-radius: 5px;
                  overflow-x: auto;
                  margin-bottom: 1.5em;
                }
                
                .latex-content table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 1.5em;
                }
                
                .latex-content th, 
                .latex-content td {
                  border: 1px solid #ddd;
                  padding: 0.5em;
                  text-align: left;
                }
                
                .latex-content th {
                  background-color: #f5f5f5;
                  font-weight: bold;
                }
                
                .latex-content figure {
                  margin: 2em 0;
                }
                
                .latex-content figcaption {
                  text-align: center;
                  font-style: italic;
                  font-size: 0.9em;
                  color: #666;
                  margin-top: 0.5em;
                }
              `}</style>

              <div
                className="latex-content"
                dangerouslySetInnerHTML={{ __html: post?.content || "<p>Conteúdo não disponível</p>" }}
              />
            </div>

            {/* Navegação entre posts */}
            <div className="border-t border-gray-200 p-8 flex justify-between items-center gap-4">
              {adjacentPosts.prev ? (
                <Link href={`/blog/${adjacentPosts.prev.slug}`} className="flex-1">
                  <Button variant="outline" className="w-full justify-start border-[#4b7bb5] text-[#4b7bb5]">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    <span className="truncate">{adjacentPosts.prev.title}</span>
                  </Button>
                </Link>
              ) : (
                <div className="flex-1"></div>
              )}

              {adjacentPosts.next ? (
                <Link href={`/blog/${adjacentPosts.next.slug}`} className="flex-1">
                  <Button variant="outline" className="w-full justify-end border-[#4b7bb5] text-[#4b7bb5]">
                    <span className="truncate">{adjacentPosts.next.title}</span>
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <div className="flex-1"></div>
              )}
            </div>

            {/* Compartilhar */}
            <div className="border-t border-gray-200 p-8">
              <BlogShareButtons title={post.title} url={`https://integrare.com.br/blog/${post.slug}`} />
            </div>
          </div>

          {/* Barra lateral */}
          <div className="lg:w-1/4 space-y-8">
            {/* Categorias */}
            <BlogCategories />

            {/* Posts relacionados */}
            {relatedPosts.length > 0 && <BlogRelatedPosts posts={relatedPosts} />}

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-[#4b7bb5] to-[#3d649e] rounded-md shadow-sm p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Inscreva-se na Newsletter</h3>
              <p className="text-sm mb-4 text-white/90">
                Receba nossos conteúdos exclusivos diretamente no seu e-mail.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="w-full px-4 py-3 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-[#6b91c1] focus:outline-none"
                />
                <Button className="w-full bg-white text-[#4b7bb5] hover:bg-gray-100 py-5">Inscrever-se</Button>
              </div>
            </div>

            {/* CTA para contato */}
            <div className="bg-white rounded-md shadow-sm p-6 border-l-4 border-[#4b7bb5]">
              <h3 className="text-lg font-bold text-[#4072b0] mb-2">Precisa de ajuda com marketing?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Nossa equipe está pronta para ajudar sua empresa a alcançar resultados excepcionais.
              </p>
              <Link href="/contato">
                <Button className="w-full bg-[#4b7bb5] hover:bg-[#3d649e]">Fale com um especialista</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
