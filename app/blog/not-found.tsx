import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function BlogNotFound() {
  return (
    <div className="min-h-screen bg-[#f2f1ef] flex items-center justify-center">
      <div className="container max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-[#4072b0] mb-4">Post não encontrado</h1>
        <p className="text-gray-600 mb-8">
          O post que você está procurando não foi encontrado ou pode ter sido removido.
        </p>
        <Link href="/blog">
          <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o Blog
          </Button>
        </Link>
      </div>
    </div>
  )
}
