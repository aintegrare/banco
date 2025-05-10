import type { ReactNode } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface StatCardProps {
  icon: ReactNode
  value: string
  description: string
}

export function StatCard({ icon, value, description }: StatCardProps) {
  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-gray-900 dark:text-white">
      <CardHeader className="text-center">
        <div className="mx-auto bg-[#4b7bb5]/10 dark:bg-[#4b7bb5]/20 p-3 rounded-full w-fit">{icon}</div>
        <CardTitle className="mt-4 text-3xl text-[#3d649e] dark:text-[#6b91c1]">{value}</CardTitle>
        <CardDescription className="text-base dark:text-gray-400">{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}
