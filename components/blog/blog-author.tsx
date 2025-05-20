interface AuthorProps {
  id: number
  name: string
  avatar_url: string
  bio?: string
}

export function BlogAuthor({ author }: { author: AuthorProps }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-[#4072b0] mb-4 border-b border-gray-100 pb-2">Sobre o Autor</h3>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <img
          src={author.avatar_url || "/placeholder.svg?height=100&width=100&query=profile"}
          alt={author.name}
          className="w-20 h-20 rounded-full object-cover border-2 border-[#4b7bb5]/20"
        />
        <div>
          <h4 className="text-lg font-bold text-[#4072b0] mb-1 text-center sm:text-left">{author.name}</h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            {author.bio ||
              "Autor do blog da Integrare, especialista em marketing digital e estratégias de crescimento para empresas."}
          </p>
        </div>
      </div>
    </div>
  )
}
