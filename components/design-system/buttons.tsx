import type React from "react"
import { cn } from "@/lib/utils"
import { Button as ShadcnButton } from "@/components/ui/button"
import { Loader2, ArrowRight } from "lucide-react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  className?: string
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  iconPosition = "left",
  className,
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: "bg-brand-500 hover:bg-brand-600 text-white",
    secondary: "bg-neutral-100 hover:bg-neutral-200 text-brand-700",
    outline: "border border-brand-500 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20",
    ghost: "text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20",
    link: "text-brand-500 hover:underline p-0 h-auto",
  }

  const sizeClasses = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3",
  }

  return (
    <ShadcnButton
      className={cn(
        "font-medium rounded-md transition-all",
        variantClasses[variant],
        sizeClasses[size],
        "flex items-center gap-2",
        isLoading && "opacity-70 cursor-not-allowed",
        className,
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {!isLoading && icon && iconPosition === "left" && icon}
      {children}
      {!isLoading && icon && iconPosition === "right" && icon}
    </ShadcnButton>
  )
}

export function PrimaryButton(props: ButtonProps) {
  return <Button variant="primary" {...props} />
}

export function SecondaryButton(props: ButtonProps) {
  return <Button variant="secondary" {...props} />
}

export function OutlineButton(props: ButtonProps) {
  return <Button variant="outline" {...props} />
}

export function GhostButton(props: ButtonProps) {
  return <Button variant="ghost" {...props} />
}

export function LinkButton(props: ButtonProps) {
  return <Button variant="link" {...props} />
}

export function ArrowButton(props: Omit<ButtonProps, "icon" | "iconPosition">) {
  return <Button {...props} icon={<ArrowRight className="h-4 w-4" />} iconPosition="right" />
}
