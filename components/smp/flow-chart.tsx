"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Node {
  id: string
  type: "trigger" | "condition" | "action"
  label: string
  position: { x: number; y: number }
  connections: string[]
  color: string
}

export function FlowChart() {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: "motion-detected",
      type: "trigger",
      label: "Motion Detected",
      position: { x: 200, y: 100 },
      connections: ["snapshot", "lights"],
      color: "#4b7bb5",
    },
    {
      id: "snapshot",
      type: "action",
      label: "Snapshot Camera",
      position: { x: 100, y: 250 },
      connections: ["analyze"],
      color: "#527eb7",
    },
    {
      id: "lights",
      type: "action",
      label: "Turn On Hallway Lights",
      position: { x: 300, y: 250 },
      connections: ["notification"],
      color: "#3d649e",
    },
    {
      id: "analyze",
      type: "action",
      label: "Analyze Person",
      position: { x: 100, y: 400 },
      connections: ["notification"],
      color: "#4072b0",
    },
    {
      id: "notification",
      type: "action",
      label: "Send Push Notification",
      position: { x: 300, y: 400 },
      connections: [],
      color: "#6b91c1",
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

  return (
    <div
      ref={containerRef}
      className="h-full w-full relative overflow-hidden bg-white"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
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
            "absolute rounded-lg p-4 w-[200px] cursor-move shadow-lg",
            dragging === node.id ? "z-10 shadow-xl" : "z-0",
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
          <div className="text-white font-medium">{node.label}</div>
          <div className="text-white/60 text-sm">{node.type}</div>
        </motion.div>
      ))}
    </div>
  )
}
