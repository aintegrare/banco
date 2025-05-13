import Link from "next/link"

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
  id: number
  title: string
  slug: string
  excerpt: string
  featured_image: string
  author: Author
  category: Category
  published_at: string
  readTime?: string
}

interface BlogPostCardProps {
  post: BlogPost
  variant?: "default" | "compact" | "horizontal"
  className?: string
}

export function BlogPostCard({ post, variant = "default", className = "" }: BlogPostCardProps) {
  // Formatar a data de publicação
  const publishDate = post.published_at ? new Date(post.published_at) : new Date()
  const formattedDate = publishDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  // Calcular tempo de leitura se não for fornecido
  const readTime = post.readTime || `${Math.ceil(post.excerpt.length / 600)} min`

  if (variant === "compact") {
    return (
      <div className={`group ${className}`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
            <img
              src={post.featured_image || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div>
            <Link
              href={`/blog/${post.slug}`}
              className="text-sm font-medium text-[#4b7bb5] hover:text-[#3d649e] line-clamp-2 group-hover:underline"
            >
              {post.title}
            </Link>
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <span>{readTime} de leitura</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === "horizontal") {
    return (
      <div className={`bg-white rounded-lg shadow-sm overflow-hidden group ${className}`}>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
            <img
              src={post.featured_image || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3">
              <span className="inline-block px-3 py-1 bg-[#4b7bb5] text-white text-xs rounded-md">
                {post.category?.name || "Sem categoria"}
              </span>
            </div>
          </div>

          <div className="md:w-2/3 p-6 flex flex-col">
            <div className="flex-grow">
              <Link href={`/blog/${post.slug}`}>
                <h3 className="text-xl font-bold text-[#4072b0] mb-2 group-hover:text-[#3d649e] line-clamp-2">
                  {post.title}
                </h3>
              </Link>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <img
                  src={post.author?.avatar_url || "/placeholder.svg"}
                  alt={post.author?.name || "Autor"}
                  className="w-8 h-8 rounded-full mr-2 object-cover"
                />
                <div>
                  <span className="text-sm font-medium">{post.author?.name || "Autor desconhecido"}</span>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>
                      {formattedDate.split(" de ")[0]} {formattedDate.split(" de ")[1]?.substring(0, 3)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="text-[#4b7bb5] hover:text-[#3d649e] text-sm font-medium flex items-center"
              >
                Ler mais
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full group ${className}`}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.featured_image || "/placeholder.svg"}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-block px-3 py-1 bg-[#4b7bb5] text-white text-xs rounded-md">
            {post.category?.name || "Sem categoria"}
          </span>
        </div>
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <span>
            {formattedDate.split(" de ")[0]} {formattedDate.split(" de ")[1]?.substring(0, 3)},{" "}
            {formattedDate.split(" de ")[2]}
          </span>
          <span className="mx-2">•</span>
          <span>{readTime}</span>
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold text-[#4072b0] mb-3 group-hover:text-[#3d649e] line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={post.author?.avatar_url || "/placeholder.svg"}
              alt={post.author?.name || "Autor"}
              className="w-8 h-8 rounded-full mr-2 object-cover"
            />
            <span className="text-sm text-gray-700">{post.author?.name || "Autor desconhecido"}</span>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="text-[#4b7bb5] hover:text-[#3d649e] text-sm font-medium flex items-center"
          >
            Ler mais
          </Link>
        </div>
      </div>
    </div>
  )
}
