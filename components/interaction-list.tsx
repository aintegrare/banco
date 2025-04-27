import { Card, CardContent } from "@/components/ui/card"
import type { Interaction } from "@/app/actions"

interface InteractionListProps {
  interactions: Interaction[]
}

export function InteractionList({ interactions }: InteractionListProps) {
  if (interactions.length === 0) {
    return (
      <Card className="border-primary/20">
        <CardContent className="p-6 text-center text-muted-foreground">
          Nenhuma interação registrada com este contato.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {interactions.map((interaction) => (
        <Card key={interaction.id} className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="font-medium text-primary-700">{interaction.type}</div>
              <div className="text-sm text-muted-foreground">{formatDate(interaction.date)}</div>
            </div>
            {interaction.notes && <div className="mt-2 text-sm">{interaction.notes}</div>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Função auxiliar para formatar data
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}
