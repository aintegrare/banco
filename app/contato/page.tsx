"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone, Send } from "lucide-react"
import { useState } from "react"

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    mensagem: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulação de envio de formulário
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        empresa: "",
        mensagem: "",
      })
    }, 1500)
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#3d649e]">Entre em Contato</h1>
        <p className="mt-4 text-gray-600 md:text-xl">
          Estamos prontos para ajudar seu negócio a alcançar resultados extraordinários
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-[#4b7bb5]">Envie-nos uma mensagem</CardTitle>
              <CardDescription>
                Preencha o formulário abaixo e entraremos em contato o mais breve possível.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-4 rounded-full bg-green-100 p-3">
                    <Send className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-[#3d649e]">Mensagem Enviada!</h3>
                  <p className="text-gray-600">Obrigado por entrar em contato. Nossa equipe responderá em breve.</p>
                  <Button className="mt-6 bg-[#4b7bb5] hover:bg-[#3d649e]" onClick={() => setIsSubmitted(false)}>
                    Enviar nova mensagem
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome completo</Label>
                      <Input
                        id="nome"
                        name="nome"
                        placeholder="Seu nome"
                        required
                        value={formData.nome}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        name="telefone"
                        placeholder="(00) 00000-0000"
                        value={formData.telefone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="empresa">Empresa</Label>
                      <Input
                        id="empresa"
                        name="empresa"
                        placeholder="Nome da sua empresa"
                        value={formData.empresa}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mensagem">Mensagem</Label>
                    <Textarea
                      id="mensagem"
                      name="mensagem"
                      placeholder="Como podemos ajudar?"
                      rows={5}
                      required
                      value={formData.mensagem}
                      onChange={handleChange}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#4b7bb5] hover:bg-[#3d649e]" disabled={isSubmitting}>
                    {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-[#4b7bb5]">Informações de Contato</CardTitle>
              <CardDescription>Entre em contato conosco através dos canais abaixo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-[#4b7bb5]/10 p-3">
                  <MapPin className="h-6 w-6 text-[#4b7bb5]" />
                </div>
                <div>
                  <h3 className="font-medium">Endereço</h3>
                  <p className="text-gray-600">Rua Exemplo, 123 - São Paulo, SP</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-[#4b7bb5]/10 p-3">
                  <Phone className="h-6 w-6 text-[#4b7bb5]" />
                </div>
                <div>
                  <h3 className="font-medium">Telefone</h3>
                  <p className="text-gray-600">(11) 1234-5678</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-[#4b7bb5]/10 p-3">
                  <Mail className="h-6 w-6 text-[#4b7bb5]" />
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-gray-600">contato@integrare.com.br</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-[#4b7bb5]">Horário de Atendimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Segunda a Sexta</span>
                <span>9h às 18h</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Sábado</span>
                <span>9h às 13h</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Domingo e Feriados</span>
                <span>Fechado</span>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-lg bg-[#4b7bb5] p-6 text-white">
            <h3 className="mb-2 text-xl font-bold">Atendimento Rápido</h3>
            <p className="mb-4">
              Precisa de uma resposta rápida? Entre em contato pelo WhatsApp e fale diretamente com nossa equipe.
            </p>
            <Button className="bg-white text-[#4b7bb5] hover:bg-[#f2f1ef]">Falar pelo WhatsApp</Button>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold text-[#3d649e]">Nossa Localização</h2>
        <div className="h-96 w-full overflow-hidden rounded-lg bg-gray-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975588253486!2d-46.65429492392006!3d-23.564611060750744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1682531949870!5m2!1spt-BR!2sbr"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  )
}
