"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  Search,
  Wrench,
  CheckSquare,
  Calendar,
  MessageSquare,
  Globe,
  FileImage,
  LogOut,
  Users,
  Share2,
  FolderOpen,
} from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

interface DockItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
  badge?: number | string
  onClick?: () => void
}

function DockItem({ href, icon, label, isActive, badge, onClick }: DockItemProps) {
  if (onClick) {
    return (
      <button onClick={onClick} className="relative group">
        <div
          className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${
            isActive ? "bg-[#4b7bb5] text-white" : "text-gray-600 hover:bg-[#4b7bb5]/10 hover:text-[#4b7bb5]"
          }`}
        >
          <div className="text-current relative">
            {icon}
            {badge && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {typeof badge === "number" && badge > 99 ? "99+" : badge}
              </span>
            )}
          </div>
          <span className="text-xs mt-1 text-current">{label}</span>
        </div>
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          {label}
          {badge && <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5">{badge}</span>}
        </div>
      </button>
    )
  }

  return (
    <Link href={href} className="relative group">
      <div
        className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${
          isActive ? "bg-[#4b7bb5] text-white" : "text-gray-600 hover:bg-[#4b7bb5]/10 hover:text-[#4b7bb5]"
        }`}
      >
        <div className="text-current relative">
          {icon}
          {badge && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {typeof badge === "number" && badge > 99 ? "99+" : badge}
            </span>
          )}
        </div>
        <span className="text-xs mt-1 text-current">{label}</span>
      </div>
      {isActive && (
        <motion.div
          className="absolute -bottom-1 left-1/2 w-1.5 h-1.5 bg-white rounded-full"
          layoutId="activeIndicator"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          style={{ x: "-50%" }}
        />
      )}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
        {label}
        {badge && <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5">{badge}</span>}
      </div>
    </Link>
  )
}

export function AppDock() {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(true) // Definido como true por padrão para modo de demonstração

  // Verificar se o usuário está autenticado
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar se estamos em modo de demonstração
        const demoMode = localStorage.getItem("demoMode") === "true" || document.cookie.includes("demo-mode=true")

        if (demoMode) {
          console.log("Modo de demonstração ativo no AppDock")
          setIsAuthenticated(true)
          return
        }

        const supabase = getSupabaseClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setIsAuthenticated(!!session)
      } catch (error) {
        console.error("Erro ao verificar autenticação no AppDock:", error)
        // Definir como autenticado por padrão para evitar problemas de renderização
        setIsAuthenticated(true)
      }
    }

    checkAuth()
  }, [pathname])

  // Se estiver na página de login, não mostrar o dock
  if (pathname.includes("/admin/login")) {
    return null
  }

  // Usamos o método getSupabaseClient do nosso singleton em vez de createClientComponentClient
  const handleLogout = async () => {
    try {
      const supabase = getSupabaseClient()
      await supabase.auth.signOut()
      router.push("/admin/login")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  const isActive = (path: string) => {
    if (path === "/admin" && pathname === "/admin") return true
    if (path === "/admin" && pathname === "/") return true

    // Verificações específicas para projetos e tarefas
    if (path === "/admin/projetos" && pathname.startsWith("/admin/projetos")) return true
    if (path === "/admin/tarefas" && pathname.startsWith("/admin/tarefas")) return true
    if (path === "/admin/clientes" && pathname.startsWith("/admin/clientes")) return true
    if (path === "/admin/crm" && pathname.startsWith("/admin/crm")) return true
    if (path === "/admin/blog" && pathname.startsWith("/admin/blog")) return true
    if (path === "/admin/arquivos" && pathname.startsWith("/admin/arquivos")) return true

    return pathname.startsWith(path)
  }

  // Categorias de itens do dock
  const mainItems = [
    { href: "/admin", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { href: "/admin/arquivos", icon: <FolderOpen size={20} />, label: "Arquivos" },
    { href: "/admin/projetos", icon: <FolderKanban size={20} />, label: "Projetos" },
    { href: "/admin/tarefas", icon: <CheckSquare size={20} />, label: "Tarefas" },
    { href: "/admin/blog", icon: <FileImage size={20} />, label: "Blog" },
  ]

  const marketingItems = [
    { href: "/admin/crm", icon: <Users size={20} />, label: "CRM" },
    { href: "/admin/smp", icon: <Share2 size={20} />, label: "SMP" },
    { href: "/admin/agenda", icon: <Calendar size={20} />, label: "Agenda" },
  ]

  const toolsItems = [
    { href: "/admin/ferramentas", icon: <Wrench size={20} />, label: "Ferramentas" },
    { href: "/admin/chat", icon: <MessageSquare size={20} />, label: "Chat" },
    { href: "/search", icon: <Search size={20} />, label: "Busca" },
    { href: "/", icon: <Globe size={20} />, label: "Site" },
    { href: "/admin/configuracoes", icon: <Settings size={20} />, label: "Config" },
  ]

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm p-2 rounded-2xl shadow-lg border border-gray-200">
        {/* Itens principais - sempre visíveis */}
        {mainItems.map((item) => (
          <DockItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={isActive(item.href)}
          />
        ))}

        {/* Itens de marketing - visíveis em telas médias e grandes */}
        <div className="hidden md:flex">
          {marketingItems.map((item) => (
            <DockItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={isActive(item.href)}
            />
          ))}
        </div>

        {/* Itens de ferramentas - visíveis apenas em telas grandes */}
        <div className="hidden lg:flex">
          {toolsItems.map((item) => (
            <DockItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={isActive(item.href)}
            />
          ))}
        </div>

        {/* Botão de logout */}
        <DockItem href="#" icon={<LogOut size={20} />} label="Sair" isActive={false} onClick={handleLogout} />

        {/* Menu de mais opções para telas menores */}
        <div className="md:hidden">
          <DockItem
            href="#"
            icon={<span className="flex items-center justify-center w-5 h-5 text-lg">•••</span>}
            label="Mais"
            isActive={false}
          />
        </div>
      </div>
    </div>
  )
}
