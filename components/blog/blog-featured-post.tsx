import Link from "next/link"
import { Calendar, Clock } from "lucide-react"

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
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="h-64 md:h-auto overflow-hidden">
          <img
            src={post.coverImage || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="inline-block px-3 py-1 bg-[#4b7bb5] text-white text-sm rounded-md mb-4">
              {post.category}
            </div>

            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-2xl font-bold text-[#4072b0] mb-3 hover:text-[#3d649e]">{post.title}</h2>
            </Link>

            <p className="text-gray-600 mb-4">{post.excerpt}</p>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <img
                src={post.author.avatar || "/placeholder.svg"}
                alt={post.author.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <div className="font-medium text-[#4b7bb5]">{post.author.name}</div>
                <div className="text-xs text-gray-500">Autor</div>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-600 space-x-4">
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
        </div>
      </div>
    </div>
  )
}
