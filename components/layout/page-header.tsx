import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-5 pt-8 px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      <div>
        <h1 className="text-2xl font-bold text-[#3d649e]">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {actions && <div className="mt-4 flex sm:mt-0 sm:ml-4">{actions}</div>}
    </div>
  )
}
