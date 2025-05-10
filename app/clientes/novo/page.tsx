import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewClientPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-2">
        <Link href="/clientes" className="text-[#4b7bb5] hover:text-[#3d649e] flex items-center">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Voltar para lista de clientes
        </Link>
      </div>

      <PageHeader title="Novo Cliente" description="Adicione um novo cliente ao sistema" />

      <div className="mt-6">
        <Card>
          <CardContent className="p-6">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome
                    </label>
                    <Input id="name" placeholder="Nome completo" />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      Empresa
                    </label>
                    <Input id="company" placeholder="Nome da empresa" />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="email@exemplo.com" />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <Input id="phone" placeholder="(00) 00000-0000" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Endereço
                    </label>
                    <Input id="address" placeholder="Endereço completo" />
                  </div>

                  <div>
                    <label htmlFor="segment" className="block text-sm font-medium text-gray-700 mb-1">
                      Segmento
                    </label>
                    <select
                      id="segment"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Selecione o segmento</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="saas">SaaS</option>
                      <option value="retail">Varejo</option>
                      <option value="education">Educação</option>
                      <option value="health">Saúde</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="lead">Lead</option>
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" asChild>
                  <Link href="/clientes">Cancelar</Link>
                </Button>
                <Button type="submit" className="bg-[#4b7bb5] hover:bg-[#3d649e]">
                  Salvar Cliente
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
