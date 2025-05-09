import type React from "react"
import { SimpleAuthCheck } from "@/components/auth/simple-auth-check"
import { SimpleDock } from "@/components/layout/simple-dock"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SimpleAuthCheck>
      <div className="min-h-screen pb-20">
        {children}
        <SimpleDock />
      </div>
    </SimpleAuthCheck>
  )
}
