import { ProjectsList } from "@/components/projects/projects-list"
import { PageHeader } from "@/components/page-header"

export default function AdminProjetosPage() {
  return (
    <div className="container mx-auto py-8">
      <PageHeader title="Projetos" description="Gerencie todos os projetos da Integrare" />
      <div className="mt-6">
        <ProjectsList />
      </div>
    </div>
  )
}
