import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function BlogNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f1ef]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#4b7bb5] mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Página do blog não encontrada</h2>
        <p className="text-gray-600 mb-8">A página do blog que você está procurando não existe ou foi movida.</p>
        <Link href="/blog">
          <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o blog
          </Button>
        </Link>
      </div>
    </div>
  )
}
