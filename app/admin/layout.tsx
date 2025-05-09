import type React from "react"
import { AppDock } from "@/components/layout/app-dock"
import { AuthCheck } from "@/components/auth/auth-check"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthCheck>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">{children}</main>
        <AppDock />
      </div>
    </AuthCheck>
  )
}
