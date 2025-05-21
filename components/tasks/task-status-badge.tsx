import { Badge } from "@/components/ui/badge"
import { Clock, ListTodo, PlayCircle, CheckCircle2, AlertCircle, type LucideIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Configuração centralizada para status
export const STATUS_CONFIG: Record<
  string,
  {
    label: string
    description: string
    color: string
    bgColor: string
    icon: LucideIcon
    borderColor: string
  }
> = {
  backlog: {
    label: "Backlog",
    description: "Tarefas planejadas para o futuro que ainda não estão prontas para serem iniciadas",
    color: "text-gray-700",
    bgColor: "bg-gray-200",
    borderColor: "border-gray-300",
    icon: Clock,
  },
  todo: {
    label: "A Fazer",
    description: "Tarefas prontas para serem iniciadas e que devem ser feitas em breve",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-300",
    icon: ListTodo,
  },
  "in-progress": {
    label: "Em Progresso",
    description: "Tarefas que estão sendo trabalhadas ativamente no momento",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-300",
    icon: PlayCircle,
  },
  review: {
    label: "Em Revisão",
    description: "Tarefas concluídas que estão aguardando revisão ou aprovação",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-300",
    icon: AlertCircle,
  },
  done: {
    label: "Concluído",
    description: "Tarefas que foram concluídas e aprovadas",
    color: "text-green-700",
    bgColor: "bg-green-100",
    borderColor: "border-green-300",
    icon: CheckCircle2,
  },
}

interface TaskStatusBadgeProps {
  status: string
  showTooltip?: boolean
  size?: "sm" | "md" | "lg"
}

export function TaskStatusBadge({ status, showTooltip = true, size = "md" }: TaskStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.todo
  const Icon = config.icon

  const sizeClasses = {
    sm: "text-xs py-0.5 px-1.5",
    md: "text-sm py-1 px-2",
    lg: "text-base py-1.5 px-3",
  }

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  }

  const badge = (
    <Badge
      className={`${config.bgColor} ${config.color} font-medium border ${config.borderColor} ${sizeClasses[size]} flex items-center gap-1`}
    >
      <Icon size={iconSizes[size]} className="shrink-0" />
      <span>{config.label}</span>
    </Badge>
  )

  if (!showTooltip) return badge

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>
          <p>{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface KanbanColumnHeaderProps {
  status: string
  count: number
}

export function KanbanColumnHeader({ status, count }: KanbanColumnHeaderProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.todo
  const Icon = config.icon

  return (
    <div
      className={`p-3 font-medium ${config.color} border-b ${config.borderColor} ${config.bgColor} rounded-t-lg flex justify-between items-center`}
    >
      <div className="flex items-center gap-2">
        <Icon size={16} className="shrink-0" />
        <span>{config.label}</span>
      </div>
      <Badge variant="secondary" className="bg-white text-gray-600">
        {count}
      </Badge>
    </div>
  )
}
