import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  slug: string
  coverImage: string
  category: string
  publishedAt: string
}

interface BlogRelatedPostsProps {
  posts: BlogPost[]
}

export function BlogRelatedPosts({ posts }: BlogRelatedPostsProps) {
  if (posts.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-bold text-[#4072b0] mb-4">Posts Relacionados</h3>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
              <img
                src={post.coverImage || "/placeholder.svg"}
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
              <p className="text-xs text-gray-500 mt-1">{post.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
