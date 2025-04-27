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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  addContact,
  updateContact,
  getCategories,
  getBusinessCategories,
  getTemperatureLevels,
  getClientValues,
  getContactPreferences,
  getLeadSources,
} from "@/app/actions"
import type { Contact } from "@/app/actions"

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
  cpf: z.string().optional(),
  city: z.string().optional(),
  category: z.string().optional(),
  business_category: z.string().optional(),
  temperature: z.string().optional(),
  client_value: z.string().optional(),
  contact_preference: z.string().optional(),
  lead_source: z.string().optional(),
  last_contact_date: z.date().optional().nullable(),
  discovery_date: z.date().optional().nullable(),
  notes: z.string().optional(),
})

export function ContactForm() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [businessCategories, setBusinessCategories] = useState<any[]>([])
  const [temperatureLevels, setTemperatureLevels] = useState<any[]>([])
  const [clientValues, setClientValues] = useState<any[]>([])
  const [contactPreferences, setContactPreferences] = useState<any[]>([])
  const [leadSources, setLeadSources] = useState<any[]>([])
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cpf: "",
      city: "",
      category: "5", // Categoria padrão "Outros"
      business_category: "13", // Categoria de negócio padrão "Outro"
      temperature: "2", // Temperatura padrão "Morno"
      client_value: "2", // Valor padrão "Médio"
      contact_preference: "1", // Preferência padrão "WhatsApp"
      lead_source: "",
      last_contact_date: null,
      discovery_date: new Date(),
      notes: "",
    },
  })

  useEffect(() => {
    // Carregar dados de referência
    const loadReferenceData = async () => {
      const [
        categoriesData,
        businessCategoriesData,
        temperatureLevelsData,
        clientValuesData,
        contactPreferencesData,
        leadSourcesData,
      ] = await Promise.all([
        getCategories(),
        getBusinessCategories(),
        getTemperatureLevels(),
        getClientValues(),
        getContactPreferences(),
        getLeadSources(),
      ])

      setCategories(categoriesData)
      setBusinessCategories(businessCategoriesData)
      setTemperatureLevels(temperatureLevelsData)
      setClientValues(clientValuesData)
      setContactPreferences(contactPreferencesData)
      setLeadSources(leadSourcesData)
    }

    loadReferenceData()

    // Escutar o evento de edição
    const handleEditEvent = (event: CustomEvent<Contact>) => {
      const contact = event.detail
      form.reset({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        cpf: contact.cpf,
        city: contact.city,
        category: contact.category || "5",
        business_category: contact.business_category || "13",
        temperature: contact.temperature || "2",
        client_value: contact.client_value || "2",
        contact_preference: contact.contact_preference || "1",
        lead_source: contact.lead_source,
        last_contact_date: contact.last_contact_date ? new Date(contact.last_contact_date) : null,
        discovery_date: contact.discovery_date ? new Date(contact.discovery_date) : null,
        notes: contact.notes,
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
      // Converter datas para string ISO
      const contactData = {
        ...values,
        last_contact_date: values.last_contact_date ? values.last_contact_date.toISOString() : undefined,
        discovery_date: values.discovery_date ? values.discovery_date.toISOString() : undefined,
      }

      if (isEditing && values.id) {
        // Atualizar contato existente
        const result = await updateContact(contactData as Contact)

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
          ...contactData,
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
        cpf: "",
        city: "",
        category: "5",
        business_category: "13",
        temperature: "2",
        client_value: "2",
        contact_preference: "1",
        lead_source: "",
        last_contact_date: null,
        discovery_date: new Date(),
        notes: "",
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
      cpf: "",
      city: "",
      category: "5",
      business_category: "13",
      temperature: "2",
      client_value: "2",
      contact_preference: "1",
      lead_source: "",
      last_contact_date: null,
      discovery_date: new Date(),
      notes: "",
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input placeholder="000.000.000-00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria Pessoal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center">
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: category.color }}
                              ></div>
                              {category.name}
                            </div>
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
                name="business_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria de Negócio</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {businessCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
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
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperatura</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma temperatura" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {temperatureLevels.map((temp) => (
                          <SelectItem key={temp.id} value={temp.id}>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: temp.color }}></div>
                              {temp.name}
                            </div>
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
                name="client_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do Cliente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um valor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clientValues.map((value) => (
                          <SelectItem key={value.id} value={value.id}>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: value.color }}></div>
                              {value.name}
                            </div>
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
                name="contact_preference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferência de Contato</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma preferência" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contactPreferences.map((pref) => (
                          <SelectItem key={pref.id} value={pref.id}>
                            {pref.name}
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
                name="lead_source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fonte de Captação</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma fonte" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {leadSources.map((source) => (
                          <SelectItem key={source.id} value={source.id}>
                            {source.name}
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
                name="last_contact_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Último Contato</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discovery_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data da Descoberta</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informações adicionais sobre o contato..."
                      className="min-h-[100px]"
                      {...field}
                    />
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
