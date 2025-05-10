import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return "R$ 0,00"
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount)
}

export const formatDate = (dateString: string | null | undefined, includeTime = false) => {
  if (!dateString) return "N/A"

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "Data inválida"

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }

    if (includeTime) {
      options.hour = "2-digit"
      options.minute = "2-digit"
    }

    return date.toLocaleDateString("pt-BR", options)
  } catch (error) {
    console.error("Erro ao formatar data:", error)
    return "Data inválida"
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
