import { KanbanBoard } from "@/components/kanban/kanban-board"
import { createClient } from "@/lib/supabase/server"

export default async function ProjectKanbanPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Verificar se o ID é numérico
  let projectId: number | undefined

  if (!isNaN(Number(params.id))) {
    projectId = Number(params.id)
  } else {
    // Se não for numérico, buscar o projeto pelo nome/slug
    const possibleName = params.id.replace(/-/g, " ")
    const { data: projectByName } = await supabase
      .from("projects")
      .select("id")
      .ilike("name", `%${possibleName}%`)
      .limit(1)
      .single()

    if (projectByName) {
      projectId = projectByName.id
    }
  }

  if (!projectId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">Projeto não encontrado</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <KanbanBoard projectId={projectId} />
    </div>
  )
}
