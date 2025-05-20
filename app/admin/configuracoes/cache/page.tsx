import { BunnyCacheManager } from "@/components/admin/bunny-cache-manager"
import { PageHeader } from "@/components/page-header"

export default function BunnyCachePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações de Cache"
        description="Gerencie as configurações de cache do Bunny CDN para otimizar a entrega de conteúdo"
      />

      <BunnyCacheManager />
    </div>
  )
}
