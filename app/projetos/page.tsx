import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/layout/page-header"
import { ProjectsList } from "@/components/projects/projects-list"
import { PlusIcon } from "lucide-react"
import Link from "next/link"

export default function ProjectsPage() {
  return (
    <div className="container mx-auto">
      <PageHeader
        title="Projetos"
        description="Gerencie todos os seus projetos em um só lugar"
        actions={
          <Button asChild>
            <Link href="/projetos/novo">
              <PlusIcon className="mr-2 h-4 w-4" />
              Novo Projeto
            </Link>
          </Button>
        }
      />

      <div className="p-4 sm:p-6">
        <ProjectsList />
      </div>
    </div>
  )
}
