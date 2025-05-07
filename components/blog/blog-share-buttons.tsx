"use client"

import { Facebook, Twitter, Linkedin, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

interface BlogShareButtonsProps {
  title: string
  url: string
}

export function BlogShareButtons({ title, url }: BlogShareButtonsProps) {
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para a área de transferência.",
      })
    })
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-[#4072b0] mb-4">Compartilhar</h3>
      <div className="flex space-x-2">
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no Facebook">
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-[#4b7bb5]">
            <Facebook className="h-5 w-5 text-[#4b7bb5]" />
          </Button>
        </a>
        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no Twitter">
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-[#4b7bb5]">
            <Twitter className="h-5 w-5 text-[#4b7bb5]" />
          </Button>
        </a>
        <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no LinkedIn">
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-[#4b7bb5]">
            <Linkedin className="h-5 w-5 text-[#4b7bb5]" />
          </Button>
        </a>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full border-[#4b7bb5]"
          onClick={copyToClipboard}
          aria-label="Copiar link"
        >
          <Link2 className="h-5 w-5 text-[#4b7bb5]" />
        </Button>
      </div>
    </div>
  )
}
