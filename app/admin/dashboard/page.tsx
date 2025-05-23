import { ProjectStats } from "@/components/dashboard/project-stats"
import { TaskDashboard } from "@/components/tasks/task-dashboard"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TaskDashboard />
        </div>

        <div>
          <ProjectStats />
        </div>
      </div>
    </div>
  )
}
