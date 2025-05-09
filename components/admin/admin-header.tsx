import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Calendar,
  BarChart3,
  MessageSquare,
  FolderKanban,
  Search,
  FileImage,
} from "lucide-react"

interface AdminHeaderProps {
  title: string
  description?: string
  icon?: string
}

export function AdminHeader({ title, description, icon }: AdminHeaderProps) {
  const getIcon = () => {
    switch (icon) {
      case "dashboard":
        return <LayoutDashboard className="h-8 w-8 text-[#4b7bb5]" />
      case "files":
        return <FileText className="h-8 w-8 text-[#4b7bb5]" />
      case "users":
        return <Users className="h-8 w-8 text-[#4b7bb5]" />
      case "settings":
        return <Settings className="h-8 w-8 text-[#4b7bb5]" />
      case "calendar":
        return <Calendar className="h-8 w-8 text-[#4b7bb5]" />
      case "stats":
        return <BarChart3 className="h-8 w-8 text-[#4b7bb5]" />
      case "chat":
        return <MessageSquare className="h-8 w-8 text-[#4b7bb5]" />
      case "projects":
        return <FolderKanban className="h-8 w-8 text-[#4b7bb5]" />
      case "search":
        return <Search className="h-8 w-8 text-[#4b7bb5]" />
      case "blog":
        return <FileImage className="h-8 w-8 text-[#4b7bb5]" />
      default:
        return <LayoutDashboard className="h-8 w-8 text-[#4b7bb5]" />
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 py-6 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="flex items-center">
          <div className="mr-4 p-2 bg-blue-50 rounded-lg">{getIcon()}</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
