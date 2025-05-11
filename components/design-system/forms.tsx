"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { Input as ShadcnInput } from "@/components/ui/input"
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea"
import { Label as ShadcnLabel } from "@/components/ui/label"
import { Button } from "./buttons"
import { Loader2 } from "lucide-react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  className?: string
}

export function Input({ label, error, className, ...props }: InputProps) {
  const id = props.id || props.name || Math.random().toString(36).substring(2, 9)

  return (
    <div className="space-y-2">
      {label && (
        <ShadcnLabel htmlFor={id} className="dark:text-white">
          {label}
        </ShadcnLabel>
      )}
      <ShadcnInput
        id={id}
        className={cn(
          "dark:bg-gray-800 dark:border-gray-700 dark:text-white",
          error && "border-error-500 dark:border-error-500",
          className,
        )}
        {...props}
      />
      {error && <p className="text-sm text-error-500 mt-1">{error}</p>}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  className?: string
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  const id = props.id || props.name || Math.random().toString(36).substring(2, 9)

  return (
    <div className="space-y-2">
      {label && (
        <ShadcnLabel htmlFor={id} className="dark:text-white">
          {label}
        </ShadcnLabel>
      )}
      <ShadcnTextarea
        id={id}
        className={cn(
          "dark:bg-gray-800 dark:border-gray-700 dark:text-white",
          error && "border-error-500 dark:border-error-500",
          className,
        )}
        {...props}
      />
      {error && <p className="text-sm text-error-500 mt-1">{error}</p>}
    </div>
  )
}

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
  onSubmit: (e: React.FormEvent) => void
  isSubmitting?: boolean
  submitText?: string
  className?: string
}

export function Form({
  children,
  onSubmit,
  isSubmitting = false,
  submitText = "Enviar",
  className,
  ...props
}: FormProps) {
  return (
    <form onSubmit={onSubmit} className={cn("space-y-6", className)} {...props}>
      {children}
      <Button
        type="submit"
        className="w-full bg-brand-500 hover:bg-brand-600 text-white transition-colors"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando...
          </span>
        ) : (
          submitText
        )}
      </Button>
    </form>
  )
}

interface FormSuccessProps {
  message: string
  className?: string
}

export function FormSuccess({ message, className }: FormSuccessProps) {
  return (
    <div
      className={cn(
        "p-4 bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300 rounded-md text-center animate-fade-in",
        className,
      )}
    >
      <div className="flex items-center justify-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        {message}
      </div>
    </div>
  )
}

interface FormErrorProps {
  message: string
  className?: string
}

export function FormError({ message, className }: FormErrorProps) {
  return (
    <div
      className={cn(
        "p-4 bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-300 rounded-md text-center animate-fade-in",
        className,
      )}
    >
      <div className="flex items-center justify-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        {message}
      </div>
    </div>
  )
}
