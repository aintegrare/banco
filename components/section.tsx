import type React from "react"
import { cn } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
}

export function Section({ title, description, children, className, ...props }: SectionProps) {
  return (
    <div className={cn("grid gap-4", className)} {...props}>
      {(title || description) && (
        <div className="grid gap-1">
          {title && <h2 className="text-xl font-semibold tracking-tight">{title}</h2>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      {children}
    </div>
  )
}
