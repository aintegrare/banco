import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface ContactInfoCardProps {
  icon: ReactNode
  title: string
  lines: string[]
}

export function ContactInfoCard({ icon, title, lines }: ContactInfoCardProps) {
  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-gray-900 dark:text-white">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-[#4b7bb5]/10 dark:bg-[#4b7bb5]/20 p-3 rounded-full">{icon}</div>
          <div>
            <h3 className="font-medium text-lg mb-1 text-[#3d649e] dark:text-[#6b91c1]">{title}</h3>
            {lines.map((line, index) => (
              <p key={index} className="text-gray-600 dark:text-gray-400">
                {line}
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
