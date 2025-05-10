import { PageHeader } from "@/components/layout/page-header"
import { ClientList } from "@/components/clients/client-list"
import { ClientFilters } from "@/components/clients/client-filters"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function ClientsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Clientes" description="Gerencie seus clientes e acompanhe interações" />
        <Link href="/clientes/novo">
          <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </Link>
      </div>

      <ClientFilters />
      <ClientList />
    </div>
  )
}
