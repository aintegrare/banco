"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/client"
import { LayoutDashboard, FileText, FolderKanban, Settings, LogOut } from "lucide-react"

export function SimpleDock() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = getSupabaseClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  const isActive = (path: string) => {
    return pathname.startsWith(path)
  }

  const items = [
    { href: "/admin", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { href: "/admin/arquivos", icon: <FileText size={20} />, label: "Arquivos" },
    { href: "/admin/projetos", icon: <FolderKanban size={20} />, label: "Projetos" },
    { href: "/admin/configuracoes", icon: <Settings size={20} />, label: "Config" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around items-center h-16">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center px-2 py-1 ${
              isActive(item.href) ? "text-[#4b7bb5]" : "text-gray-500"
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
        <button onClick={handleLogout} className="flex flex-col items-center justify-center px-2 py-1 text-gray-500">
          <LogOut size={20} />
          <span className="text-xs mt-1">Sair</span>
        </button>
      </div>
    </div>
  )
}
