"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/client"

export function SimpleAuthCheck({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.push("/admin/login")
      } else {
        setChecking(false)
      }
    }

    checkAuth()
  }, [router, supabase])

  if (checking) {
    return <div className="p-8 text-center">Carregando...</div>
  }

  return <>{children}</>
}
