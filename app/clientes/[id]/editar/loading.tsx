import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-2">
        <Skeleton className="h-6 w-[200px]" />
      </div>

      <div className="mb-6">
        <Skeleton className="h-10 w-[250px] mb-2" />
        <Skeleton className="h-4 w-[350px]" />
      </div>

      <div className="mt-6">
        <Skeleton className="h-[600px] rounded-lg" />
      </div>
    </div>
  )
}
