import Link from "next/link"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Author {
  name: string
  avatar: string
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage: string
  author: Author
  category: string
  publishedAt: string
  readTime: string
}

interface BlogFeaturedPostProps {
  post: BlogPost
}

export function BlogFeaturedPost({ post }: BlogFeaturedPostProps) {
  // Formatar a data de publicação
  const publishDate = new Date(post.publishedAt)
  const formattedDate = publishDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden group">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="h-64 md:h-auto relative overflow-hidden">
          <img
            src={post.coverImage || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden flex items-end">
            <div className="p-4">
              <Badge className="bg-[#4b7bb5] hover:bg-[#3d649e] mb-2">{post.category}</Badge>
              <h2 className="text-xl font-bold text-white mb-1">{post.title}</h2>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 flex flex-col justify-between">
          <div>
            <Badge className="bg-[#4b7bb5] hover:bg-[#3d649e] mb-3 hidden md:inline-flex">{post.category}</Badge>

            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-2xl md:text-3xl font-bold text-[#4072b0] mb-3 group-hover:text-[#3d649e] hidden md:block">
                {post.title}
              </h2>
            </Link>

            <p className="text-gray-600 mb-6">{post.excerpt}</p>

            <div className="flex items-center text-sm text-gray-600 mb-6 space-x-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-[#4b7bb5]" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-[#4b7bb5]" />
                <span>{post.readTime} de leitura</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={post.author.avatar || "/placeholder.svg"}
                alt={post.author.name}
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
              <div>
                <div className="font-medium text-[#4b7bb5]">{post.author.name}</div>
                <div className="text-xs text-gray-500">Autor</div>
              </div>
            </div>

            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center px-4 py-2 bg-[#4b7bb5] text-white rounded-md hover:bg-[#3d649e] transition-colors"
            >
              Ler artigo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
