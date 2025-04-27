"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { addInteraction } from "@/app/actions"

const formSchema = z.object({
  type: z.string().min(1, {
    message: "O tipo de interação é obrigatório.",
  }),
  notes: z.string().optional(),
})

const interactionTypes = ["Ligação", "Email", "Reunião", "Mensagem", "Visita", "Outro"]

interface InteractionFormProps {
  contactId: string
}

export function InteractionForm({ contactId }: InteractionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      notes: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const result = await addInteraction({
        contact_id: contactId,
        type: values.type,
        notes: values.notes,
      })

      if (result.success) {
        toast({
          title: "Interação registrada",
          description: "A interação foi registrada com sucesso.",
        })

        // Resetar o formulário
        form.reset({
          type: "",
          notes: "",
        })
      } else {
        throw new Error("Falha ao registrar interação")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao registrar a interação.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-primary-700">Nova Interação</CardTitle>
        <CardDescription>Registre uma nova interação com este contato.</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Interação</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-primary/30 focus:ring-primary/30">
                        <SelectValue placeholder="Selecione um tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {interactionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anotações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detalhes sobre a interação..."
                      className="min-h-[100px] border-primary/30 focus-visible:ring-primary/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary-600">
              {isSubmitting ? "Registrando..." : "Registrar Interação"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
