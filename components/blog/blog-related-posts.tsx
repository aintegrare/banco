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
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-bold text-[#4072b0] mb-4">Posts Relacionados</h3>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
              <img
                src={post.featured_image || "/placeholder.svg?height=100&width=100&query=blog"}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <Link
                href={`/blog/${post.slug}`}
                className="text-sm font-medium text-[#4b7bb5] hover:text-[#3d649e] line-clamp-2"
              >
                {post.title}
              </Link>
              <p className="text-xs text-gray-500 mt-1">{post.read_time || "5 min"} de leitura</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
