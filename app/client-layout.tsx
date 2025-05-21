"use client"

import type React from "react"

import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ChatWidget } from "@/components/chat/chat-widget"
import { usePathname } from "next/navigation"
import { OfflineIndicator } from "@/components/offline-indicator"

const inter = Inter({ subsets: ["latin"] })

function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showChatWidget = !pathname.includes("/admin/chat")

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <>
            {children}
            <OfflineIndicator />
            {showChatWidget && <ChatWidget />}
          </>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayoutClient
