interface AuthorProps {
  id: number
  name: string
  avatar_url: string
  bio?: string
}

export function BlogAuthor({ author }: { author: AuthorProps }) {
  return (
    <div className="bg-white rounded-lg p-6 flex items-start space-x-4">
      <img
        src={author.avatar_url || "/placeholder.svg?height=100&width=100&query=profile"}
        alt={author.name}
        className="w-16 h-16 rounded-full"
      />
      <div>
        <h3 className="text-lg font-bold text-[#4072b0]">{author.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{author.bio || "Autor do blog da Integrare."}</p>
      </div>
    </div>
  )
}
