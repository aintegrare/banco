import Link from "next/link"
import { Calendar, Clock } from "lucide-react"

interface BlogFeaturedPostProps {
  post: any
}

export function BlogFeaturedPost({ post }: BlogFeaturedPostProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden group">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="h-64 md:h-auto overflow-hidden relative">
          <img
            src={post.featured_image || "/placeholder.svg?height=400&width=600&query=marketing digital"}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent md:bg-gradient-to-t"></div>
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#4b7bb5] text-white">
              Em Destaque
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8 flex flex-col justify-between">
          <div>
            <Link href={`/blog/categoria/${post.category?.slug || ""}`}>
              <div className="inline-block px-3 py-1 bg-[#4b7bb5]/10 text-[#4b7bb5] text-sm rounded-md mb-4 hover:bg-[#4b7bb5]/20 transition-colors">
                {post.category?.name || "Sem categoria"}
              </div>
            </Link>

            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-2xl md:text-3xl font-bold text-[#4072b0] dark:text-[#6b91c1] mb-3 hover:text-[#3d649e] transition-colors">
                {post.title}
              </h2>
            </Link>

            <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">{post.excerpt}</p>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <img
                src={post.author?.avatar_url || "/placeholder.svg?height=100&width=100&query=profile"}
                alt={post.author?.name || "Autor"}
                className="w-10 h-10 rounded-full mr-3 border-2 border-white shadow-sm"
              />
              <div>
                <div className="font-medium text-[#4b7bb5] dark:text-[#6b91c1]">{post.author?.name || "Autor"}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Autor</div>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-[#4b7bb5]" />
                <span>{new Date(post.published_at).toLocaleDateString("pt-BR")}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-[#4b7bb5]" />
                <span>{post.read_time} de leitura</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
