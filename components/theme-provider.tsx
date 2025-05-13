"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type Theme = "light" | "dark"

interface ThemeContextProps {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  setTheme: () => {},
})

export function ThemeProvider({
  children,
  attribute,
  defaultTheme,
}: {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: Theme
}) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme") as Theme | null
      return storedTheme || defaultTheme || "light"
    }
    return defaultTheme || "light"
  })

  useEffect(() => {
    if (attribute) {
      document.documentElement.setAttribute(attribute, theme)
    } else {
      if (theme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
    localStorage.setItem("theme", theme)
  }, [theme, attribute])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
