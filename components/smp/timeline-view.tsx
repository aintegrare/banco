"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Instagram, Facebook, Twitter, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SocialMediaPost {
  id: string
  title: string
  platform: "instagram" | "facebook" | "twitter" | "linkedin"
  type: "image" | "video" | "carousel" | "text"
  date: Date
  status: "draft" | "scheduled" | "published"
  color: string
  track: number
}

export function TimelineView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"week" | "month">("week")
  const [filter, setFilter] = useState<string | null>(null)

  // Gerar posts para a semana atual
  const generatePosts = (): SocialMediaPost[] => {
    const posts: SocialMediaPost[] = []
    const startDate = new Date(currentDate)
    startDate.setDate(startDate.getDate() - startDate.getDay()) // Início da semana (domingo)

    // Instagram posts
    posts.push({
      id: "1",
      title: "Post de Produto",
      platform: "instagram",
      type: "image",
      date: new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000), // Segunda
      status: "published",
      color: "#E1306C",
      track: 0,
    })

    posts.push({
      id: "2",
      title: "Reels Tutorial",
      platform: "instagram",
      type: "video",
      date: new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000), // Quarta
      status: "scheduled",
      color: "#E1306C",
      track: 0,
    })

    // Facebook posts
    posts.push({
      id: "3",
      title: "Artigo do Blog",
      platform: "facebook",
      type: "text",
      date: new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000), // Terça
      status: "published",
      color: "#4267B2",
      track: 1,
    })

    posts.push({
      id: "4",
      title: "Carrossel de Produtos",
      platform: "facebook",
      type: "carousel",
      date: new Date(startDate.getTime() + 4 * 24 * 60 * 60 * 1000), // Quinta
      status: "draft",
      color: "#4267B2",
      track: 1,
    })

    // Twitter posts
    posts.push({
      id: "5",
      title: "Novidades do Setor",
      platform: "twitter",
      type: "text",
      date: new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000), // Terça
      status: "published",
      color: "#1DA1F2",
      track: 2,
    })

    posts.push({
      id: "6",
      title: "Thread Educativa",
      platform: "twitter",
      type: "text",
      date: new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000), // Sexta
      status: "scheduled",
      color: "#1DA1F2",
      track: 2,
    })

    return posts
  }

  const [posts] = useState<SocialMediaPost[]>(generatePosts())

  const filteredPosts = filter ? posts.filter((post) => post.platform === filter) : posts

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram size={16} />
      case "facebook":
        return <Facebook size={16} />
      case "twitter":
        return <Twitter size={16} />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Publicado</Badge>
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Agendado</Badge>
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Rascunho</Badge>
      default:
        return null
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    })
  }

  const getDayOfWeek = (dayIndex: number) => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    return days[dayIndex]
  }

  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const startOfWeek = new Date(currentDate)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(endOfWeek.getDate() + 6)

  const dateRangeText =
    viewMode === "week"
      ? `${startOfWeek.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} - ${endOfWeek.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}`
      : currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })

  return (
    <div className="h-full flex flex-col flex-1 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-gray-500" />
          <h2 className="text-lg font-medium">Calendário de Publicações</h2>
        </div>

        <div className="flex items-center gap-4">
          <Select value={filter || "all"} onValueChange={(value) => setFilter(value === "all" ? null : value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por plataforma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as plataformas</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={navigatePrevious}>
              <ChevronLeft size={16} />
            </Button>
            <span className="text-sm font-medium w-48 text-center">{dateRangeText}</span>
            <Button variant="outline" size="icon" onClick={navigateNext}>
              <ChevronRight size={16} />
            </Button>
          </div>

          <Select value={viewMode} onValueChange={(value: "week" | "month") => setViewMode(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Visualização" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="month">Mês</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 relative border border-gray-200 rounded-lg overflow-hidden">
        {/* Dias da semana */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="p-2 text-center border-r border-gray-200 last:border-r-0 bg-gray-50">
              <div className="text-sm font-medium text-gray-700">{getDayOfWeek(i)}</div>
            </div>
          ))}
        </div>

        {/* Plataformas */}
        <div className="grid grid-cols-7 h-full">
          {Array.from({ length: 7 }).map((_, dayIndex) => {
            const currentDay = new Date(startOfWeek)
            currentDay.setDate(currentDay.getDate() + dayIndex)

            const dayPosts = filteredPosts.filter((post) => {
              const postDate = new Date(post.date)
              return (
                postDate.getDate() === currentDay.getDate() &&
                postDate.getMonth() === currentDay.getMonth() &&
                postDate.getFullYear() === currentDay.getFullYear()
              )
            })

            return (
              <div
                key={dayIndex}
                className={`border-r border-gray-200 last:border-r-0 p-2 ${
                  currentDay.toDateString() === new Date().toDateString() ? "bg-blue-50" : ""
                }`}
              >
                <div className="text-xs text-gray-500 mb-2">{currentDay.getDate()}</div>

                <div className="space-y-2">
                  {dayPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      className="p-2 rounded-md shadow-sm cursor-pointer"
                      style={{ backgroundColor: `${post.color}15`, borderLeft: `3px solid ${post.color}` }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1">
                          <span className="text-xs" style={{ color: post.color }}>
                            {getPlatformIcon(post.platform)}
                          </span>
                          <span className="text-xs font-medium">{post.title}</span>
                        </div>
                        {getStatusBadge(post.status)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
