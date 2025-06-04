import { TaskList } from "@/components/tasks/task-list"
import { TaskStats } from "@/components/dashboard/task-stats"
import { PageHeader } from "@/components/page-header"

export default function AdminTasksPage() {
  return (
    <div className="container mx-auto py-8">
      <PageHeader title="Tarefas" description="Gerencie todas as tarefas da Integrare" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2">
          <TaskList />
        </div>
        <div>
          <TaskStats />
        </div>
      </div>
    </div>
  )
}
