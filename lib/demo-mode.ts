// Melhorar a detecção do modo de demonstração

export function isDemoMode(): boolean {
  if (typeof window === "undefined") {
    // No servidor, não podemos verificar localStorage ou cookies diretamente
    return false
  }

  // Verificar localStorage
  const localStorageDemoMode = localStorage.getItem("demoMode") === "true"

  // Verificar cookies
  const cookieDemoMode = document.cookie.includes("demo-mode=true")

  return localStorageDemoMode || cookieDemoMode
}

export function enableDemoMode(): void {
  if (typeof window === "undefined") return

  localStorage.setItem("demoMode", "true")
  localStorage.setItem("isAuthenticated", "true")
  document.cookie = "demo-mode=true; path=/; max-age=86400"
}

export function disableDemoMode(): void {
  if (typeof window === "undefined") return

  localStorage.removeItem("demoMode")
  document.cookie = "demo-mode=false; path=/; max-age=0"
}
