import Link from "next/link"
import { Clock } from "lucide-react"

interface Author {
  id: number
  name: string
  avatar_url: string
}

interface Category {
  id: number
  name: string
  slug: string
}

interface BlogPost {
  id: number | string
  title: string
  slug: string
  excerpt: string
  featured_image: string
  author: Author
  category: Category
  published_at: string
  read_time?: string
}

export function BlogRelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-[#4072b0] mb-4 border-b border-gray-100 pb-2">Posts Relacionados</h3>
      <div className="space-y-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="flex items-start space-x-3 group p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden">
              <img
                src={post.featured_image || "/placeholder.svg?height=100&width=100&query=blog"}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-[#4b7bb5] group-hover:text-[#3d649e] line-clamp-2 group-hover:underline">
                {post.title}
              </h4>
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <Clock className="h-3 w-3 mr-1 inline" />
                {post.read_time || "5 min"} de leitura
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
