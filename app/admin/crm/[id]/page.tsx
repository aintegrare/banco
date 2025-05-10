import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash } from "lucide-react"
import Link from "next/link"
import { ClientDetails } from "@/components/crm/client-details"
import { ClientInteractions } from "@/components/crm/client-interactions"
import { ClientNotes } from "@/components/crm/client-notes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Suspense } from "react"
import { ClientDetailsSkeleton } from "@/components/crm/client-details-skeleton"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export const metadata = {
  title: "Detalhes do Cliente | CRM | Integrare Admin",
}

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const clientId = Number.parseInt(params.id)

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Detalhes do Cliente"
        description="Visualize e gerencie as informações do cliente"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/crm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button variant="destructive">
              <Trash className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        }
      />

      <div className="p-4 flex-1">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/crm">CRM</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/admin/crm/${clientId}`}>Cliente</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Suspense fallback={<ClientDetailsSkeleton />}>
          <ClientDetails clientId={clientId} />
        </Suspense>

        <Tabs defaultValue="interactions" className="mt-6">
          <TabsList className="w-full max-w-md grid grid-cols-2">
            <TabsTrigger value="interactions">Interações</TabsTrigger>
            <TabsTrigger value="notes">Notas</TabsTrigger>
          </TabsList>
          <TabsContent value="interactions" className="mt-4">
            <ClientInteractions clientId={clientId} />
          </TabsContent>
          <TabsContent value="notes" className="mt-4">
            <ClientNotes clientId={clientId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
