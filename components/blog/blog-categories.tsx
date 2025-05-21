import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

interface Category {
  id: string
  name: string
  slug: string
  post_count?: number
}

async function getCategories(): Promise<Category[]> {
  try {
    const supabase = createClient()

    // Buscar categorias e contar posts
    const { data, error } = await supabase
      .from("blog_categories")
      .select(`
        id,
        name,
        slug,
        blog_posts!inner(id)
      `)
      .eq("blog_posts.published", true)

    if (error) {
      console.error("Erro ao buscar categorias:", error)
      return []
    }

    // Processar os dados para contar posts por categoria
    const categoriesWithCount = data.map((category) => {
      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        post_count: Array.isArray(category.blog_posts) ? category.blog_posts.length : 0,
      }
    })

    return categoriesWithCount
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
    return []
  }
}

export async function BlogCategories() {
  const categories = await getCategories()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-bold text-[#4072b0] dark:text-[#6b91c1] mb-4">Categorias</h3>
      <div className="space-y-2">
        {categories.length > 0 ? (
          categories.map((category) => (
            <Link
              key={category.id}
              href={`/blog/categoria/${category.slug}`}
              className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            >
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#4b7bb5] dark:group-hover:text-[#6b91c1] transition-colors">
                {category.name}
              </span>
              <span className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                {category.post_count || 0}
              </span>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-2">Nenhuma categoria encontrada</p>
        )}
      </div>
    </div>
  )
}
