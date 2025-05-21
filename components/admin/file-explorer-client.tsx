"use client"

import { FileList } from "./file-list"
import { NotificationProvider, useNotification } from "./notification-manager"
import { useState } from "react"

// Componente interno que usa o hook useNotification
function FileExplorerContent() {
  const [selectedDirectory, setSelectedDirectory] = useState("documents")
  const notification = useNotification() // Agora está dentro do contexto do NotificationProvider

  return (
    <div className="space-y-6">
      <FileList initialDirectory={selectedDirectory} />
    </div>
  )
}

// Componente principal que fornece o contexto do NotificationProvider
export default function FileExplorerClient() {
  return (
    <NotificationProvider>
      <FileExplorerContent />
    </NotificationProvider>
  )
}
