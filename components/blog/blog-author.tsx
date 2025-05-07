interface Author {
  name: string
  avatar: string
  bio: string
}

interface BlogAuthorProps {
  author: Author
}

export function BlogAuthor({ author }: BlogAuthorProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
      <div className="flex items-start space-x-4">
        <img src={author.avatar || "/placeholder.svg"} alt={author.name} className="w-16 h-16 rounded-full" />
        <div>
          <h3 className="text-lg font-bold text-[#4072b0] mb-1">{author.name}</h3>
          <p className="text-gray-600 text-sm">{author.bio}</p>
        </div>
      </div>
    </div>
  )
}
