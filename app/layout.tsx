import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppDock } from "@/components/layout/app-dock"
import { ThemeProvider } from "@/components/theme-provider"
import { ChatWidget } from "@/components/chat/chat-widget"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Integrare - Agência de Marketing",
  description: "Plataforma de gestão de projetos e documentos da Integrare",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} pb-20`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
          <AppDock />
          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  )
}
