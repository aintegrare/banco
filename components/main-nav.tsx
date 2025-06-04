import Link from "next/link"
import { cn } from "@/lib/utils"

interface MainNavProps {
  items?: {
    title: string
    href: string
    disabled?: boolean
  }[]
  className?: string
}

export function MainNav({ items, className }: MainNavProps) {
  return (
    <div className={cn("flex gap-6 md:gap-10", className)}>
      <Link href="/" className="flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">Integrare</span>
      </Link>
      {items?.length ? (
        <nav className="flex gap-6">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium text-muted-foreground",
                    item.disabled && "cursor-not-allowed opacity-80",
                  )}
                >
                  {item.title}
                </Link>
              ),
          )}
        </nav>
      ) : null}
    </div>
  )
}
