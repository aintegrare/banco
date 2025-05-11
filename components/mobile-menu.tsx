"use client"

import { useEffect } from "react"
import Link from "next/link"
import { X } from "lucide-react"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Close menu when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden" // Prevent scrolling when menu is open
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "" // Re-enable scrolling when menu is closed
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
      <div className="container h-full flex flex-col">
        <div className="flex justify-end py-4">
          <button onClick={onClose} className="text-white p-2" aria-label="Close menu">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-col items-center justify-center flex-1 gap-8 text-center">
          <Link href="#servicos" className="text-xl font-medium text-white hover:text-[#4b7bb5]" onClick={onClose}>
            Serviços
          </Link>
          <Link href="#sobre" className="text-xl font-medium text-white hover:text-[#4b7bb5]" onClick={onClose}>
            Por que nós
          </Link>
          <Link href="#processo" className="text-xl font-medium text-white hover:text-[#4b7bb5]" onClick={onClose}>
            Processo
          </Link>
          <Link href="#clientes" className="text-xl font-medium text-white hover:text-[#4b7bb5]" onClick={onClose}>
            Clientes
          </Link>

          <div className="mt-8">
            <Link
              href="https://calendly.com/integrare/consultoria"
              className="inline-flex items-center justify-center rounded-md bg-[#4b7bb5] px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-[#3d649e]"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
            >
              Agende uma Consultoria Grátis
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}
