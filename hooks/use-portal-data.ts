"use client"

import { useState, useEffect } from "react"
import { getSupabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import type { PortalLink, PortalTask, PortalContact } from "@/lib/supabase"

// Hook para gerenciar links
export function usePortalLinks() {
  const [links, setLinks] = useState<PortalLink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()
  const supabase = getSupabase()

  useEffect(() => {
    if (!user) return

    const fetchLinks = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from("portal_links")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error
        setLinks(data || [])
      } catch (err: any) {
        setError(err)
        console.error("Error fetching links:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLinks()
  }, [user])

  const addLink = async (link: Omit<PortalLink, "id" | "user_id" | "created_at">) => {
    if (!user) return { error: new Error("User not authenticated") }

    try {
      const { data, error } = await supabase
        .from("portal_links")
        .insert([{ ...link, user_id: user.id }])
        .select()

      if (error) throw error
      setLinks([...(data || []), ...links])
      return { data }
    } catch (err: any) {
      console.error("Error adding link:", err)
      return { error: err }
    }
  }

  const deleteLink = async (id: string) => {
    try {
      const { error } = await supabase.from("portal_links").delete().eq("id", id)
      if (error) throw error
      setLinks(links.filter((link) => link.id !== id))
      return { success: true }
    } catch (err: any) {
      console.error("Error deleting link:", err)
      return { error: err }
    }
  }

  return { links, isLoading, error, addLink, deleteLink }
}

// Hook para gerenciar tarefas
export function usePortalTasks() {
  const [tasks, setTasks] = useState<PortalTask[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()
  const supabase = getSupabase()

  useEffect(() => {
    if (!user) return

    const fetchTasks = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from("portal_tasks")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error
        setTasks(data || [])
      } catch (err: any) {
        setError(err)
        console.error("Error fetching tasks:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [user])

  const addTask = async (task: Omit<PortalTask, "id" | "user_id" | "created_at">) => {
    if (!user) return { error: new Error("User not authenticated") }

    try {
      const { data, error } = await supabase
        .from("portal_tasks")
        .insert([{ ...task, user_id: user.id }])
        .select()

      if (error) throw error
      setTasks([...(data || []), ...tasks])
      return { data }
    } catch (err: any) {
      console.error("Error adding task:", err)
      return { error: err }
    }
  }

  const toggleTaskCompletion = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase.from("portal_tasks").update({ completed }).eq("id", id)

      if (error) throw error
      setTasks(tasks.map((task) => (task.id === id ? { ...task, completed } : task)))
      return { success: true }
    } catch (err: any) {
      console.error("Error updating task:", err)
      return { error: err }
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase.from("portal_tasks").delete().eq("id", id)
      if (error) throw error
      setTasks(tasks.filter((task) => task.id !== id))
      return { success: true }
    } catch (err: any) {
      console.error("Error deleting task:", err)
      return { error: err }
    }
  }

  return { tasks, isLoading, error, addTask, toggleTaskCompletion, deleteTask }
}

// Hook para gerenciar contatos
export function usePortalContacts() {
  const [contacts, setContacts] = useState<PortalContact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()
  const supabase = getSupabase()

  useEffect(() => {
    if (!user) return

    const fetchContacts = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from("portal_contacts")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error
        setContacts(data || [])
      } catch (err: any) {
        setError(err)
        console.error("Error fetching contacts:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContacts()
  }, [user])

  const addContact = async (contact: Omit<PortalContact, "id" | "user_id" | "created_at">) => {
    if (!user) return { error: new Error("User not authenticated") }

    try {
      const { data, error } = await supabase
        .from("portal_contacts")
        .insert([{ ...contact, user_id: user.id }])
        .select()

      if (error) throw error
      setContacts([...(data || []), ...contacts])
      return { data }
    } catch (err: any) {
      console.error("Error adding contact:", err)
      return { error: err }
    }
  }

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase.from("portal_contacts").delete().eq("id", id)
      if (error) throw error
      setContacts(contacts.filter((contact) => contact.id !== id))
      return { success: true }
    } catch (err: any) {
      console.error("Error deleting contact:", err)
      return { error: err }
    }
  }

  return { contacts, isLoading, error, addContact, deleteContact }
}
