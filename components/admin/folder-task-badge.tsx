import { ClipboardList } from "lucide-react"

interface FolderTaskBadgeProps {
  count: number
}

export function FolderTaskBadge({ count }: FolderTaskBadgeProps) {
  if (count <= 0) return null

  return (
    <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#4b7bb5] text-white ml-2 shadow-sm">
      <ClipboardList className="h-3.5 w-3.5 mr-1" />
      {count}
    </div>
  )
}
