import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  description: string
  features: string[]
}

export function ServiceCard({ icon, title, description, features }: ServiceCardProps) {
  return (
    <Card className="h-full overflow-hidden bg-white dark:bg-gray-900 border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#4b7bb5]/5 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500"></div>

      <CardHeader className="pt-6 px-6">
        <div className="mb-3 w-12 h-12 rounded-lg flex items-center justify-center bg-[#4b7bb5]/10 group-hover:bg-[#4b7bb5]/20 transition-colors">
          {icon}
        </div>
        <CardTitle className="text-xl font-bold text-[#3d649e] dark:text-[#6b91c1] group-hover:text-[#4072b0] transition-colors">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <ul className="space-y-2 mt-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 group/item">
              <CheckCircle className="h-5 w-5 text-[#4b7bb5] dark:text-[#6b91c1] mt-0.5 flex-shrink-0 opacity-80 group-hover/item:opacity-100 transition-opacity" />
              <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
