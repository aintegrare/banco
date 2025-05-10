import type React from "react"
interface StatCardProps {
  icon: React.ReactNode
  value: string
  description: string
}

export function StatCard({ icon, value, description }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg px-6 py-8 text-center h-full group hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800">
      <div className="mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center bg-[#4b7bb5]/10 group-hover:bg-[#4b7bb5]/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-3xl font-bold text-[#3d649e] dark:text-[#6b91c1] mb-2 group-hover:scale-110 transition-transform">
        {value}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  )
}
