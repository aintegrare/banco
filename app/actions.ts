"use server"

import { revalidatePath } from "next/cache"
import type { Contact } from "@/components/contact-list"

// Armazenamento local para desenvolvimento/preview
let localContacts: Contact[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@exemplo.com",
    phone: "(11) 98765-4321",
  },
  {
    id: "2",
    name: "Maria Oliveira",
    email: "maria@exemplo.com",
    phone: "(21) 91234-5678",
  },
]

// Função para acessar o D1 com fallback para armazenamento local
async function getStorage() {
  try {
    // @ts-ignore - D1 é uma binding do Cloudflare
    const db = process.env.D1_DATABASE

    if (db) {
      console.log("Usando banco de dados D1")
      return {
        type: "d1",
        db,
      }
    } else {
      console.log("D1_DATABASE não encontrado, usando armazenamento local")
      return {
        type: "local",
        db: null,
      }
    }
  } catch (error) {
    console.log("Erro ao acessar D1, usando armazenamento local", error)
    return {
      type: "local",
      db: null,
    }
  }
}

export async function getContacts(query?: string) {
  try {
    const storage = await getStorage()

    if (storage.type === "d1") {
      // Usando D1
      let sql = "SELECT * FROM contacts"
      const params: any[] = []

      if (query) {
        sql += " WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?"
        const searchParam = `%${query}%`
        params.push(searchParam, searchParam, searchParam)
      }

      sql += " ORDER BY created_at DESC"

      const { results } = await storage.db
        .prepare(sql)
        .bind(...params)
        .all()

      return results as Contact[]
    } else {
      // Usando armazenamento local
      if (!query) return localContacts

      return localContacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(query.toLowerCase()) ||
          contact.email.toLowerCase().includes(query.toLowerCase()) ||
          contact.phone.includes(query),
      )
    }
  } catch (error) {
    console.error("Erro ao buscar contatos:", error)
    return localContacts // Fallback para dados locais em caso de erro
  }
}

export async function addContact(contact: Contact) {
  try {
    const storage = await getStorage()

    if (storage.type === "d1") {
      // Usando D1
      await storage.db
        .prepare("INSERT INTO contacts (id, name, email, phone) VALUES (?, ?, ?, ?)")
        .bind(contact.id, contact.name, contact.email, contact.phone)
        .run()
    } else {
      // Usando armazenamento local
      localContacts.push(contact)
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
        .prepare("UPDATE contacts SET name = ?, email = ?, phone = ? WHERE id = ?")
        .bind(contact.name, contact.email, contact.phone, contact.id)
        .run()
    } else {
      // Usando armazenamento local
      localContacts = localContacts.map((c) => (c.id === contact.id ? contact : c))
    }

    revalidatePath("/")
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
