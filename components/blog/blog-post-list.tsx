import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye } from "lucide-react"

interface Author {
  name: string
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  status: string
  category: string
  publishedAt: string | null
  author: Author
}

interface BlogPostListProps {
  posts: BlogPost[]
}

export function BlogPostList({ posts }: BlogPostListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="px-4 py-3 text-sm font-medium text-gray-600">Título</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-600">Autor</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-600">Categoria</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-600">Status</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-600">Data</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-600">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-gray-50">
              <td className="px-4 py-4">
                <div className="font-medium text-[#4b7bb5]">{post.title}</div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-1">{post.excerpt}</div>
              </td>
              <td className="px-4 py-4 text-sm">{post.author.name}</td>
              <td className="px-4 py-4 text-sm">{post.category}</td>
              <td className="px-4 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    post.status === "Publicado"
                      ? "bg-green-100 text-green-800"
                      : post.status === "Rascunho"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {post.status}
                </span>
              </td>
              <td className="px-4 py-4 text-sm">
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("pt-BR") : "-"}
              </td>
              <td className="px-4 py-4">
                <div className="flex space-x-2">
                  <Link href={`/blog/${post.slug}`}>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4 text-gray-500" />
                    </Button>
                  </Link>
                  <Link href={`/blog/admin/editar/${post.id}`}>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4 text-[#4b7bb5]" />
                    </Button>
                  </Link>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
