import { Suspense } from "react"
import { Shell } from "@/components/shell"
import { MainNav } from "@/components/main-nav"
import { Section } from "@/components/section"
import { ProjectsOverview } from "@/components/dashboard/projects-overview"
import { TasksOverview } from "@/components/dashboard/tasks-overview"
import { AdsOverview } from "@/components/dashboard/ads-overview"
import { ClientsOverview } from "@/components/dashboard/clients-overview"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { PerformanceMetrics } from "@/components/dashboard/performance-metrics"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  return (
    <Shell>
      <MainNav
        items={[
          {
            title: "Dashboard",
            href: "/admin/dashboard",
          },
        ]}
      />

      <div className="grid gap-6">
        <Section title="Visão Geral">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Suspense fallback={<Skeleton className="h-[120px] w-full" />}>
              <ProjectsOverview />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-[120px] w-full" />}>
              <TasksOverview />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-[120px] w-full" />}>
              <AdsOverview />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-[120px] w-full" />}>
              <ClientsOverview />
            </Suspense>
          </div>
        </Section>

        <div className="grid gap-6 md:grid-cols-2">
          <Section title="Atividades Recentes">
            <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
              <RecentActivity />
            </Suspense>
          </Section>

          <Section title="Métricas de Desempenho">
            <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
              <PerformanceMetrics />
            </Suspense>
          </Section>
        </div>
      </div>
    </Shell>
  )
}
