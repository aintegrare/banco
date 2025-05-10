import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Tag } from "lucide-react"

// Função para buscar categorias
async function getCategories() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("blog_categories").select("*").order("name")

    if (error) {
      console.error("Erro ao buscar categorias:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
    return []
  }
}

export async function BlogCategories() {
  const categories = await getCategories()

  // Categorias padrão caso não haja categorias no banco
  const defaultCategories = [
    { id: 1, name: "Marketing Digital", slug: "marketing-digital" },
    { id: 2, name: "SEO", slug: "seo" },
    { id: 3, name: "Redes Sociais", slug: "redes-sociais" },
    { id: 4, name: "Análise de Dados", slug: "analise-de-dados" },
    { id: 5, name: "E-mail Marketing", slug: "email-marketing" },
    { id: 6, name: "Tendências", slug: "tendencias" },
  ]

  const displayCategories = categories.length > 0 ? categories : defaultCategories

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-[#4072b0] mb-4 flex items-center border-b border-gray-100 pb-2">
        <Tag className="mr-2 h-5 w-5" />
        Categorias
      </h3>
      <div className="flex flex-wrap gap-2">
        {displayCategories.map((category) => (
          <Link
            key={category.id}
            href={`/blog/categoria/${category.slug}`}
            className="px-3 py-1.5 bg-[#4b7bb5]/10 text-[#4b7bb5] rounded-full text-sm hover:bg-[#4b7bb5]/20 transition-colors"
          >
            {category.name}
          </Link>
        ))}
        <Link
          href="/blog/categorias"
          className="px-3 py-1.5 bg-[#4b7bb5]/5 text-[#4b7bb5] rounded-full text-sm hover:bg-[#4b7bb5]/20 transition-colors border border-dashed border-[#4b7bb5]/30"
        >
          Ver todas
        </Link>
      </div>
    </div>
  )
}
