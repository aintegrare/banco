"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Não renderizar paginação se houver apenas uma página
  if (totalPages <= 1) {
    return null
  }

  // Determinar quais botões de página mostrar
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5 // Número máximo de botões de página para mostrar

    if (totalPages <= maxPagesToShow) {
      // Se o total de páginas for menor ou igual ao máximo, mostrar todas as páginas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Sempre incluir a primeira página
      pages.push(1)

      // Calcular o intervalo de páginas a serem mostradas
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      // Ajustar o intervalo para mostrar sempre 3 páginas no meio
      if (startPage === 2) {
        endPage = Math.min(totalPages - 1, startPage + 2)
      } else if (endPage === totalPages - 1) {
        startPage = Math.max(2, endPage - 2)
      }

      // Adicionar elipses se necessário
      if (startPage > 2) {
        pages.push(-1) // -1 representa elipses
      }

      // Adicionar páginas do intervalo
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      // Adicionar elipses se necessário
      if (endPage < totalPages - 1) {
        pages.push(-2) // -2 representa elipses
      }

      // Sempre incluir a última página
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-center space-x-1 mt-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="border-primary/30 hover:bg-primary/10 hover:text-primary-700"
      >
        <ChevronsLeft className="h-4 w-4" />
        <span className="sr-only">Primeira página</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border-primary/30 hover:bg-primary/10 hover:text-primary-700"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Página anterior</span>
      </Button>

      {pageNumbers.map((pageNumber, index) => {
        // Renderizar elipses
        if (pageNumber < 0) {
          return (
            <span key={`ellipsis-${index}`} className="px-2 py-1 text-muted-foreground">
              ...
            </span>
          )
        }

        // Renderizar botão de página
        return (
          <Button
            key={pageNumber}
            variant={currentPage === pageNumber ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(pageNumber)}
            className={
              currentPage === pageNumber
                ? "bg-primary text-primary-foreground hover:bg-primary-600"
                : "border-primary/30 hover:bg-primary/10 hover:text-primary-700"
            }
          >
            {pageNumber}
          </Button>
        )
      })}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border-primary/30 hover:bg-primary/10 hover:text-primary-700"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Próxima página</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="border-primary/30 hover:bg-primary/10 hover:text-primary-700"
      >
        <ChevronsRight className="h-4 w-4" />
        <span className="sr-only">Última página</span>
      </Button>
    </div>
  )
}
