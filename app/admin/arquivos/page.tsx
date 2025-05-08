"use client"

import { FileExplorer } from "@/components/admin/file-explorer"
import { AdminLayout } from "@/components/admin/admin-layout"

export default function FilesPage() {
  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <FileExplorer />
      </div>
    </AdminLayout>
  )
}
