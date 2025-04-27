import { Suspense } from "react"
import { ContactList } from "@/components/contact-list"
import { ContactForm } from "@/components/contact-form"
import { SearchBar } from "@/components/search-bar"
import { CategoryFilter } from "@/components/category-filter"
import { Loader2 } from "lucide-react"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="bg-primary rounded-lg p-6 mb-6 shadow-md">
        <h1 className="text-3xl font-bold text-primary-foreground">Banco de Contatos</h1>
        <p className="text-primary-foreground/80 mt-2">Gerencie seus contatos de forma simples e eficiente</p>
      </div>
      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div>
          <SearchBar />
          <CategoryFilter />
          <Suspense
            fallback={
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <ContactList />
          </Suspense>
        </div>
        <div>
          <ContactForm />
        </div>
      </div>
    </main>
  )
}
