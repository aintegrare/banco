"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Instagram, Facebook, Users, Target, BarChart, MessageCircle, ImageIcon, FileText } from "lucide-react"

interface Node {
  id: string
  type: "platform" | "audience" | "content" | "goal" | "metric"
  label: string
  position: { x: number; y: number }
  connections: string[]
  color: string
  icon: React.ReactNode
}

export function FlowChart() {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: "instagram",
      type: "platform",
      label: "Instagram",
      position: { x: 200, y: 100 },
      connections: ["young-audience", "visual-content", "engagement"],
      color: "#4b7bb5",
      icon: <Instagram size={20} className="text-white" />,
    },
    {
      id: "facebook",
      type: "platform",
      label: "Facebook",
      position: { x: 450, y: 100 },
      connections: ["adult-audience", "text-content", "traffic"],
      color: "#527eb7",
      icon: <Facebook size={20} className="text-white" />,
    },
    {
      id: "young-audience",
      type: "audience",
      label: "Público Jovem",
      position: { x: 100, y: 250 },
      connections: ["visual-content"],
      color: "#3d649e",
      icon: <Users size={20} className="text-white" />,
    },
    {
      id: "adult-audience",
      type: "audience",
      label: "Público Adulto",
      position: { x: 550, y: 250 },
      connections: ["text-content"],
      color: "#3d649e",
      icon: <Users size={20} className="text-white" />,
    },
    {
      id: "visual-content",
      type: "content",
      label: "Conteúdo Visual",
      position: { x: 100, y: 400 },
      connections: ["engagement"],
      color: "#4072b0",
      icon: <ImageIcon size={20} className="text-white" />,
    },
    {
      id: "text-content",
      type: "content",
      label: "Conteúdo Textual",
      position: { x: 550, y: 400 },
      connections: ["traffic"],
      color: "#4072b0",
      icon: <FileText size={20} className="text-white" />,
    },
    {
      id: "engagement",
      type: "goal",
      label: "Engajamento",
      position: { x: 300, y: 400 },
      connections: ["likes-comments"],
      color: "#6b91c1",
      icon: <MessageCircle size={20} className="text-white" />,
    },
    {
      id: "traffic",
      type: "goal",
      label: "Tráfego Site",
      position: { x: 350, y: 250 },
      connections: ["clicks"],
      color: "#6b91c1",
      icon: <Target size={20} className="text-white" />,
    },
    {
      id: "likes-comments",
      type: "metric",
      label: "Likes e Comentários",
      position: { x: 300, y: 550 },
      connections: [],
      color: "#4b7bb5",
      icon: <BarChart size={20} className="text-white" />,
    },
    {
      id: "clicks",
      type: "metric",
      label: "Cliques no Link",
      position: { x: 550, y: 550 },
      connections: [],
      color: "#4b7bb5",
      icon: <BarChart size={20} className="text-white" />,
    },
  ])

  const [dragging, setDragging] = useState<string | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const node = nodes.find((n) => n.id === id)
      if (node) {
        setOffset({
          x: e.clientX - rect.left - node.position.x,
          y: e.clientY - rect.top - node.position.y,
        })
        setDragging(id)
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setNodes((prev) =>
        prev.map((node) => {
          if (node.id === dragging) {
            return {
              ...node,
              position: {
                x: e.clientX - rect.left - offset.x,
                y: e.clientY - rect.top - offset.y,
              },
            }
          }
          return node
        }),
      )
    }
  }

  const handleMouseUp = () => {
    setDragging(null)
  }

  const getNodeTypeLabel = (type: string) => {
    const types = {
      platform: "Plataforma",
      audience: "Público-alvo",
      content: "Tipo de Conteúdo",
      goal: "Objetivo",
      metric: "Métrica",
    }
    return types[type as keyof typeof types] || type
  }

  return (
    <div
      ref={containerRef}
      className="h-full w-full relative overflow-hidden bg-white"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute top-4 left-4 z-10 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-sm font-medium mb-1">Mapa de Estratégia</h3>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#4b7bb5" }}></div>
            <span>Plataformas</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#3d649e" }}></div>
            <span>Público-alvo</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#4072b0" }}></div>
            <span>Conteúdo</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#6b91c1" }}></div>
            <span>Objetivos</span>
          </div>
        </div>
      </div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {nodes.map((node) =>
          node.connections.map((targetId) => {
            const target = nodes.find((n) => n.id === targetId)
            if (target) {
              const startX = node.position.x + 100
              const startY = node.position.y + 30
              const endX = target.position.x + 100
              const endY = target.position.y + 30

              // Calculate control points for curved lines
              const midY = (startY + endY) / 2

              return (
                <motion.path
                  key={`${node.id}-${targetId}`}
                  d={`M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`}
                  stroke="#4b7bb5"
                  strokeWidth={2}
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              )
            }
            return null
          }),
        )}
      </svg>

      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className={cn(
            "absolute rounded-lg p-4 w-[200px] cursor-move shadow-md",
            dragging === node.id ? "z-10 shadow-lg" : "z-0",
          )}
          style={{
            backgroundColor: node.color,
            left: node.position.x,
            top: node.position.y,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          onMouseDown={(e) => handleMouseDown(e, node.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-2 mb-1">
            {node.icon}
            <div className="text-white font-medium">{node.label}</div>
          </div>
          <div className="text-white/80 text-xs">{getNodeTypeLabel(node.type)}</div>
        </motion.div>
      ))}
    </div>
  )
}
