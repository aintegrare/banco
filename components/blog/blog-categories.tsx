import Link from "next/link"

// Dados de exemplo para categorias
const categories = [
  { name: "Marketing Digital", slug: "marketing-digital", count: 12 },
  { name: "SEO", slug: "seo", count: 8 },
  { name: "Redes Sociais", slug: "redes-sociais", count: 10 },
  { name: "Análise de Dados", slug: "analise-de-dados", count: 6 },
  { name: "E-mail Marketing", slug: "email-marketing", count: 5 },
  { name: "Tendências", slug: "tendencias", count: 7 },
  { name: "Branding", slug: "branding", count: 4 },
  { name: "Conteúdo", slug: "conteudo", count: 9 },
]

export function BlogCategories() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-[#4072b0] mb-4">Categorias</h3>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.slug} className="group">
            <Link
              href={`/blog/categoria/${category.slug}`}
              className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-[#4b7bb5]/5 transition-colors group-hover:text-[#4b7bb5]"
            >
              <span className="text-gray-700 group-hover:text-[#4b7bb5] transition-colors">{category.name}</span>
              <span className="bg-[#4b7bb5]/10 text-[#4b7bb5] text-xs rounded-full px-2 py-1">{category.count}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link href="/blog/categorias" className="text-[#4b7bb5] hover:text-[#3d649e] text-sm font-medium">
          Ver todas as categorias
        </Link>
      </div>
    </div>
  )
}
