import type React from "react"
import { cn } from "@/lib/utils"

interface TypographyProps {
  children: React.ReactNode
  className?: string
}

export function H1({ children, className }: TypographyProps) {
  return (
    <h1
      className={cn(
        "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-brand-800 dark:text-brand-400",
        className,
      )}
    >
      {children}
    </h1>
  )
}

export function H2({ children, className }: TypographyProps) {
  return (
    <h2 className={cn("text-3xl md:text-4xl font-bold tracking-tight text-brand-700 dark:text-brand-500", className)}>
      {children}
    </h2>
  )
}

export function H3({ children, className }: TypographyProps) {
  return (
    <h3 className={cn("text-2xl md:text-3xl font-bold text-brand-600 dark:text-brand-500", className)}>{children}</h3>
  )
}

export function H4({ children, className }: TypographyProps) {
  return <h4 className={cn("text-xl font-bold text-brand-600 dark:text-brand-500", className)}>{children}</h4>
}

export function Paragraph({ children, className }: TypographyProps) {
  return <p className={cn("text-base text-neutral-700 dark:text-neutral-300 leading-relaxed", className)}>{children}</p>
}

export function Lead({ children, className }: TypographyProps) {
  return (
    <p className={cn("text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed", className)}>
      {children}
    </p>
  )
}

export function Subtle({ children, className }: TypographyProps) {
  return <p className={cn("text-sm text-neutral-500 dark:text-neutral-400", className)}>{children}</p>
}

export function Badge({ children, className }: TypographyProps) {
  return (
    <span
      className={cn(
        "inline-block py-1 px-3 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-sm font-medium",
        className,
      )}
    >
      {children}
    </span>
  )
}
