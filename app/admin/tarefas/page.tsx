import { TaskList } from "@/components/tasks/task-list"
import { TaskStats } from "@/components/dashboard/task-stats"

export default function TasksPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
