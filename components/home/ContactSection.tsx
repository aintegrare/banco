"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin, Youtube } from "lucide-react"
import { ContactInfoCard } from "@/components/shared/ContactInfoCard"

export function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formState.name.trim()) {
      errors.name = "Nome é obrigatório"
    }

    if (!formState.email.trim()) {
      errors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      errors.email = "Email inválido"
    }

    if (!formState.phone.trim()) {
      errors.phone = "Telefone é obrigatório"
    }

    if (!formState.message.trim()) {
      errors.message = "Mensagem é obrigatória"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormState({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
      })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    }, 1500)
  }

  return (
    <section id="contato" ref={sectionRef} className="py-20 bg-white dark:bg-gray-900">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-[#3d649e] dark:text-[#6b91c1] sm:text-4xl">
            Entre em Contato
          </h2>
          <div className="w-20 h-1 bg-[#4072b0] dark:bg-[#6b91c1] mx-auto mt-4 mb-6 rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Estamos prontos para ajudar seu negócio a alcançar novos patamares. Entre em contato conosco.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card
            className={`lg:col-span-2 border-none shadow-lg dark:bg-gray-900 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <CardHeader>
              <CardTitle className="text-[#3d649e] dark:text-[#6b91c1]">Envie uma mensagem</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Preencha o formulário abaixo e entraremos em contato em até 24 horas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="dark:text-white">
                      Nome
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Seu nome completo"
                      value={formState.name}
                      onChange={handleChange}
                      className={`dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                        formErrors.name ? "border-red-500 dark:border-red-500" : ""
                      }`}
                    />
                    {formErrors.name && <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="dark:text-white">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formState.email}
                      onChange={handleChange}
                      className={`dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                        formErrors.email ? "border-red-500 dark:border-red-500" : ""
                      }`}
                    />
                    {formErrors.email && <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="dark:text-white">
                      Telefone
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="(00) 00000-0000"
                      value={formState.phone}
                      onChange={handleChange}
                      className={`dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                        formErrors.phone ? "border-red-500 dark:border-red-500" : ""
                      }`}
                    />
                    {formErrors.phone && <p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="dark:text-white">
                    Empresa
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="Nome da sua empresa"
                    value={formState.company}
                    onChange={handleChange}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="dark:text-white">
                    Mensagem
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Como podemos ajudar?"
                    rows={5}
                    value={formState.message}
                    onChange={handleChange}
                    className={`dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                      formErrors.message ? "border-red-500 dark:border-red-500" : ""
                    }`}
                  />
                  {formErrors.message && <p className="text-sm text-red-500 mt-1">{formErrors.message}</p>}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#4072b0] hover:bg-[#3d649e] dark:bg-[#4b7bb5] dark:hover:bg-[#6b91c1] transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    "Enviar Mensagem"
                  )}
                </Button>
                {isSubmitted && (
                  <div className="p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 rounded-md text-center animate-fade-in">
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Mensagem enviada com sucesso! Entraremos em contato em breve.
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          <div
            className={`space-y-6 transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <ContactInfoCard
              icon={<Mail className="h-6 w-6 text-[#4072b0] dark:text-[#6b91c1]" />}
              title="Email"
              lines={["contato@redeintegrare.com.br"]}
            />

            <ContactInfoCard
              icon={<Phone className="h-6 w-6 text-[#4072b0] dark:text-[#6b91c1]" />}
              title="Telefone"
              lines={["(11) 99999-9999"]}
            />

            <ContactInfoCard
              icon={<MapPin className="h-6 w-6 text-[#4072b0] dark:text-[#6b91c1]" />}
              title="Endereço"
              lines={["São Paulo, SP - Brasil"]}
            />

            <div className="bg-[#4072b0] text-white p-6 rounded-lg shadow-lg">
              <h3 className="font-medium text-lg mb-4">Redes Sociais</h3>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com/redeintegrare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://facebook.com/redeintegrare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com/company/redeintegrare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://youtube.com/redeintegrare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
