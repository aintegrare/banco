"use client"

import { useEffect } from "react"

import { openDB, type IDBPDatabase } from "idb"
import { useToast } from "@/components/ui/use-toast"

// Definição de tipos
export interface SyncItem {
  id: string | number
  collection: string
  data: any
  operation: "create" | "update" | "delete"
  timestamp: number
  synced: boolean
}

// Nome do banco de dados
const DB_NAME = "integrare-offline-db"
const DB_VERSION = 1

// Inicializar o banco de dados
async function initDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Armazenar itens para sincronização
      if (!db.objectStoreNames.contains("sync_queue")) {
        const syncStore = db.createObjectStore("sync_queue", { keyPath: "id" })
        syncStore.createIndex("collection", "collection", { unique: false })
        syncStore.createIndex("timestamp", "timestamp", { unique: false })
        syncStore.createIndex("synced", "synced", { unique: false })
      }

      // Armazenar dados offline
      if (!db.objectStoreNames.contains("offline_data")) {
        const dataStore = db.createObjectStore("offline_data", { keyPath: "id" })
        dataStore.createIndex("collection", "collection", { unique: false })
        dataStore.createIndex("lastUpdated", "lastUpdated", { unique: false })
      }
    },
  })
}

// Classe principal de sincronização
export class OfflineSync {
  private db: Promise<IDBPDatabase>
  private syncInProgress = false
  private toast: ReturnType<typeof useToast> | null = null

  constructor() {
    this.db = initDB()
  }

  setToast(toast: ReturnType<typeof useToast>) {
    this.toast = toast
  }

  // Adicionar item à fila de sincronização
  async queueItem(collection: string, data: any, operation: "create" | "update" | "delete"): Promise<string> {
    const db = await this.db
    const id = `${collection}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    const syncItem: SyncItem = {
      id,
      collection,
      data,
      operation,
      timestamp: Date.now(),
      synced: false,
    }

    await db.add("sync_queue", syncItem)

    // Se estiver online, tente sincronizar imediatamente
    if (navigator.onLine) {
      this.syncQueue()
    }

    return id
  }

  // Armazenar dados para uso offline
  async storeOfflineData(collection: string, id: string | number, data: any): Promise<void> {
    const db = await this.db
    await db.put("offline_data", {
      id: `${collection}_${id}`,
      collection,
      data,
      lastUpdated: Date.now(),
    })
  }

  // Obter dados offline
  async getOfflineData(collection: string, id: string | number): Promise<any | null> {
    const db = await this.db
    try {
      const item = await db.get("offline_data", `${collection}_${id}`)
      return item ? item.data : null
    } catch (error) {
      console.error("Erro ao obter dados offline:", error)
      return null
    }
  }

  // Obter todos os dados de uma coleção
  async getAllOfflineData(collection: string): Promise<any[]> {
    const db = await this.db
    const tx = db.transaction("offline_data", "readonly")
    const index = tx.store.index("collection")
    const items = await index.getAll(collection)
    return items.map((item) => item.data)
  }

  // Sincronizar a fila com o servidor
  async syncQueue(): Promise<void> {
    // Evitar múltiplas sincronizações simultâneas
    if (this.syncInProgress || !navigator.onLine) return

    this.syncInProgress = true
    const db = await this.db

    try {
      // Obter itens não sincronizados
      const tx = db.transaction("sync_queue", "readwrite")
      const index = tx.store.index("synced")
      const unsyncedItems = await index.getAll(false)

      if (unsyncedItems.length === 0) {
        this.syncInProgress = false
        return
      }

      // Processar cada item
      for (const item of unsyncedItems) {
        try {
          await this.processSyncItem(item)
          // Marcar como sincronizado
          item.synced = true
          await tx.store.put(item)
        } catch (error) {
          console.error(`Erro ao sincronizar item ${item.id}:`, error)
          // Manter o item na fila para tentar novamente
        }
      }

      // Notificar o usuário
      if (this.toast) {
        this.toast.toast({
          title: "Sincronização concluída",
          description: `${unsyncedItems.length} itens sincronizados com sucesso.`,
          duration: 3000,
        })
      }
    } catch (error) {
      console.error("Erro durante a sincronização:", error)
      if (this.toast) {
        this.toast.toast({
          title: "Erro de sincronização",
          description: "Não foi possível sincronizar alguns itens. Tentaremos novamente mais tarde.",
          variant: "destructive",
          duration: 5000,
        })
      }
    } finally {
      this.syncInProgress = false
    }
  }

  // Processar um item da fila de sincronização
  private async processSyncItem(item: SyncItem): Promise<void> {
    const { collection, data, operation } = item

    // Construir a URL da API
    let url = `/api/sync/${collection}`
    let method = "POST"

    if (operation === "update") {
      url = `${url}/${data.id}`
      method = "PUT"
    } else if (operation === "delete") {
      url = `${url}/${data.id}`
      method = "DELETE"
    }

    // Enviar para o servidor
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: operation !== "delete" ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      throw new Error(`Erro ao sincronizar: ${response.status} ${response.statusText}`)
    }
  }

  // Limpar itens sincronizados antigos
  async cleanupSyncedItems(olderThanDays = 7): Promise<void> {
    const db = await this.db
    const tx = db.transaction("sync_queue", "readwrite")
    const index = tx.store.index("synced")
    const syncedItems = await index.getAll(true)

    const cutoffTime = Date.now() - olderThanDays * 24 * 60 * 60 * 1000

    for (const item of syncedItems) {
      if (item.timestamp < cutoffTime) {
        await tx.store.delete(item.id)
      }
    }
  }
}

// Instância singleton
export const offlineSync = new OfflineSync()

// Hook para usar a sincronização em componentes
export function useOfflineSync() {
  const toast = useToast()

  useEffect(() => {
    offlineSync.setToast(toast)

    // Tentar sincronizar quando a conexão for restaurada
    const handleOnline = () => {
      offlineSync.syncQueue()
    }

    window.addEventListener("online", handleOnline)

    // Limpar itens antigos na inicialização
    offlineSync.cleanupSyncedItems()

    return () => {
      window.removeEventListener("online", handleOnline)
    }
  }, [toast])

  return offlineSync
}
