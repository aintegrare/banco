"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, BarChart2, FileText, Users } from "lucide-react"
import { useState } from "react"

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulação de login
    setIsLoggedIn(true)
  }

  if (!isLoggedIn) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#3d649e]">Portal Admin</CardTitle>
            <CardDescription>Faça login para acessar o painel administrativo</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={loginData.email}
                  onChange={handleLoginChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Sua senha"
                  required
                  value={loginData.password}
                  onChange={handleLoginChange}
                />
              </div>
              <Button type="submit" className="w-full bg-[#4b7bb5] hover:bg-[#3d649e]">
                Entrar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 md:px-6">
      <h1 className="mb-8 text-3xl font-bold text-[#3d649e]">Painel Administrativo</h1>

      <Tabs defaultValue="dashboard">
        <TabsList className="mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
          <TabsTrigger value="mensagens">Mensagens</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total de Visitas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,543</div>
                <p className="text-xs text-green-500">+12.5% em relação ao mês anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Novos Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">243</div>
                <p className="text-xs text-green-500">+18.2% em relação ao mês anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Posts no Blog</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">56</div>
                <p className="text-xs text-gray-500">+3 novos posts este mês</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Projetos no Portfólio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-gray-500">+2 novos projetos este mês</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#3d649e]">Visitas por Página</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full bg-gray-100 flex items-center justify-center">
                  <BarChart2 className="h-12 w-12 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-[#3d649e]">Leads por Fonte</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full bg-gray-100 flex items-center justify-center">
                  <BarChart2 className="h-12 w-12 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#3d649e]">Atividades Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 border-b pb-4">
                    <div className="rounded-full bg-[#4b7bb5]/10 p-2">
                      <FileText className="h-5 w-5 text-[#4b7bb5]" />
                    </div>
                    <div>
                      <p className="font-medium">Novo post publicado</p>
                      <p className="text-sm text-gray-500">Como criar uma estratégia de marketing digital eficaz</p>
                    </div>
                    <div className="ml-auto text-sm text-gray-500">Há 2 horas</div>
                  </div>
                  <div className="flex items-center gap-4 border-b pb-4">
                    <div className="rounded-full bg-[#4b7bb5]/10 p-2">
                      <Users className="h-5 w-5 text-[#4b7bb5]" />
                    </div>
                    <div>
                      <p className="font-medium">Novo lead cadastrado</p>
                      <p className="text-sm text-gray-500">João Silva - TechSolutions</p>
                    </div>
                    <div className="ml-auto text-sm text-gray-500">Há 5 horas</div>
                  </div>
                  <div className="flex items-center gap-4 border-b pb-4">
                    <div className="rounded-full bg-[#4b7bb5]/10 p-2">
                      <FileText className="h-5 w-5 text-[#4b7bb5]" />
                    </div>
                    <div>
                      <p className="font-medium">Projeto adicionado ao portfólio</p>
                      <p className="text-sm text-gray-500">Campanha Digital para Empresa de Tecnologia</p>
                    </div>
                    <div className="ml-auto text-sm text-gray-500">Há 1 dia</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blog">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#3d649e]">Gerenciar Posts do Blog</CardTitle>
              <CardDescription>Crie, edite e gerencie os posts do blog da Integrare</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-between">
                <Input className="max-w-sm" placeholder="Buscar posts..." />
                <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]">Novo Post</Button>
              </div>

              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-4 border-b bg-muted p-4 font-medium">
                  <div className="col-span-6">Título</div>
                  <div className="col-span-2">Categoria</div>
                  <div className="col-span-2">Data</div>
                  <div className="col-span-2">Ações</div>
                </div>
                <div className="grid grid-cols-12 gap-4 border-b p-4">
                  <div className="col-span-6">Como criar uma estratégia de marketing digital eficaz</div>
                  <div className="col-span-2">Marketing Digital</div>
                  <div className="col-span-2">10/05/2023</div>
                  <div className="col-span-2 flex gap-2">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500">
                      Excluir
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-4 border-b p-4">
                  <div className="col-span-6">O poder das redes sociais para pequenas empresas</div>
                  <div className="col-span-2">Social Media</div>
                  <div className="col-span-2">25/04/2023</div>
                  <div className="col-span-2 flex gap-2">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500">
                      Excluir
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-4 border-b p-4">
                  <div className="col-span-6">Análise de dados: transformando números em insights</div>
                  <div className="col-span-2">Análise de Dados</div>
                  <div className="col-span-2">15/04/2023</div>
                  <div className="col-span-2 flex gap-2">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500">
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#3d649e]">Gerenciar Projetos do Portfólio</CardTitle>
              <CardDescription>Adicione, edite e gerencie os projetos do portfólio da Integrare</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-between">
                <Input className="max-w-sm" placeholder="Buscar projetos..." />
                <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]">Novo Projeto</Button>
              </div>

              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-4 border-b bg-muted p-4 font-medium">
                  <div className="col-span-5">Título</div>
                  <div className="col-span-2">Categoria</div>
                  <div className="col-span-2">Cliente</div>
                  <div className="col-span-1">Ano</div>
                  <div className="col-span-2">Ações</div>
                </div>
                <div className="grid grid-cols-12 gap-4 border-b p-4">
                  <div className="col-span-5">Campanha Digital para Empresa de Tecnologia</div>
                  <div className="col-span-2">Marketing Digital</div>
                  <div className="col-span-2">TechSolutions</div>
                  <div className="col-span-1">2023</div>
                  <div className="col-span-2 flex gap-2">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500">
                      Excluir
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-4 border-b p-4">
                  <div className="col-span-5">Rebranding para Rede de Restaurantes</div>
                  <div className="col-span-2">Design Gráfico</div>
                  <div className="col-span-2">Sabor & Cia</div>
                  <div className="col-span-1">2022</div>
                  <div className="col-span-2 flex gap-2">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500">
                      Excluir
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-4 border-b p-4">
                  <div className="col-span-5">Estratégia de Conteúdo para E-commerce</div>
                  <div className="col-span-2">Criação de Conteúdo</div>
                  <div className="col-span-2">ModaStore</div>
                  <div className="col-span-1">2023</div>
                  <div className="col-span-2 flex gap-2">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500">
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mensagens">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#3d649e]">Mensagens de Contato</CardTitle>
              <CardDescription>Visualize e gerencie as mensagens recebidas pelo formulário de contato</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input className="max-w-sm" placeholder="Buscar mensagens..." />
              </div>

              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-4 border-b bg-muted p-4 font-medium">
                  <div className="col-span-3">Nome</div>
                  <div className="col-span-3">Email</div>
                  <div className="col-span-3">Assunto</div>
                  <div className="col-span-2">Data</div>
                  <div className="col-span-1">Status</div>
                </div>
                <div className="grid grid-cols-12 gap-4 border-b p-4">
                  <div className="col-span-3">João Silva</div>
                  <div className="col-span-3">joao@empresa.com</div>
                  <div className="col-span-3">Orçamento para campanha digital</div>
                  <div className="col-span-2">10/05/2023</div>
                  <div className="col-span-1">
                    <span className="inline-block rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                      Pendente
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-4 border-b p-4">
                  <div className="col-span-3">Maria Santos</div>
                  <div className="col-span-3">maria@empresa.com</div>
                  <div className="col-span-3">Dúvida sobre serviços</div>
                  <div className="col-span-2">08/05/2023</div>
                  <div className="col-span-1">
                    <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      Respondido
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-4 border-b p-4">
                  <div className="col-span-3">Carlos Oliveira</div>
                  <div className="col-span-3">carlos@empresa.com</div>
                  <div className="col-span-3">Proposta de parceria</div>
                  <div className="col-span-2">05/05/2023</div>
                  <div className="col-span-1">
                    <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      Respondido
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
