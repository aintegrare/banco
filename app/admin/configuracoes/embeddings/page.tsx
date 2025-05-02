import type { Metadata } from "next"
import { EmbeddingsConfig } from "@/components/admin/embeddings-config"

export const metadata: Metadata = {
  title: "Configuração de Embeddings | Integrare Admin",
  description: "Configure os provedores de embeddings para o sistema de busca semântica",
}

export default function EmbeddingsConfigPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold text-[#4072b0] mb-6">Configuração de Embeddings</h1>
      <EmbeddingsConfig />
    </div>
  )
}
