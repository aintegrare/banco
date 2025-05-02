"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function NewTaskPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirecionar para a página de tarefas com um parâmetro para abrir o diálogo
    router.replace("/tarefas?new=true")
  }, [router])

  return null
}
