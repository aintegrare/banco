"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  LinkIcon,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  User,
  Phone,
  Mail,
  Building,
  Search,
  Calendar,
  Clock,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { usePortalLinks, usePortalTasks, usePortalContacts } from "@/hooks/use-portal-data"

export default function PortalPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, signOut } = useAuth()

  // Redirecionamento se não estiver autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Hooks para dados do portal
  const { links, isLoading: linksLoading, addLink, deleteLink } = usePortalLinks()

  const { tasks, isLoading: tasksLoading, addTask, toggleTaskCompletion, deleteTask } = usePortalTasks()

  const { contacts, isLoading: contactsLoading, addContact, deleteContact } = usePortalContacts()

  // Estados locais para formulários e pesquisa
  const [newLink, setNewLink] = useState({ title: "", url: "", category: "" })
  const [newTask, setNewTask] = useState({ title: "", due_date: "", priority: "medium" as const })
  const [newContact, setNewContact] = useState({ name: "", email: "", phone: "", company: "", notes: "" })
  const [searchLinks, setSearchLinks] = useState("")
  const [searchTasks, setSearchTasks] = useState("")
  const [searchContacts, setSearchContacts] = useState("")

  // Funções para links
  const handleAddLink = async () => {
    if (newLink.title && newLink.url) {
      await addLink(newLink)
      setNewLink({ title: "", url: "", category: "" })
    }
  }

  const handleDeleteLink = async (id: string) => {
    await deleteLink(id)
  }

  const filteredLinks = links.filter(
    (link) =>
      link.title.toLowerCase().includes(searchLinks.toLowerCase()) ||
      link.url.toLowerCase().includes(searchLinks.toLowerCase()) ||
      (link.category && link.category.toLowerCase().includes(searchLinks.toLowerCase())),
  )

  // Funções para tarefas
  const handleAddTask = async () => {
    if (newTask.title) {
      await addTask({
        title: newTask.title,
        completed: false,
        due_date: newTask.due_date || null,
        priority: newTask.priority,
      })
      setNewTask({ title: "", due_date: "", priority: "medium" })
    }
  }

  const handleToggleTaskCompletion = async (id: string, completed: boolean) => {
    await toggleTaskCompletion(id, !completed)
  }

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id)
  }

  const filteredTasks = tasks.filter((task) => task.title.toLowerCase().includes(searchTasks.toLowerCase()))

  // Funções para contatos
  const handleAddContact = async () => {
    if (newContact.name && newContact.email) {
      await addContact(newContact)
      setNewContact({ name: "", email: "", phone: "", company: "", notes: "" })
    }
  }

  const handleDeleteContact = async (id: string) => {
    await deleteContact(id)
  }

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchContacts.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchContacts.toLowerCase()) ||
      (contact.company && contact.company.toLowerCase().includes(searchContacts.toLowerCase())),
  )

  // Função para prioridade
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  if (authLoading) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  if (!user) {
    return null // Redirecionamento já está sendo tratado no useEffect
  }

  return (
    <div className="container px-4 py-12 md:px-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#2c3e50] mb-2">Portal Pessoal</h1>
          <p className="text-gray-600">Gerencie seus links, tarefas e contatos em um só lugar</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2" onClick={() => signOut()}>
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>

      <Tabs defaultValue="links" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          <TabsTrigger value="contacts">Contatos</TabsTrigger>
        </TabsList>

        {/* Links Tab */}
        <TabsContent value="links">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Meus Links</CardTitle>
                <CardDescription>Gerencie seus links favoritos</CardDescription>
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Buscar links..."
                      value={searchLinks}
                      onChange={(e) => setSearchLinks(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {linksLoading ? (
                  <div className="text-center py-4">Carregando links...</div>
                ) : (
                  <div className="space-y-4">
                    {filteredLinks.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">Nenhum link encontrado</p>
                    ) : (
                      filteredLinks.map((link) => (
                        <div
                          key={link.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="rounded-full bg-[#f2f1ef] p-2">
                              <LinkIcon className="h-4 w-4 text-[#3d649e]" />
                            </div>
                            <div>
                              <h3 className="font-medium">{link.title}</h3>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-[#4b7bb5] hover:underline"
                              >
                                {link.url}
                              </a>
                              {link.category && (
                                <span className="ml-2 inline-block rounded-full bg-[#f2f1ef] px-2 py-0.5 text-xs text-[#3d649e]">
                                  {link.category}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteLink(link.id)}>
                            <Trash2 className="h-4 w-4 text-gray-500" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Adicionar Novo Link</CardTitle>
                <CardDescription>Salve links importantes para acesso rápido</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={newLink.title}
                      onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                      placeholder="Google"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      value={newLink.url}
                      onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                      placeholder="https://google.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria (opcional)</Label>
                    <Input
                      id="category"
                      value={newLink.category}
                      onChange={(e) => setNewLink({ ...newLink, category: e.target.value })}
                      placeholder="Pesquisa"
                    />
                  </div>
                  <Button
                    className="w-full bg-[#3d649e] hover:bg-[#4b7bb5]"
                    onClick={handleAddLink}
                    disabled={!newLink.title || !newLink.url}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Adicionar Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Minhas Tarefas</CardTitle>
                <CardDescription>Gerencie suas tarefas diárias</CardDescription>
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Buscar tarefas..."
                      value={searchTasks}
                      onChange={(e) => setSearchTasks(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {tasksLoading ? (
                  <div className="text-center py-4">Carregando tarefas...</div>
                ) : (
                  <div className="space-y-4">
                    {filteredTasks.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">Nenhuma tarefa encontrada</p>
                    ) : (
                      filteredTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="cursor-pointer"
                              onClick={() => handleToggleTaskCompletion(task.id, task.completed)}
                            >
                              {task.completed ? (
                                <CheckCircle2 className="h-5 w-5 text-[#3d649e]" />
                              ) : (
                                <Circle className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <h3 className={`font-medium ${task.completed ? "line-through text-gray-400" : ""}`}>
                                {task.title}
                              </h3>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                {task.due_date && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(task.due_date).toLocaleDateString()}
                                  </span>
                                )}
                                <span className={`flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                                  <Clock className="h-3 w-3" />
                                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
                            <Trash2 className="h-4 w-4 text-gray-500" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Adicionar Nova Tarefa</CardTitle>
                <CardDescription>Crie tarefas para organizar seu trabalho</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="taskTitle">Título da Tarefa</Label>
                    <Input
                      id="taskTitle"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="Preparar apresentação"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Data de Vencimento (opcional)</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.due_date}
                      onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade</Label>
                    <select
                      id="priority"
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({ ...newTask, priority: e.target.value as "low" | "medium" | "high" })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>
                  <Button
                    className="w-full bg-[#3d649e] hover:bg-[#4b7bb5]"
                    onClick={handleAddTask}
                    disabled={!newTask.title}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Adicionar Tarefa
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contacts Tab */}
        <TabsContent value="contacts">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Meus Contatos</CardTitle>
                <CardDescription>Gerencie seus contatos importantes</CardDescription>
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Buscar contatos..."
                      value={searchContacts}
                      onChange={(e) => setSearchContacts(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {contactsLoading ? (
                  <div className="text-center py-4">Carregando contatos...</div>
                ) : (
                  <div className="space-y-4">
                    {filteredContacts.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">Nenhum contato encontrado</p>
                    ) : (
                      filteredContacts.map((contact) => (
                        <div key={contact.id} className="p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="rounded-full bg-[#f2f1ef] p-2">
                                <User className="h-4 w-4 text-[#3d649e]" />
                              </div>
                              <h3 className="font-medium">{contact.name}</h3>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteContact(contact.id)}>
                              <Trash2 className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                          <div className="ml-9 space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3 text-gray-500" />
                              <span>{contact.email}</span>
                            </div>
                            {contact.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3 text-gray-500" />
                                <span>{contact.phone}</span>
                              </div>
                            )}
                            {contact.company && (
                              <div className="flex items-center gap-2">
                                <Building className="h-3 w-3 text-gray-500" />
                                <span>{contact.company}</span>
                              </div>
                            )}
                            {contact.notes && <div className="mt-2 text-gray-600 italic">"{contact.notes}"</div>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Adicionar Novo Contato</CardTitle>
                <CardDescription>Salve informações de contatos importantes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      placeholder="João Silva"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newContact.email}
                      onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                      placeholder="joao@empresa.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone (opcional)</Label>
                    <Input
                      id="phone"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                      placeholder="(11) 98765-4321"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa (opcional)</Label>
                    <Input
                      id="company"
                      value={newContact.company}
                      onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                      placeholder="Empresa ABC"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Observações (opcional)</Label>
                    <Textarea
                      id="notes"
                      value={newContact.notes}
                      onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                      placeholder="Informações adicionais sobre o contato"
                      rows={3}
                    />
                  </div>
                  <Button
                    className="w-full bg-[#3d649e] hover:bg-[#4b7bb5]"
                    onClick={handleAddContact}
                    disabled={!newContact.name || !newContact.email}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Adicionar Contato
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
