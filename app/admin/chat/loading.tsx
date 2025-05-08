import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-80px)] bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#4b7bb5] mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Carregando chat</h3>
        <p className="text-gray-500 mt-1">Preparando o ambiente de conversa...</p>
      </div>
    </div>
  )
}
