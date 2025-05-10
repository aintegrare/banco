"use client"

import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Linkedin, Share2 } from "lucide-react"

interface BlogShareButtonsProps {
  title: string
  url: string
}

export function BlogShareButtons({ title, url }: BlogShareButtonsProps) {
  // Função para compartilhar no Facebook
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
  }

  // Função para compartilhar no Twitter
  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      "_blank",
    )
  }

  // Função para compartilhar no LinkedIn
  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")
  }

  // Função para compartilhar via WhatsApp
  const shareOnWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`, "_blank")
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-bold text-[#4072b0] mb-4 flex items-center">
        <Share2 className="mr-2 h-5 w-5" />
        Compartilhe este artigo
      </h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          className="border-[#4b7bb5] text-[#4b7bb5] hover:bg-[#4b7bb5] hover:text-white"
          onClick={shareOnFacebook}
        >
          <Facebook className="mr-2 h-4 w-4" />
          Facebook
        </Button>
        <Button
          variant="outline"
          className="border-[#4b7bb5] text-[#4b7bb5] hover:bg-[#4b7bb5] hover:text-white"
          onClick={shareOnTwitter}
        >
          <Twitter className="mr-2 h-4 w-4" />
          Twitter
        </Button>
        <Button
          variant="outline"
          className="border-[#4b7bb5] text-[#4b7bb5] hover:bg-[#4b7bb5] hover:text-white"
          onClick={shareOnLinkedIn}
        >
          <Linkedin className="mr-2 h-4 w-4" />
          LinkedIn
        </Button>
        <Button
          variant="outline"
          className="border-[#4b7bb5] text-[#4b7bb5] hover:bg-[#4b7bb5] hover:text-white"
          onClick={shareOnWhatsApp}
        >
          WhatsApp
        </Button>
      </div>
    </div>
  )
}
