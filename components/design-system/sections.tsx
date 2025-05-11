"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { H2, Paragraph } from "./typography"

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("py-16 md:py-24", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}

interface SectionHeaderProps {
  title: string
  description?: string
  centered?: boolean
  className?: string
}

export function SectionHeader({ title, description, centered = true, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-12", centered && "text-center", className)}>
      <H2 className="mb-4">{title}</H2>
      {description && (
        <div className={cn("max-w-3xl", centered && "mx-auto")}>
          <Paragraph className="text-lg">{description}</Paragraph>
        </div>
      )}
      <div
        className={cn("w-20 h-1 bg-brand-500 dark:bg-brand-400 mt-4 mb-6 rounded-full", centered && "mx-auto")}
      ></div>
    </div>
  )
}

interface GridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: "sm" | "md" | "lg"
  className?: string
}

export function Grid({ children, columns = 3, gap = "md", className }: GridProps) {
  const columnsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }

  const gapClass = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  }

  return <div className={cn("grid", columnsClass[columns], gapClass[gap], className)}>{children}</div>
}

interface HeroSectionProps {
  title: string
  subtitle?: string
  ctaText?: string
  ctaAction?: () => void
  secondaryCtaText?: string
  secondaryCtaAction?: () => void
  image?: string
  className?: string
  children?: React.ReactNode
}

export function HeroSection({
  title,
  subtitle,
  ctaText,
  ctaAction,
  secondaryCtaText,
  secondaryCtaAction,
  image,
  className,
  children,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative py-24 md:py-32 lg:py-40 overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700 dark:from-brand-700 dark:to-brand-900 text-white",
        className,
      )}
    >
      {/* Elementos decorativos flutuantes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-brand-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="absolute inset-0 bg-[url('/pattern-bg.png')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 dark:to-black/40"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="transition-all duration-1000 delay-300">
            <div className="mb-4">
              <div className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4 animate-fadeIn">
                Agência de Marketing Digital
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">{title}</h1>
            {subtitle && <p className="mt-6 text-lg md:text-xl text-white/90 max-w-lg leading-relaxed">{subtitle}</p>}
            {(ctaText || secondaryCtaText) && (
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                {ctaText && (
                  <button
                    onClick={ctaAction}
                    className="bg-white text-brand-700 hover:bg-white/90 dark:bg-white/90 dark:hover:bg-white shadow-lg hover:shadow-xl transition-all px-6 py-3 rounded-md font-medium"
                  >
                    {ctaText}
                  </button>
                )}
                {secondaryCtaText && (
                  <button
                    onClick={secondaryCtaAction}
                    className="border-white text-white hover:bg-white/10 transition-colors px-6 py-3 rounded-md font-medium flex items-center"
                  >
                    {secondaryCtaText}
                    <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
          {image && (
            <div className="hidden md:block transition-all duration-1000 delay-500">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-400 to-brand-600 rounded-lg blur-md opacity-75 animate-pulse"></div>
                <div className="relative rounded-lg shadow-2xl overflow-hidden backdrop-blur">
                  <img
                    src={image || "/placeholder.svg"}
                    alt="Hero image"
                    className="relative rounded-lg shadow-2xl w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-700/40 to-transparent mix-blend-overlay"></div>
                </div>
              </div>
            </div>
          )}
          {children}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path
            fill="currentColor"
            fillOpacity="1"
            className="text-white dark:text-gray-900"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  )
}
