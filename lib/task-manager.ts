// Dados simulados para tarefas
let tasks = [
  {
    id: 1,
    title: "Desenvolver landing page",
    description: "Criar uma landing page para o novo produto",
    status: "todo",
    priority: "high",
    projectId: 1,
    assigneeId: 2,
    createdAt: "2023-05-10T10:00:00Z",
    dueDate: "2023-05-20T18:00:00Z",
    comments: [
      {
        id: 1,
        content: "Já comecei a trabalhar no design",
        userId: 2,
        createdAt: "2023-05-11T14:30:00Z",
      },
    ],
    attachments: [
      {
        id: 1,
        name: "design-mockup.png",
        url: "/placeholder.svg?height=100&width=100",
        size: "2.4 MB",
        uploadedAt: "2023-05-11T15:00:00Z",
      },
    ],
  },
  {
    id: 2,
    title: "Otimizar SEO",
    description: "Melhorar o SEO do site principal",
    status: "in-progress",
    priority: "medium",
    projectId: 1,
    assigneeId: 3,
    createdAt: "2023-05-08T09:00:00Z",
    dueDate: "2023-05-18T18:00:00Z",
    comments: [],
    attachments: [],
  },
  {
    id: 3,
    title: "Criar campanha de email",
    description: "Desenvolver uma campanha de email para o lançamento",
    status: "review",
    priority: "high",
    projectId: 2,
    assigneeId: 4,
    createdAt: "2023-05-05T11:00:00Z",
    dueDate: "2023-05-15T18:00:00Z",
    comments: [],
    attachments: [],
  },
  {
    id: 4,
    title: "Analisar métricas",
    description: "Analisar as métricas da última campanha",
    status: "done",
    priority: "low",
    projectId: 2,
    assigneeId: 1,
    createdAt: "2023-05-01T10:00:00Z",
    dueDate: "2023-05-10T18:00:00Z",
    comments: [],
    attachments: [],
  },
  {
    id: 5,
    title: "Atualizar conteúdo do blog",
    description: "Revisar e atualizar os artigos do blog",
    status: "todo",
    priority: "medium",
    projectId: 3,
    assigneeId: 5,
    createdAt: "2023-05-12T14:00:00Z",
    dueDate: "2023-05-22T18:00:00Z",
    comments: [],
    attachments: [],
  },
]

// Dados simulados para projetos
const projects = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Redesenho completo do site corporativo",
    status: "in-progress",
    startDate: "2023-05-01T00:00:00Z",
    endDate: "2023-06-30T00:00:00Z",
    progress: 35,
    teamMembers: [1, 2, 3],
    color: "#4b7bb5",
  },
  {
    id: 2,
    name: "Campanha de Marketing Q2",
    description: "Campanha de marketing para o segundo trimestre",
    status: "in-progress",
    startDate: "2023-04-15T00:00:00Z",
    endDate: "2023-06-15T00:00:00Z",
    progress: 50,
    teamMembers: [1, 4, 5],
    color: "#6b91c1",
  },
  {
    id: 3,
    name: "Estratégia de Conteúdo",
    description: "Desenvolvimento de estratégia de conteúdo para o próximo ano",
    status: "planning",
    startDate: "2023-05-10T00:00:00Z",
    endDate: "2023-07-10T00:00:00Z",
    progress: 15,
    teamMembers: [5, 6],
    color: "#3d649e",
  },
]

// Dados simulados para usuários
const users = [
  {
    id: 1,
    name: "Ana Silva",
    email: "ana.silva@integrare.com",
    role: "Gerente de Projetos",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Carlos Oliveira",
    email: "carlos.oliveira@integrare.com",
    role: "Desenvolvedor Front-end",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Mariana Costa",
    email: "mariana.costa@integrare.com",
    role: "Especialista em SEO",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Rafael Santos",
    email: "rafael.santos@integrare.com",
    role: "Especialista em Marketing",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Juliana Lima",
    email: "juliana.lima@integrare.com",
    role: "Redatora",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    name: "Pedro Mendes",
    email: "pedro.mendes@integrare.com",
    role: "Estrategista de Conteúdo",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

// Funções para gerenciar tarefas
export function getAllTasks() {
  return [...tasks]
}

export function getTaskById(id: number) {
  return tasks.find((task) => task.id === id)
}

export function getTasksByProject(projectId: number) {
  return tasks.filter((task) => task.projectId === projectId)
}

export function getTasksByStatus(status: string) {
  return tasks.filter((task) => task.status === status)
}

export function createTask(task: any) {
  const newTask = {
    ...task,
    id: tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
    comments: [],
    attachments: [],
  }
  tasks.push(newTask)
  return newTask
}

export function updateTask(updatedTask: any) {
  const index = tasks.findIndex((task) => task.id === updatedTask.id)
  if (index !== -1) {
    // Preservar comentários e anexos existentes
    const existingTask = tasks[index]
    tasks[index] = {
      ...updatedTask,
      comments: existingTask.comments,
      attachments: existingTask.attachments,
    }
    return tasks[index]
  }
  return null
}

export function deleteTask(id: number) {
  const index = tasks.findIndex((task) => task.id === id)
  if (index !== -1) {
    const deletedTask = tasks[index]
    tasks = tasks.filter((task) => task.id !== id)
    return deletedTask
  }
  return null
}

export function updateTaskStatus(id: number, status: string) {
  const task = tasks.find((task) => task.id === id)
  if (task) {
    task.status = status
    return task
  }
  return null
}

export function addTaskComment(taskId: number, comment: any) {
  const task = tasks.find((task) => task.id === taskId)
  if (task) {
    const newComment = {
      ...comment,
      id: task.comments.length > 0 ? Math.max(...task.comments.map((c) => c.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
    }
    task.comments.push(newComment)
    return newComment
  }
  return null
}

export function addTaskAttachment(taskId: number, attachment: any) {
  const task = tasks.find((task) => task.id === taskId)
  if (task) {
    const newAttachment = {
      ...attachment,
      id: task.attachments.length > 0 ? Math.max(...task.attachments.map((a) => a.id)) + 1 : 1,
      uploadedAt: new Date().toISOString(),
    }
    task.attachments.push(newAttachment)
    return newAttachment
  }
  return null
}

// Funções para gerenciar projetos
export function getAllProjects() {
  return [...projects]
}

export function getProjectById(id: number) {
  return projects.find((project) => project.id === id)
}

// Funções para gerenciar usuários
export function getAllUsers() {
  return [...users]
}

export function getUserById(id: number) {
  return users.find((user) => user.id === id)
}
