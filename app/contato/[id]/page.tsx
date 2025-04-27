import { Suspense } from "react"
import { getContact, getInteractions } from "@/app/actions"
import { ContactDetail } from "@/components/contact-detail"
import { InteractionList } from "@/components/interaction-list"
import { InteractionForm } from "@/components/interaction-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function ContactPage({ params }: { params: { id: string } }) {
  const contact = await getContact(params.id)

  if (!contact) {
    notFound()
  }

  const interactions = await getInteractions(params.id)

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="ghost" asChild className="text-primary hover:bg-primary/10 hover:text-primary-700">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para lista
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <ContactDetail contact={contact} />

          <div>
            <h2 className="text-xl font-semibold mb-4 text-primary-700">Histórico de Interações</h2>
            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-primary" />}>
              <InteractionList interactions={interactions} />
            </Suspense>
          </div>
        </div>

        <div>
          <InteractionForm contactId={params.id} />
        </div>
      </div>
    </main>
  )
}
