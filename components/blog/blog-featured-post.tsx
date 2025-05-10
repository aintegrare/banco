import Link from "next/link"
import { Calendar, Clock, ArrowRight } from "lucide-react"

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
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 group hover:shadow-md transition-all duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="h-64 md:h-auto relative overflow-hidden">
          <img
            src={post.coverImage || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute bottom-0 left-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
            <Link href={`/blog/${post.slug}`} className="text-white flex items-center text-sm font-medium">
              Ler artigo completo
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="inline-block px-3 py-1 bg-[#4b7bb5]/10 text-[#4b7bb5] text-sm rounded-full mb-4">
              {post.category}
            </div>

            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-2xl font-bold text-[#4072b0] mb-3 hover:text-[#3d649e] line-clamp-3">{post.title}</h2>
            </Link>

            <p className="text-gray-600 mb-6 line-clamp-3">{post.excerpt}</p>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <img
                src={post.author.avatar || "/placeholder.svg"}
                alt={post.author.name}
                className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-white shadow-sm"
              />
              <div>
                <div className="font-medium text-[#4b7bb5]">{post.author.name}</div>
                <div className="text-xs text-gray-500">Autor</div>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-600 space-x-4">
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
        </div>
      </div>
    </div>
  )
}
