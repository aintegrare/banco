"use client"

import { type ReactNode, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ServiceCardProps {
  icon: ReactNode
  title: string
  description: string
  features: string[]
}

export function ServiceCard({ icon, title, description, features }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className={`h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 ${
        isHovered ? "transform -translate-y-2" : ""
      } dark:bg-gray-900 dark:text-white`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader>
        <div
          className={`bg-[#4b7bb5]/10 dark:bg-[#4b7bb5]/20 p-3 rounded-full w-fit transition-all duration-300 ${
            isHovered ? "bg-[#4b7bb5]/20 dark:bg-[#4b7bb5]/30 scale-110" : ""
          }`}
        >
          {icon}
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
        <CardDescription className="dark:text-gray-400">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#4b7bb5] dark:bg-[#6b91c1]"></div>
              <span className="dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full text-[#4072b0] border-[#4072b0] hover:bg-[#4072b0] hover:text-white dark:text-[#6b91c1] dark:border-[#6b91c1] dark:hover:bg-[#6b91c1] dark:hover:text-white transition-colors"
        >
          Saiba Mais
        </Button>
      </CardFooter>
    </Card>
  )
}
