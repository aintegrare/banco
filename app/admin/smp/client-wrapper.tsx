"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

// Importar o componente dinamicamente com SSR desativado
const SocialMediaPlatformClient = dynamic(
  () => import("@/components/smp/social-media-platform-client").then((mod) => mod.SocialMediaPlatformClient),
  {
    ssr: false,
    loading: () => (
      <div className="p-8 space-y-4">
        <Skeleton className="h-12 w-[250px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-[200px] rounded-md" />
          <Skeleton className="h-[200px] rounded-md" />
          <Skeleton className="h-[200px] rounded-md" />
        </div>
        <Skeleton className="h-[400px] rounded-md" />
      </div>
    ),
  },
)

export function SMPClientWrapper() {
  return (
    <div className="container-fluid p-0">
      <SocialMediaPlatformClient />
    </div>
  )
}
