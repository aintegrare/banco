"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { CrmClientsList } from "@/components/crm/clients-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ClientDialog } from "@/components/crm/client-dialog"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function CrmPage() {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSaveClient = async (clientData: any) => {
    try {
      const response = await fetch("/api/crm/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientData),
      })

      if (!response.ok) {
        throw new Error("Erro ao criar cliente")
      }

      const savedClient = await response.json()

      toast({
        title: "Cliente criado",
        description: `Cliente ${savedClient.name} foi criado com sucesso.`,
      })

      router.refresh()
    } catch (error) {
      console.error("Error creating client:", error)
      toast({
        title: "Erro",
        description: "Não foi possível criar o cliente",
        variant: "destructive",
      })
      throw error
    }
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="CRM"
        description="Gerencie seus clientes e interações"
        actions={
          <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        }
      />

      <div className="p-4">
        <CrmClientsList />
      </div>

      <ClientDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSave={handleSaveClient} />
    </div>
  )
}
