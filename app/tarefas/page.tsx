import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/layout/page-header"
import { TaskBoard } from "@/components/tasks/task-board"
import { PlusIcon } from "lucide-react"
import Link from "next/link"

export default function TasksPage() {
  return (
    <div className="container mx-auto">
      <PageHeader
        title="Tarefas"
        description="Visualize e gerencie todas as suas tarefas"
        actions={
          <Button asChild>
            <Link href="/tarefas/nova">
              <PlusIcon className="mr-2 h-4 w-4" />
              Nova Tarefa
            </Link>
          </Button>
        }
      />

      <div className="p-4 sm:p-6">
        <TaskBoard />
      </div>
    </div>
  )
}
