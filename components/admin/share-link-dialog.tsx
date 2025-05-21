"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, Link2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface ShareLinkDialogProps {
  isOpen: boolean
  onClose: () => void
  item: {
    name: string
    path: string
    type: "folder" | "file"
    url?: string
  } | null
}

export default function ShareLinkDialog({ isOpen, onClose, item }: ShareLinkDialogProps) {
  const [copied, setCopied] = useState(false)
  const [shareLink, setShareLink] = useState("")
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)
  const [expiryDays, setExpiryDays] = useState(7)
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [password, setPassword] = useState("")
  const [isPublic, setIsPublic] = useState(true)

  // Gerar link de compartilhamento
  const generateShareLink = async () => {
    if (!item) return

    setIsGeneratingLink(true)

    try {
      // Para arquivos, podemos usar a URL direta
      if (item.type === "file" && item.url) {
        setShareLink(item.url)
      }
      // Para pastas, precisamos criar um link especial
      else if (item.type === "folder") {
        // Aqui você pode implementar a lógica para gerar um token único
        // e armazenar no banco de dados com as informações da pasta
        const response = await fetch("/api/files/share", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: item.path,
            type: item.type,
            expiryDays,
            isPasswordProtected,
            password: isPasswordProtected ? password : undefined,
            isPublic,
          }),
        })

        if (!response.ok) {
          throw new Error("Falha ao gerar link de compartilhamento")
        }

        const data = await response.json()

        // Para pastas, criamos um link para nossa página de visualização de pasta compartilhada
        if (item.type === "folder") {
          const baseUrl = window.location.origin
          setShareLink(`${baseUrl}/shared-folder/${data.token}?path=${encodeURIComponent(item.path)}`)
        } else {
          setShareLink(data.url)
        }
      }
    } catch (error) {
      console.error("Erro ao gerar link de compartilhamento:", error)
      alert("Erro ao gerar link de compartilhamento. Tente novamente.")
    } finally {
      setIsGeneratingLink(false)
    }
  }

  // Copiar link para a área de transferência
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar {item?.type === "folder" ? "Pasta" : "Arquivo"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <div className="text-sm text-gray-700">{item?.name}</div>
          </div>

          <div className="space-y-2">
            <Label>Tipo</Label>
            <div className="text-sm text-gray-700 capitalize">{item?.type}</div>
          </div>

          {item?.type === "folder" && (
            <>
              <div className="flex items-center justify-between">
                <Label htmlFor="expiry">Expirar após (dias)</Label>
                <Input
                  id="expiry"
                  type="number"
                  min="1"
                  max="30"
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(Number.parseInt(e.target.value))}
                  className="w-20"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="public-switch">Link público</Label>
                <Switch id="public-switch" checked={isPublic} onCheckedChange={setIsPublic} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="password-switch">Proteger com senha</Label>
                <Switch id="password-switch" checked={isPasswordProtected} onCheckedChange={setIsPasswordProtected} />
              </div>

              {isPasswordProtected && (
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite uma senha"
                  />
                </div>
              )}
            </>
          )}

          {!shareLink && (
            <Button onClick={generateShareLink} className="w-full" disabled={isGeneratingLink}>
              <Link2 className="mr-2 h-4 w-4" />
              {isGeneratingLink ? "Gerando..." : "Gerar Link de Compartilhamento"}
            </Button>
          )}

          {shareLink && (
            <div className="space-y-2">
              <Label>Link de compartilhamento</Label>
              <div className="flex">
                <Input value={shareLink} readOnly className="flex-1" />
                <Button type="button" size="icon" variant="outline" onClick={copyToClipboard} className="ml-2">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
