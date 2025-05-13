import Link from "next/link"

// Categorias de exemplo
const categories = [
  { id: "1", name: "Marketing Digital", count: 12 },
  { id: "2", name: "SEO", count: 8 },
  { id: "3", name: "Redes Sociais", count: 15 },
  { id: "4", name: "E-mail Marketing", count: 6 },
  { id: "5", name: "Análise de Dados", count: 9 },
  { id: "6", name: "Tendências", count: 7 },
]

export function BlogCategories() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-bold text-[#4072b0] mb-4">Categorias</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/blog/categoria/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
            className="flex items-center justify-between py-2 border-b border-gray-100 hover:text-[#3d649e]"
          >
            <span className="text-[#4b7bb5]">{category.name}</span>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{category.count}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
