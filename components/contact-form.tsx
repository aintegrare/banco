"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import type { Contact } from "./contact-list"
import { addContact, updateContact } from "@/app/actions"

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  phone: z.string().min(8, {
    message: "O telefone deve ter pelo menos 8 dígitos.",
  }),
})

export function ContactForm() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })

  useEffect(() => {
    // Escutar o evento de edição
    const handleEditEvent = (event: CustomEvent<Contact>) => {
      const contact = event.detail
      form.reset({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
      })
      setIsEditing(true)
    }

    window.addEventListener("edit-contact", handleEditEvent as EventListener)

    return () => {
      window.removeEventListener("edit-contact", handleEditEvent as EventListener)
    }
  }, [form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      if (isEditing && values.id) {
        // Atualizar contato existente
        const result = await updateContact(values as Contact)

        if (result.success) {
          toast({
            title: "Contato atualizado",
            description: "As informações do contato foram atualizadas com sucesso.",
          })
        } else {
          throw new Error("Falha ao atualizar")
        }
      } else {
        // Adicionar novo contato
        const newContact = {
          ...values,
          id: uuidv4(),
        }

        const result = await addContact(newContact)

        if (result.success) {
          toast({
            title: "Contato adicionado",
            description: "O novo contato foi adicionado com sucesso.",
          })
        } else {
          throw new Error("Falha ao adicionar")
        }
      }

      // Resetar o formulário
      form.reset({
        name: "",
        email: "",
        phone: "",
      })
      setIsEditing(false)

      // Disparar evento para atualizar a lista
      window.dispatchEvent(new Event("contact-updated"))
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o contato.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    form.reset({
      name: "",
      email: "",
      phone: "",
    })
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Contato" : "Novo Contato"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Atualize as informações do contato abaixo."
            : "Preencha os dados para adicionar um novo contato."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 pt-2">
              {isEditing && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : isEditing ? "Atualizar" : "Adicionar"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
