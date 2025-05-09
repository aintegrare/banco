"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchPosts()
    fetchCategories()
  }, [currentPage, searchQuery, statusFilter, categoryFilter])

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()

      let query = supabase
        .from("blog_posts")
        .select(`
          *,
          author:blog_authors(id, name, avatar_url),
          category:blog_categories(id, name, slug)
        `)
        .order("created_at", { ascending: false })

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
      }

      if (statusFilter) {
        query = query.eq("published", statusFilter === "published")
      }

      if (categoryFilter) {
        query = query.eq("category_id", categoryFilter)
      }

      // Paginação
      const from = (currentPage - 1) * 10
      const to = from + 9

      const { data, count, error } = await query.range(from, to)

      if (error) throw error

      setPosts(data || [])
      setTotalPages(Math.ceil((count || 0) / 10))
    } catch (error) {
      console.error("Erro ao buscar posts:", error)
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

  const handleDeletePost = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este post?")) return

    try {
      const response = await fetch(`/api/blog/posts/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erro ao excluir post")

      // Atualizar a lista de posts
      fetchPosts()
    } catch (error) {
      console.error("Erro ao excluir post:", error)
      alert("Ocorreu um erro ao excluir o post. Por favor, tente novamente.")
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Não publicado"

    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-[#f2f1ef]">
      <PageHeader
        title="Gerenciar Blog"
        description="Gerencie os posts, categorias e autores do blog da Integrare"
        actions={
          <Link href="/admin/blog/novo">
            <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]">
              <Plus className="mr-2 h-4 w-4" />
              Novo Post
            </Button>
          </Link>
        }
      />

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Filtros e busca */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar posts..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="published">Publicados</SelectItem>
                  <SelectItem value="draft">Rascunhos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Categoria" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabela de posts */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4b7bb5] mx-auto"></div>
              <p className="mt-4 text-[#4b7bb5]">Carregando posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Nenhum post encontrado</p>
              <Link href="/admin/blog/novo">
                <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Novo Post
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded overflow-hidden mr-3 flex-shrink-0">
                            <img
                              src={post.featured_image || "/placeholder.svg?height=40&width=40&query=thumbnail"}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="line-clamp-1">{post.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>{post.author?.name || "Sem autor"}</TableCell>
                      <TableCell>{post.category?.name || "Sem categoria"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={post.published ? "default" : "outline"}
                          className={post.published ? "bg-green-500" : ""}
                        >
                          {post.published ? "Publicado" : "Rascunho"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(post.published_at)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/blog/${post.slug}`} target="_blank">
                                <Eye className="mr-2 h-4 w-4" />
                                <span>Visualizar</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/blog/editar/${post.id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Editar</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeletePost(post.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Excluir</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink isActive={currentPage === page} onClick={() => setCurrentPage(page)}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
