import { SearchInterface } from "@/components/search-interface"
import Link from "next/link"
import { Settings } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f2f1ef] flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-end mb-4">
          <Link href="/admin" className="flex items-center text-sm text-[#4b7bb5] hover:text-[#3d649e]">
            <Settings className="h-4 w-4 mr-1" />
            Painel Admin
          </Link>
        </div>

        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl font-bold text-[#4072b0] mb-2">Integrare Search</h1>
          <p className="text-[#527eb7] max-w-2xl mx-auto">
            Busca inteligente em conteúdos selecionados, potencializada por IA
          </p>
        </div>

        <SearchInterface />
      </div>

      <footer className="bg-[#4b7bb5] text-white py-6 text-center">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Integrare. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  )
}
