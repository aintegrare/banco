import { Suspense } from "react"
import { ContactList } from "@/components/contact-list"
import { ContactForm } from "@/components/contact-form"
import { SearchBar } from "@/components/search-bar"
import { Loader2 } from "lucide-react"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Banco de Contatos</h1>
      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div>
          <SearchBar />
          <Suspense
            fallback={
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
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
