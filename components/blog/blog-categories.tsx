import Link from "next/link"

export function BlogCategories() {
  // Categorias de exemplo - idealmente viriam do banco de dados
  const categories = [
    { name: "Marketing Digital", slug: "marketing-digital", count: 12 },
    { name: "SEO", slug: "seo", count: 8 },
    { name: "Redes Sociais", slug: "redes-sociais", count: 10 },
    { name: "E-commerce", slug: "e-commerce", count: 6 },
    { name: "Estratégia", slug: "estrategia", count: 9 },
    { name: "Análise de Dados", slug: "analise-de-dados", count: 5 },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-bold text-[#4072b0] dark:text-[#6b91c1] mb-4">Categorias</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/blog/categoria/${category.slug}`}
            className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
          >
            <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#4b7bb5] dark:group-hover:text-[#6b91c1] transition-colors">
              {category.name}
            </span>
            <span className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
              {category.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
