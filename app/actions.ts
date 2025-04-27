"use server"

import { revalidatePath } from "next/cache"
import type { Contact } from "@/components/contact-list"

// Função para acessar o D1 - simplificada
async function getD1() {
  // @ts-ignore - D1 é uma binding do Cloudflare
  const db = process.env.D1_DATABASE

  if (!db) {
    console.error("D1_DATABASE binding não encontrada")
    throw new Error("Banco de dados não configurado corretamente")
  }

  return db
}

// Exemplo de como usar o D1 para buscar contatos
export async function getContacts(query?: string) {
  try {
    const db = await getD1()

    let statement = "SELECT * FROM contacts"
    if (query) {
      statement += ` WHERE name LIKE '%${query}%' OR email LIKE '%${query}%' OR phone LIKE '%${query}%'`
    }

    const { results } = await db.prepare(statement).all()

    return results as Contact[]
  } catch (error) {
    console.error("Erro ao buscar contatos:", error)
    return []
  }
}

export async function addContact(contact: Contact) {
  try {
    const db = await getD1()
    await db
      .prepare("INSERT INTO contacts (id, name, email, phone) VALUES (?, ?, ?, ?)")
      .bind(contact.id, contact.name, contact.email, contact.phone)
      .run()

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Erro ao adicionar contato:", error)
    return { success: false, error }
  }
}

export async function updateContact(contact: Contact) {
  try {
    const db = await getD1()
    await db
      .prepare("UPDATE contacts SET name = ?, email = ?, phone = ? WHERE id = ?")
      .bind(contact.name, contact.email, contact.phone, contact.id)
      .run()

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar contato:", error)
    return { success: false, error }
  }
}

export async function deleteContact(id: string) {
  try {
    const db = await getD1()
    await db.prepare("DELETE FROM contacts WHERE id = ?").bind(id).run()

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Erro ao deletar contato:", error)
    return { success: false, error }
  }
}
