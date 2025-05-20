import Link from "next/link"

interface BlogPostCardProps {
  post: any
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden h-full flex flex-col group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.featured_image || "/placeholder.svg?height=200&width=400&query=marketing digital"}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <span className="text-xs font-medium bg-[#4b7bb5] px-2 py-1 rounded-full">
            {post.category?.name || "Sem categoria"}
          </span>
          <p className="text-xs mt-2">{new Date(post.published_at).toLocaleDateString("pt-BR")}</p>
        </div>
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold text-[#4072b0] dark:text-[#6b91c1] mb-2 hover:text-[#3d649e] transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">{post.excerpt}</p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <img
              src={post.author?.avatar_url || "/placeholder.svg?height=100&width=100&query=profile"}
              alt={post.author?.name || "Autor"}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">{post.author?.name || "Autor"}</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">{post.read_time} de leitura</span>
        </div>
      </div>
    </div>
  )
}
