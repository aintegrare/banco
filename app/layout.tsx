import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppDock } from "@/components/layout/app-dock"
import { ThemeProvider } from "@/components/theme-provider"
import { ChatWidget } from "@/components/chat/chat-widget"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Integrare - Agência de Marketing em Maringá, Curitiba e São Paulo",
  description:
    "Agência de Marketing Digital especializada em resultados reais para empresas em Maringá, Curitiba e São Paulo",
  metadataBase: new URL("https://www.redeintegrare.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Integrare - Agência de Marketing em Maringá, Curitiba e São Paulo",
    description: "Marketing Estratégico para Resultados Reais em Maringá, Curitiba e São Paulo",
    url: "https://www.redeintegrare.com",
    siteName: "Integrare",
    locale: "pt_BR",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={`${inter.className} pb-20 w-full mx-auto`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
          <AppDock />
          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  )
}
