import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portal Pessoal | Integrare",
  description: "Gerencie seus links, tarefas e contatos em um só lugar",
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="bg-[#f8f9fa] min-h-screen">{children}</div>
}
