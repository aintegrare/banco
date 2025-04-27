"use server"

import { revalidatePath } from "next/cache"
import { parse } from "json2csv"

// Adicione estas importações no topo do arquivo
import { parse as csvParse } from "csv-parse/sync"
import * as XLSX from "xlsx"

// Importar a função para obter o D1Database
import { getD1Database } from "@/lib/db"

export type Contact = {
  id: string
  name: string
  email: string
  phone: string
  cpf?: string
  city?: string
  category?: string
  business_category?: string
  temperature?: string
  client_value?: string
  contact_preference?: string
  lead_source?: string
  last_contact_date?: string
  discovery_date?: string
  notes?: string
  category_name?: string
  category_color?: string
  business_category_name?: string
  temperature_name?: string
  temperature_color?: string
  client_value_name?: string
  client_value_color?: string
  contact_preference_name?: string
  contact_preference_icon?: string
  lead_source_name?: string
  created_at?: string
  updated_at?: string
}

export type Category = {
  id: string
  name: string
  color: string
}

export type BusinessCategory = {
  id: string
  name: string
}

export type TemperatureLevel = {
  id: string
  name: string
  color: string
}

export type ClientValue = {
  id: string
  name: string
  color: string
}

export type ContactPreference = {
  id: string
  name: string
  icon: string
}

export type LeadSource = {
  id: string
  name: string
}

export type Interaction = {
  id: string
  contact_id: string
  type: string
  notes?: string
  date: string
}

// Armazenamento local para desenvolvimento/preview
let localContacts: Contact[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@exemplo.com",
    phone: "(11) 98765-4321",
    cpf: "123.456.789-00",
    city: "São Paulo",
    category: "2",
    business_category: "7",
    temperature: "3",
    client_value: "3",
    contact_preference: "1",
    lead_source: "2",
    last_contact_date: "2023-04-15T14:30:00",
    discovery_date: "2023-01-10T09:15:00",
    notes: "Cliente interessado em expandir negócios para o exterior. Tem orçamento significativo.",
    category_name: "Trabalho",
    category_color: "#10b981",
    business_category_name: "Consultoria",
    temperature_name: "Quente",
    temperature_color: "#ef4444",
    client_value_name: "Alto",
    client_value_color: "#10b981",
    contact_preference_name: "WhatsApp",
    contact_preference_icon: "message-circle",
    lead_source_name: "Indicação",
  },
  {
    id: "2",
    name: "Maria Oliveira",
    email: "maria@exemplo.com",
    phone: "(21) 91234-5678",
    cpf: "987.654.321-00",
    city: "Rio de Janeiro",
    category: "3",
    business_category: "5",
    temperature: "2",
    client_value: "2",
    contact_preference: "3",
    lead_source: "1",
    last_contact_date: "2023-03-22T10:45:00",
    discovery_date: "2023-02-05T16:20:00",
    notes: "Advogada especializada em direito empresarial. Prefere comunicação formal por email.",
    category_name: "Família",
    category_color: "#f59e0b",
    business_category_name: "Advocacia",
    temperature_name: "Morno",
    temperature_color: "#f59e0b",
    client_value_name: "Médio",
    client_value_color: "#f59e0b",
    contact_preference_name: "Email",
    contact_preference_icon: "mail",
    lead_source_name: "Site",
  },
]

const localCategories: Category[] = [
  { id: "1", name: "Pessoal", color: "#3b82f6" },
  { id: "2", name: "Trabalho", color: "#10b981" },
  { id: "3", name: "Família", color: "#f59e0b" },
  { id: "4", name: "Amigos", color: "#8b5cf6" },
  { id: "5", name: "Outros", color: "#6b7280" },
]

const localBusinessCategories: BusinessCategory[] = [
  { id: "1", name: "Odontologia" },
  { id: "2", name: "Medicina" },
  { id: "3", name: "Varejo" },
  { id: "4", name: "Indústria" },
  { id: "5", name: "Advocacia" },
  { id: "6", name: "Arquitetura" },
  { id: "7", name: "Consultoria" },
  { id: "8", name: "Lançamento e Cursos" },
  { id: "9", name: "Madeireira" },
  { id: "10", name: "Saúde e Bem-estar" },
  { id: "11", name: "Startup" },
  { id: "12", name: "Tecnologia" },
  { id: "13", name: "Outro" },
]

const localTemperatureLevels: TemperatureLevel[] = [
  { id: "1", name: "Frio", color: "#3b82f6" },
  { id: "2", name: "Morno", color: "#f59e0b" },
  { id: "3", name: "Quente", color: "#ef4444" },
]

const localClientValues: ClientValue[] = [
  { id: "1", name: "Baixo", color: "#6b7280" },
  { id: "2", name: "Médio", color: "#f59e0b" },
  { id: "3", name: "Alto", color: "#10b981" },
]

const localContactPreferences: ContactPreference[] = [
  { id: "1", name: "WhatsApp", icon: "message-circle" },
  { id: "2", name: "Ligação", icon: "phone" },
  { id: "3", name: "Email", icon: "mail" },
]

const localLeadSources: LeadSource[] = [
  { id: "1", name: "Site" },
  { id: "2", name: "Indicação" },
  { id: "3", name: "LinkedIn" },
  { id: "4", name: "Instagram" },
  { id: "5", name: "Facebook" },
  { id: "6", name: "Google" },
  { id: "7", name: "Evento" },
  { id: "8", name: "Parceria" },
  { id: "9", name: "Outro" },
]

const localInteractions: Interaction[] = [
  {
    id: "1",
    contact_id: "1",
    type: "Ligação",
    notes: "Conversamos sobre o projeto",
    date: new Date().toISOString(),
  },
]

// Modificar apenas a função getStorage para melhorar o tratamento de erros
async function getStorage() {
  try {
    // Obter a instância do D1Database
    const db = getD1Database()

    if (db && typeof db.prepare === "function") {
      // Testar a conexão com o banco de dados
      try {
        await db.prepare("SELECT 1 as test").first()
        console.log("Conexão com D1 estabelecida com sucesso")
        return {
          type: "d1",
          db,
        }
      } catch (dbError) {
        console.error("Erro ao testar conexão com D1:", dbError)
        console.log("Usando armazenamento local devido a erro na conexão com D1")
        return {
          type: "local",
          db: null,
          error: dbError,
        }
      }
    } else {
      console.log("D1_DATABASE não encontrado ou inválido, usando armazenamento local")
      return {
        type: "local",
        db: null,
      }
    }
  } catch (error) {
    console.error("Erro ao acessar D1, usando armazenamento local:", error)
    return {
      type: "local",
      db: null,
      error,
    }
  }
}

// Modificar apenas a função getContacts para suportar paginação
export async function getContacts(
  query?: string,
  categoryFilter?: string,
  businessCategoryFilter?: string,
  temperatureFilter?: string,
  page = 1,
  pageSize = 100,
) {
  try {
    const storage = await getStorage()
    const offset = (page - 1) * pageSize

    if (storage.type === "d1") {
      // Usando D1
      let countSql = `
        SELECT COUNT(*) as total
        FROM contacts c
        WHERE 1=1
      `

      let sql = `
        SELECT 
          c.*,
          cat.name as category_name,
          cat.color as category_color,
          bc.name as business_category_name,
          tl.name as temperature_name,
          tl.color as temperature_color,
          cv.name as client_value_name,
          cv.color as client_value_color,
          cp.name as contact_preference_name,
          cp.icon as contact_preference_icon,
          ls.name as lead_source_name
        FROM contacts c
        LEFT JOIN categories cat ON c.category = cat.id
        LEFT JOIN business_categories bc ON c.business_category = bc.id
        LEFT JOIN temperature_levels tl ON c.temperature = tl.id
        LEFT JOIN client_values cv ON c.client_value = cv.id
        LEFT JOIN contact_preferences cp ON c.contact_preference = cp.id
        LEFT JOIN lead_sources ls ON c.lead_source = ls.id
        WHERE 1=1
      `
      const params: any[] = []
      const countParams: any[] = []

      if (query) {
        const whereClause = " AND (c.name LIKE ? OR c.email LIKE ? OR c.phone LIKE ? OR c.city LIKE ?)"
        sql += whereClause
        countSql += whereClause

        const searchParam = `%${query}%`
        params.push(searchParam, searchParam, searchParam, searchParam)
        countParams.push(searchParam, searchParam, searchParam, searchParam)
      }

      if (categoryFilter) {
        const whereClause = " AND c.category = ?"
        sql += whereClause
        countSql += whereClause

        params.push(categoryFilter)
        countParams.push(categoryFilter)
      }

      if (businessCategoryFilter) {
        const whereClause = " AND c.business_category = ?"
        sql += whereClause
        countSql += whereClause

        params.push(businessCategoryFilter)
        countParams.push(businessCategoryFilter)
      }

      if (temperatureFilter) {
        const whereClause = " AND c.temperature = ?"
        sql += whereClause
        countSql += whereClause

        params.push(temperatureFilter)
        countParams.push(temperatureFilter)
      }

      sql += " ORDER BY c.created_at DESC LIMIT ? OFFSET ?"
      params.push(pageSize, offset)

      // Executar consulta para obter o total de registros
      const countResult = await storage.db
        .prepare(countSql)
        .bind(...countParams)
        .first()

      const total = countResult?.total || 0

      // Executar consulta para obter os registros da página atual
      const { results } = await storage.db
        .prepare(sql)
        .bind(...params)
        .all()

      return {
        contacts: results as Contact[],
        pagination: {
          total,
          page,
          pageSize,
          pageCount: Math.ceil(total / pageSize),
        },
      }
    } else {
      // Usando armazenamento local
      let filtered = [...localContacts]

      if (query) {
        filtered = filtered.filter(
          (contact) =>
            contact.name.toLowerCase().includes(query.toLowerCase()) ||
            contact.email.toLowerCase().includes(query.toLowerCase()) ||
            contact.phone.includes(query) ||
            (contact.city && contact.city.toLowerCase().includes(query.toLowerCase())),
        )
      }

      if (categoryFilter) {
        filtered = filtered.filter((contact) => contact.category === categoryFilter)
      }

      if (businessCategoryFilter) {
        filtered = filtered.filter((contact) => contact.business_category === businessCategoryFilter)
      }

      if (temperatureFilter) {
        filtered = filtered.filter((contact) => contact.temperature === temperatureFilter)
      }

      // Ordenar por data de criação (simulado)
      filtered.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
        return dateB - dateA
      })

      const total = filtered.length
      const paginatedContacts = filtered.slice(offset, offset + pageSize)

      return {
        contacts: paginatedContacts,
        pagination: {
          total,
          page,
          pageSize,
          pageCount: Math.ceil(total / pageSize),
        },
      }
    }
  } catch (error) {
    console.error("Erro ao buscar contatos:", error)
    return {
      contacts: [],
      pagination: {
        total: 0,
        page: 1,
        pageSize: 0,
        pageCount: 0,
      },
    }
  }
}

export async function getContact(id: string) {
  try {
    const storage = await getStorage()

    if (storage.type === "d1") {
      // Usando D1
      const { results } = await storage.db
        .prepare(`
          SELECT 
            c.*,
            cat.name as category_name,
            cat.color as category_color,
            bc.name as business_category_name,
            tl.name as temperature_name,
            tl.color as temperature_color,
            cv.name as client_value_name,
            cv.color as client_value_color,
            cp.name as contact_preference_name,
            cp.icon as contact_preference_icon,
            ls.name as lead_source_name
          FROM contacts c
          LEFT JOIN categories cat ON c.category = cat.id
          LEFT JOIN business_categories bc ON c.business_category = bc.id
          LEFT JOIN temperature_levels tl ON c.temperature = tl.id
          LEFT JOIN client_values cv ON c.client_value = cv.id
          LEFT JOIN contact_preferences cp ON c.contact_preference = cp.id
          LEFT JOIN lead_sources ls ON c.lead_source = ls.id
          WHERE c.id = ?
        `)
        .bind(id)
        .all()

      return (results[0] as Contact) || null
    } else {
      // Usando armazenamento local
      return localContacts.find((c) => c.id === id) || null
    }
  } catch (error) {
    console.error("Erro ao buscar contato:", error)
    return null
  }
}

export async function getCategories() {
  try {
    const storage = await getStorage()

    if (storage.type === "d1") {
      // Usando D1
      const { results } = await storage.db.prepare("SELECT * FROM categories ORDER BY name").all()

      return results as Category[]
    } else {
      // Usando armazenamento local
      return localCategories
    }
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
    return localCategories
  }
}

export async function getBusinessCategories() {
  try {
    const storage = await getStorage()

    if (storage.type === "d1") {
      // Usando D1
      const { results } = await storage.db.prepare("SELECT * FROM business_categories ORDER BY name").all()

      return results as BusinessCategory[]
    } else {
      // Usando armazenamento local
      return localBusinessCategories
    }
  } catch (error) {
    console.error("Erro ao buscar categorias de negócio:", error)
    return localBusinessCategories
  }
}

export async function getTemperatureLevels() {
  try {
    const storage = await getStorage()

    if (storage.type === "d1") {
      // Usando D1
      const { results } = await storage.db.prepare("SELECT * FROM temperature_levels ORDER BY id").all()

      return results as TemperatureLevel[]
    } else {
      // Usando armazenamento local
      return localTemperatureLevels
    }
  } catch (error) {
    console.error("Erro ao buscar níveis de temperatura:", error)
    return localTemperatureLevels
  }
}

export async function getClientValues() {
  try {
    const storage = await getStorage()

    if (storage.type === "d1") {
      // Usando D1
      const { results } = await storage.db.prepare("SELECT * FROM client_values ORDER BY id").all()

      return results as ClientValue[]
    } else {
      // Usando armazenamento local
      return localClientValues
    }
  } catch (error) {
    console.error("Erro ao buscar valores de cliente:", error)
    return localClientValues
  }
}

export async function getContactPreferences() {
  try {
    const storage = await getStorage()

    if (storage.type === "d1") {
      // Usando D1
      const { results } = await storage.db.prepare("SELECT * FROM contact_preferences ORDER BY id").all()

      return results as ContactPreference[]
    } else {
      // Usando armazenamento local
      return localContactPreferences
    }
  } catch (error) {
    console.error("Erro ao buscar preferências de contato:", error)
    return localContactPreferences
  }
}

export async function getLeadSources() {
  try {
    const storage = await getStorage()

    if (storage.type === "d1") {
      // Usando D1
      const { results } = await storage.db.prepare("SELECT * FROM lead_sources ORDER BY name").all()

      return results as LeadSource[]
    } else {
      // Usando armazenamento local
      return localLeadSources
    }
  } catch (error) {
    console.error("Erro ao buscar fontes de captação:", error)
    return localLeadSources
  }
}

export async function addContact(contact: Contact) {
  try {
    const storage = await getStorage()

    if (storage.type === "d1") {
      // Usando D1
      await storage.db
        .prepare(`
          INSERT INTO contacts (
            id, name, email, phone, cpf, city, 
            category, business_category, temperature, client_value, 
            contact_preference, lead_source, last_contact_date, discovery_date, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          contact.id,
          contact.name,
          contact.email,
          contact.phone,
          contact.cpf || null,
          contact.city || null,
          contact.category || "5",
          contact.business_category || "13",
          contact.temperature || "2",
          contact.client_value || "2",
          contact.contact_preference || "1",
          contact.lead_source || null,
          contact.last_contact_date || null,
          contact.discovery_date || new Date().toISOString(),
          contact.notes || null,
        )
        .run()
    } else {
      // Usando armazenamento local
      const newContact = {
        ...contact,
        category_name: localCategories.find((c) => c.id === contact.category)?.name,
        category_color: localCategories.find((c) => c.id === contact.category)?.color,
        business_category_name: localBusinessCategories.find((c) => c.id === contact.business_category)?.name,
        temperature_name: localTemperatureLevels.find((t) => t.id === contact.temperature)?.name,
        temperature_color: localTemperatureLevels.find((t) => t.id === contact.temperature)?.color,
        client_value_name: localClientValues.find((v) => v.id === contact.client_value)?.name,
        client_value_color: localClientValues.find((v) => v.id === contact.client_value)?.color,
        contact_preference_name: localContactPreferences.find((p) => p.id === contact.contact_preference)?.name,
        contact_preference_icon: localContactPreferences.find((p) => p.id === contact.contact_preference)?.icon,
        lead_source_name: localLeadSources.find((s) => s.id === contact.lead_source)?.name,
      }
      localContacts.push(newContact)
    }

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Erro ao adicionar contato:", error)
    return { success: false, error }
  }
}

export async function updateContact(contact: Contact) {
  try {
    const storage = await getStorage()

    if (storage.type === "d1") {
      // Usando D1
      await storage.db
        .prepare(`
          UPDATE contacts SET 
            name = ?, email = ?, phone = ?, cpf = ?, city = ?,
            category = ?, business_category = ?, temperature = ?, client_value = ?,
            contact_preference = ?, lead_source = ?, last_contact_date = ?, notes = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `)
        .bind(
          contact.name,
          contact.email,
          contact.phone,
          contact.cpf || null,
          contact.city || null,
          contact.category || "5",
          contact.business_category || "13",
          contact.temperature || "2",
          contact.client_value || "2",
          contact.contact_preference || "1",
          contact.lead_source || null,
          contact.last_contact_date || null,
          contact.notes || null,
          contact.id,
        )
        .run()
    } else {
      // Usando armazenamento local
      localContacts = localContacts.map((c) => {
        if (c.id === contact.id) {
          return {
            ...contact,
            category_name: localCategories.find((cat) => cat.id === contact.category)?.name,
            category_color: localCategories.find((cat) => cat.id === contact.category)?.color,
            business_category_name: localBusinessCategories.find((bc) => bc.id === contact.business_category)?.name,
            temperature_name: localTemperatureLevels.find((t) => t.id === contact.temperature)?.name,
            temperature_color: localTemperatureLevels.find((t) => t.id === contact.temperature)?.color,
            client_value_name: localClientValues.find((v) => v.id === contact.client_value)?.name,
            client_value_color: localClientValues.find((v) => v.id === contact.client_value)?.color,
            contact_preference_name: localContactPreferences.find((p) => p.id === contact.contact_preference)?.name,
            contact_preference_icon: localContactPreferences.find((p) => p.id === contact.contact_preference)?.icon,
            lead_source_name: localLeadSources.find((s) => s.id === contact.lead_source)?.name,
          }
        }
        return c
      })
    }

    revalidatePath("/")
    revalidatePath(`/contato/${contact.id}`)
    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar contato:", error)
    return { success: false, error }
  }
}

export async function deleteContact(id: string) {
  try {
    const storage = await getStorage()

    if (storage.type === "d1") {
      // Usando D1
      await storage.db.prepare("DELETE FROM contacts WHERE id = ?").bind(id).run()
    } else {
      // Usando armazenamento local
      localContacts = localContacts.filter((c) => c.id !== id)
    }

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir contato:", error)
    return { success: false, error }
  }
}

export async function addInteraction(interaction: Omit<Interaction, "id" | "date">) {
  try {
    const storage = await getStorage()
    const id = crypto.randomUUID()

    if (storage.type === "d1") {
      // Usando D1
      await storage.db
        .prepare("INSERT INTO interactions (id, contact_id, type, notes) VALUES (?, ?, ?, ?)")
        .bind(id, interaction.contact_id, interaction.type, interaction.notes || "")
        .run()
    } else {
      // Usando armazenamento local
      localInteractions.push({
        ...interaction,
        id,
        date: new Date().toISOString(),
      })
    }

    revalidatePath(`/contato/${interaction.contact_id}`)
    return { success: true }
  } catch (error) {
    console.error("Erro ao adicionar interação:", error)
    return { success: false, error }
  }
}

export async function getInteractions(contactId: string) {
  try {
    const storage = await getStorage()

    if (storage.type === "d1") {
      // Usando D1
      const { results } = await storage.db
        .prepare("SELECT * FROM interactions WHERE contact_id = ? ORDER BY date DESC")
        .bind(contactId)
        .all()

      return results as Interaction[]
    } else {
      // Usando armazenamento local
      return localInteractions.filter((i) => i.contact_id === contactId)
    }
  } catch (error) {
    console.error("Erro ao buscar interações:", error)
    return []
  }
}

export async function exportContactsToCSV() {
  try {
    // Buscar todos os contatos sem paginação
    const result = await getContacts(undefined, undefined, undefined, undefined, 1, Number.MAX_SAFE_INTEGER)
    const contacts = result.contacts

    if (contacts.length === 0) {
      return { success: false, error: "Nenhum contato para exportar" }
    }

    const fields = [
      "id",
      "name",
      "email",
      "phone",
      "cpf",
      "city",
      "category_name",
      "business_category_name",
      "temperature_name",
      "client_value_name",
      "contact_preference_name",
      "lead_source_name",
      "last_contact_date",
      "discovery_date",
      "notes",
    ]
    const opts = { fields }

    const csv = parse(contacts, opts)
    return { success: true, data: csv }
  } catch (error) {
    console.error("Erro ao exportar contatos:", error)
    return { success: false, error }
  }
}

// Adicione esta função ao arquivo actions.ts
export async function importContacts(formData: FormData) {
  let addedCount = 0 // Declare addedCount here
  try {
    const file = formData.get("file") as File
    if (!file) {
      return { success: false, error: "Nenhum arquivo enviado" }
    }

    const fileType = file.name.split(".").pop()?.toLowerCase()
    let contacts: any[] = []

    // Processar o arquivo de acordo com o tipo
    if (fileType === "csv") {
      // Processar CSV
      const content = await file.text()
      contacts = csvParse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      })
    } else if (fileType === "xlsx") {
      // Processar XLSX
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: "array" })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      contacts = XLSX.utils.sheet_to_json(worksheet)
    } else {
      return { success: false, error: "Formato de arquivo não suportado" }
    }

    if (contacts.length === 0) {
      return { success: false, error: "O arquivo não contém dados" }
    }

    // Validar e mapear os dados
    const validContacts = []
    const errors = []

    for (let i = 0; i < contacts.length; i++) {
      const row = contacts[i]
      const rowNumber = i + 2 // +2 porque a linha 1 é o cabeçalho

      // Verificar campos obrigatórios
      if (!row.nome || !row.email || !row.telefone) {
        errors.push(`Linha ${rowNumber}: Campos obrigatórios ausentes (nome, email, telefone)`)
        continue
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(row.email)) {
        errors.push(`Linha ${rowNumber}: Email inválido`)
        continue
      }

      // Mapear para o formato esperado pelo banco de dados
      const contact = {
        id: crypto.randomUUID(),
        name: row.nome,
        email: row.email,
        phone: row.telefone,
        cpf: row.cpf || null,
        city: row.cidade || null,
        category: row.categoria || "5", // Categoria padrão "Outros"
        business_category: row.categoria_negocio || "13", // Categoria de negócio padrão "Outro"
        temperature: row.temperatura || "2", // Temperatura padrão "Morno"
        client_value: row.valor_cliente || "2", // Valor padrão "Médio"
        contact_preference: row.preferencia_contato || "1", // Preferência padrão "WhatsApp"
        lead_source: row.fonte_captacao || null,
        last_contact_date: row.ultimo_contato ? new Date(row.ultimo_contato).toISOString() : null,
        discovery_date: row.data_descoberta ? new Date(row.data_descoberta).toISOString() : new Date().toISOString(),
        notes: row.observacoes || null,
      }

      validContacts.push(contact)
    }

    if (validContacts.length === 0) {
      return {
        success: false,
        error: "Nenhum contato válido encontrado no arquivo",
        details: errors,
      }
    }

    // Adicionar contatos ao banco de dados
    const storage = await getStorage()

    if (storage.type === "d1") {
      // Usando D1 - Inserir em lote
      // Primeiro, verificar quais emails já existem para evitar duplicatas
      const emailsToCheck = validContacts.map((contact) => contact.email)

      // Consulta para verificar emails existentes
      let existingEmails: string[] = []
      if (emailsToCheck.length > 0) {
        try {
          // Dividir em lotes menores para evitar problemas com consultas muito grandes
          const batchSize = 50
          for (let i = 0; i < emailsToCheck.length; i += batchSize) {
            const batch = emailsToCheck.slice(i, i + batchSize)
            const placeholders = batch.map(() => "?").join(",")

            const query = `SELECT email FROM contacts WHERE email IN (${placeholders})`
            const { results } = await storage.db
              .prepare(query)
              .bind(...batch)
              .all()

            existingEmails = existingEmails.concat(results.map((r: any) => r.email))
          }
        } catch (error) {
          console.error("Erro ao verificar emails existentes:", error)
        }
      }

      // Filtrar contatos que já existem
      const newContacts = validContacts.filter((contact) => !existingEmails.includes(contact.email))
      console.log(`${existingEmails.length} contatos já existem e serão ignorados.`)

      if (newContacts.length === 0) {
        return {
          success: true,
          total: validContacts.length,
          added: 0,
          skipped: existingEmails.length,
          message: "Todos os contatos já existem no banco de dados.",
        }
      }

      // Preparar as inserções apenas para novos contatos
      const batch = newContacts.map((contact) => {
        return storage.db
          .prepare(`
            INSERT INTO contacts (
              id, name, email, phone, cpf, city, 
              category, business_category, temperature, client_value, 
              contact_preference, lead_source, last_contact_date, discovery_date, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `)
          .bind(
            contact.id,
            contact.name,
            contact.email,
            contact.phone,
            contact.cpf,
            contact.city,
            contact.category,
            contact.business_category,
            contact.temperature,
            contact.client_value,
            contact.contact_preference,
            contact.lead_source,
            contact.last_contact_date,
            contact.discovery_date,
            contact.notes,
          )
      })

      try {
        // Executar as inserções em lote
        if (batch.length > 0) {
          await storage.db.batch(batch)
          addedCount = newContacts.length
        }
      } catch (error) {
        console.error("Erro ao inserir contatos em lote:", error)

        // Tentar inserir um por um para identificar quais falharam
        for (const contact of newContacts) {
          try {
            await storage.db
              .prepare(`
                INSERT INTO contacts (
                  id, name, email, phone, cpf, city, 
                  category, business_category, temperature, client_value, 
                  contact_preference, lead_source, last_contact_date, discovery_date, notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `)
              .bind(
                contact.id,
                contact.name,
                contact.email,
                contact.phone,
                contact.cpf,
                contact.city,
                contact.category,
                contact.business_category,
                contact.temperature,
                contact.client_value,
                contact.contact_preference,
                contact.lead_source,
                contact.last_contact_date,
                contact.discovery_date,
                contact.notes,
              )
              .run()

            addedCount++
          } catch (err) {
            console.error(`Erro ao inserir contato ${contact.email}:`, err)
          }
        }
      }

      return {
        success: true,
        total: validContacts.length,
        added: addedCount,
        skipped: existingEmails.length,
        errors: errors.length > 0 ? errors : undefined,
      }
    } else {
      // Usando armazenamento local
      // Verificar emails existentes
      const existingEmails = localContacts.map((c) => c.email)

      // Filtrar contatos que já existem
      const newContacts = validContacts.filter((contact) => !existingEmails.includes(contact.email))
      console.log(`${validContacts.length - newContacts.length} contatos já existem e serão ignorados.`)

      // Adicionar apenas novos contatos
      for (const contact of newContacts) {
        try {
          const newContact = {
            ...contact,
            category_name: localCategories.find((c) => c.id === contact.category)?.name,
            category_color: localCategories.find((c) => c.id === contact.category)?.color,
            business_category_name: localBusinessCategories.find((c) => c.id === contact.business_category)?.name,
            temperature_name: localTemperatureLevels.find((t) => t.id === contact.temperature)?.name,
            temperature_color: localTemperatureLevels.find((t) => t.id === contact.temperature)?.color,
            client_value_name: localClientValues.find((v) => v.id === contact.client_value)?.name,
            client_value_color: localClientValues.find((v) => v.id === contact.client_value)?.color,
            contact_preference_name: localContactPreferences.find((p) => p.id === contact.contact_preference)?.name,
            contact_preference_icon: localContactPreferences.find((p) => p.id === contact.contact_preference)?.icon,
            lead_source_name: localLeadSources.find((s) => s.id === contact.lead_source)?.name,
          }
          localContacts.push(newContact)
          addedCount++
        } catch (err) {
          console.error(`Erro ao inserir contato ${contact.email}:`, err)
        }
      }

      revalidatePath("/")
      return {
        success: true,
        total: validContacts.length,
        added: addedCount,
        skipped: validContacts.length - newContacts.length,
        errors: errors.length > 0 ? errors : undefined,
      }
    }
  } catch (error) {
    console.error("Erro ao importar contatos:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao processar o arquivo",
    }
  }
}

export async function getDashboardStats() {
  try {
    const storage = await getStorage()

    if (storage.type === "d1") {
      // Usando D1
      // Total de contatos
      const totalResult = await storage.db.prepare("SELECT COUNT(*) as total FROM contacts").all()
      const total = (totalResult.results[0] as any).total

      // Contatos por temperatura
      const tempResult = await storage.db
        .prepare(`
        SELECT t.name, t.color, COUNT(c.id) as count 
        FROM contacts c 
        JOIN temperature_levels t ON c.temperature = t.id 
        GROUP BY c.temperature
      `)
        .all()

      // Contatos por categoria de negócio
      const bizCatResult = await storage.db
        .prepare(`
        SELECT b.name, COUNT(c.id) as count 
        FROM contacts c 
        JOIN business_categories b ON c.business_category = b.id 
        GROUP BY c.business_category
        ORDER BY count DESC
        LIMIT 5
      `)
        .all()

      // Contatos por valor
      const valueResult = await storage.db
        .prepare(`
        SELECT v.name, v.color, COUNT(c.id) as count 
        FROM contacts c 
        JOIN client_values v ON c.client_value = v.id 
        GROUP BY c.client_value
      `)
        .all()

      return {
        totalContacts: total,
        byTemperature: tempResult.results,
        byBusinessCategory: bizCatResult.results,
        byValue: valueResult.results,
      }
    } else {
      // Usando armazenamento local
      const total = localContacts.length

      // Agrupar por temperatura
      const byTemperature = localTemperatureLevels.map((temp) => {
        const count = localContacts.filter((c) => c.temperature === temp.id).length
        return { name: temp.name, color: temp.color, count }
      })

      // Agrupar por categoria de negócio (top 5)
      const bizCatCounts = localBusinessCategories
        .map((cat) => {
          const count = localContacts.filter((c) => c.business_category === cat.id).length
          return { name: cat.name, count }
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      // Agrupar por valor
      const byValue = localClientValues.map((val) => {
        const count = localContacts.filter((c) => c.client_value === val.id).length
        return { name: val.name, color: val.color, count }
      })

      return {
        totalContacts: total,
        byTemperature,
        byBusinessCategory: bizCatCounts,
        byValue,
      }
    }
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error)
    return {
      totalContacts: 0,
      byTemperature: [],
      byBusinessCategory: [],
      byValue: [],
    }
  }
}
