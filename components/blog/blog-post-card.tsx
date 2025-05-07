import Link from "next/link"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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

interface BlogPostCardProps {
  post: BlogPost
  variant?: "default" | "compact" | "horizontal"
  className?: string
}

export function BlogPostCard({ post, variant = "default", className }: BlogPostCardProps) {
  // Formatar a data de publicação
  const publishDate = new Date(post.publishedAt)
  const formattedDate = publishDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  if (variant === "compact") {
    return (
      <div className={cn("group", className)}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
            <img
              src={post.coverImage || "/placeholder.svg"}
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
              <Clock className="h-3 w-3 mr-1" />
              <span>{post.readTime} de leitura</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === "horizontal") {
    return (
      <div className={cn("bg-white rounded-lg shadow-sm overflow-hidden group", className)}>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
            <img
              src={post.coverImage || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3">
              <Badge className="bg-[#4b7bb5] hover:bg-[#3d649e]">{post.category}</Badge>
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
                  src={post.author.avatar || "/placeholder.svg"}
                  alt={post.author.name}
                  className="w-8 h-8 rounded-full mr-2 object-cover"
                />
                <div>
                  <span className="text-sm font-medium">{post.author.name}</span>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>
                      {formattedDate.split(" de ")[0]} {formattedDate.split(" de ")[1].substring(0, 3)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="text-[#4b7bb5] hover:text-[#3d649e] text-sm font-medium flex items-center"
              >
                Ler mais
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn("bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full group", className)}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.coverImage || "/placeholder.svg"}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-[#4b7bb5] hover:bg-[#3d649e]">{post.category}</Badge>
        </div>
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <Calendar className="h-3 w-3 mr-1" />
          <span>
            {formattedDate.split(" de ")[0]} {formattedDate.split(" de ")[1].substring(0, 3)},{" "}
            {formattedDate.split(" de ")[2]}
          </span>
          <span className="mx-2">•</span>
          <Clock className="h-3 w-3 mr-1" />
          <span>{post.readTime}</span>
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
              src={post.author.avatar || "/placeholder.svg"}
              alt={post.author.name}
              className="w-8 h-8 rounded-full mr-2 object-cover"
            />
            <span className="text-sm text-gray-700">{post.author.name}</span>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="text-[#4b7bb5] hover:text-[#3d649e] text-sm font-medium flex items-center"
          >
            Ler mais
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
