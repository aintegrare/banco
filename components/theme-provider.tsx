"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

interface ThemeProviderProps extends React.PropsWithChildren {
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  storageKey?: string
}

export function ThemeProvider({
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  storageKey = "theme",
  children,
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      storageKey={storageKey}
    >
      {children}
    </NextThemesProvider>
  )
}

export function useTheme() {
  const [theme, setTheme] = React.useState("system")

  React.useEffect(() => {
    ensureOpaqueBackgrounds()
  }, [theme])

  // Garantir que os componentes de diálogo e popover tenham fundos opacos
  const ensureOpaqueBackgrounds = () => {
    // Adicionar estilos globais para garantir fundos opacos em componentes de UI
    if (typeof document !== "undefined") {
      const style = document.createElement("style")
      style.innerHTML = `
      .dark .shadcn-dialog,
      .dark [role="dialog"],
      .dark [role="combobox"],
      .dark [data-state="open"],
      .dark .popover-content {
        background-color: rgb(31 41 55) !important;
        border-color: rgb(55 65 81) !important;
      }
      
      .dark input,
      .dark textarea,
      .dark select {
        background-color: rgb(55 65 81) !important;
        border-color: rgb(75 85 99) !important;
        color: white !important;
      }
      
      .dark .select-content,
      .dark .popover-content,
      .dark .dropdown-content {
        background-color: rgb(31 41 55) !important;
        border-color: rgb(55 65 81) !important;
      }
    `
      document.head.appendChild(style)
    }
  }

  return {
    theme,
    setTheme,
  }
}
