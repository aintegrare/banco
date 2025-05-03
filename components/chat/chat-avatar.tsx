interface ChatAvatarProps {
  size?: "sm" | "md" | "lg"
}

export function ChatAvatar({ size = "md" }: ChatAvatarProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-[#4b7bb5] flex items-center justify-center text-white font-medium overflow-hidden`}
    >
      <span className="text-xs">JQ</span>
    </div>
  )
}
