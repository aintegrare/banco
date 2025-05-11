import type React from "react"
import { cn } from "@/lib/utils"
import { Card as ShadcnCard, CardContent } from "@/components/ui/card"

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <ShadcnCard className={cn("border-none shadow-lg hover:shadow-xl transition-all duration-300", className)}>
      {children}
    </ShadcnCard>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <Card className={cn("overflow-hidden group", className)}>
      <CardContent className="p-6">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-500">
          {icon}
        </div>
        <h3 className="mb-2 text-xl font-bold text-brand-700 dark:text-brand-400">{title}</h3>
        <p className="text-neutral-600 dark:text-neutral-300">{description}</p>
      </CardContent>
    </Card>
  )
}

interface TestimonialCardProps {
  quote: string
  author: string
  role?: string
  className?: string
}

export function TestimonialCard({ quote, author, role, className }: TestimonialCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="mb-4 text-brand-500">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="h-5 w-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>
        <p className="mb-4 italic text-neutral-700 dark:text-neutral-300">{quote}</p>
        <div>
          <p className="font-semibold">{author}</p>
          {role && <p className="text-sm text-neutral-500 dark:text-neutral-400">{role}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

interface BlogCardProps {
  image: string
  title: string
  excerpt: string
  category: string
  date: string
  className?: string
}

export function BlogCard({ image, title, excerpt, category, date, className }: BlogCardProps) {
  return (
    <Card className={cn("overflow-hidden h-full group", className)}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <span className="text-xs font-medium bg-brand-500 px-2 py-1 rounded-full">{category}</span>
          <p className="text-xs mt-2">{date}</p>
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-brand-600 dark:text-brand-400 mb-2 line-clamp-2 group-hover:text-brand-700 transition-colors">
          {title}
        </h3>
        <p className="text-neutral-600 dark:text-neutral-300 mb-4 line-clamp-3">{excerpt}</p>
        <div className="flex items-center text-brand-500 font-medium">
          <span>Ler mais</span>
          <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}
