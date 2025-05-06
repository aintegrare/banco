import { ClipboardList } from "lucide-react"

interface FolderTaskBadgeProps {
  count: number
}

export function FolderTaskBadge({ count }: FolderTaskBadgeProps) {
  if (count <= 0) return null

  return (
    <div className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-[#4b7bb5]/10 text-[#4b7bb5] ml-2">
      <ClipboardList className="h-3 w-3 mr-1" />
      {count}
    </div>
  )
}
