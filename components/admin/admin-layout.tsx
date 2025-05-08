import type React from "react"

import { AdminNav } from "@/components/admin/admin-nav"

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r p-4">
        <AdminNav />
      </aside>
      <main className="flex-grow p-6">{children}</main>
    </div>
  )
}
