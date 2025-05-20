"use client"

import { FileList } from "./file-list"
import { NotificationProvider } from "./notification-manager"
import { useState } from "react"

export default function FileExplorerClient() {
  const [selectedDirectory, setSelectedDirectory] = useState("documents")

  return (
    <NotificationProvider>
      <div className="space-y-6">
        <FileList initialDirectory={selectedDirectory} />
      </div>
    </NotificationProvider>
  )
}
