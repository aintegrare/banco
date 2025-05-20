"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "@/components/ui/use-toast"

// Interface para configuração da sincronização offline
export interface OfflineSyncConfig {
  collections: string[]
  syncInterval?: number // em milissegundos
  maxRetries?: number
  retryDelay?: number // em milissegundos
  storagePrefix?: string
}

// Interface para item pendente de sincronização
export interface PendingItem {
  id: string
  collection: string
  operation: "create" | "update" | "delete"
  data?: any
  timestamp: number
  retries?: number
}

// Estado global de sincronização
const syncState = {
  isOnline: true,
  pendingItems: [] as PendingItem[],
  isSyncing: false,
  lastSyncTime: 0,
  config: {
    collections: [],
    syncInterval: 60000, // 1 minuto
    maxRetries: 5,
    retryDelay: 5000, // 5 segundos
    storagePrefix: "offline_sync_",
  } as OfflineSyncConfig,
}

// Funções para gerenciar a sincronização offline
export const OfflineSync = {
  // Verificar se está online
  isOnline: (): boolean => {
    return syncState.isOnline
  },

  // Obter número de itens pendentes
  getPendingCount: (): number => {
    return syncState.pendingItems.length
  },

  // Configurar sincronização
  configure: (config: Partial<OfflineSyncConfig>): void => {
    syncState.config = {
      ...syncState.config,
      ...config,
    }

    // Salvar configuração no localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("offline_sync_config", JSON.stringify(syncState.config))
    }
  },

  // Adicionar item para sincronização
  addPendingItem: (item: Omit<PendingItem, "timestamp" | "retries">): void => {
    if (!syncState.config.collections.includes(item.collection)) {
      console.warn(`Collection ${item.collection} não está configurada para sincronização offline`)
      return
    }

    const pendingItem: PendingItem = {
      ...item,
      timestamp: Date.now(),
      retries: 0,
    }

    // Verificar se já existe um item com mesmo id e collection
    const existingIndex = syncState.pendingItems.findIndex((i) => i.id === item.id && i.collection === item.collection)

    if (existingIndex >= 0) {
      // Atualizar item existente
      syncState.pendingItems[existingIndex] = pendingItem
    } else {
      // Adicionar novo item
      syncState.pendingItems.push(pendingItem)
    }

    // Salvar no localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(`${syncState.config.storagePrefix}pending`, JSON.stringify(syncState.pendingItems))
    }

    // Notificar mudança
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("offline_sync_change"))
    }

    // Tentar sincronizar imediatamente se estiver online
    if (syncState.isOnline && !syncState.isSyncing) {
      OfflineSync.synchronize()
    }
  },

  // Remover item pendente
  removePendingItem: (id: string, collection: string): void => {
    const initialLength = syncState.pendingItems.length
    syncState.pendingItems = syncState.pendingItems.filter(
      (item) => !(item.id === id && item.collection === collection),
    )

    if (initialLength !== syncState.pendingItems.length) {
      // Salvar no localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(`${syncState.config.storagePrefix}pending`, JSON.stringify(syncState.pendingItems))
      }

      // Notificar mudança
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("offline_sync_change"))
      }
    }
  },

  // Sincronizar dados pendentes
  synchronize: async (): Promise<boolean> => {
    if (syncState.isSyncing || !syncState.isOnline || syncState.pendingItems.length === 0) {
      return false
    }

    syncState.isSyncing = true

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("offline_sync_start"))
    }

    try {
      // Ordenar itens por timestamp (mais antigos primeiro)
      const itemsToSync = [...syncState.pendingItems].sort((a, b) => a.timestamp - b.timestamp)

      let successCount = 0
      let failCount = 0

      for (const item of itemsToSync) {
        try {
          // Aqui você implementaria a lógica real de sincronização com o backend
          // Por exemplo, usando fetch para chamar suas APIs

          // Exemplo simplificado:
          const endpoint = `/api/${item.collection}${item.id ? `/${item.id}` : ""}`
          const method = item.operation === "delete" ? "DELETE" : item.operation === "create" ? "POST" : "PUT"

          const response = await fetch(endpoint, {
            method,
            headers: {
              "Content-Type": "application/json",
            },
            body: item.operation !== "delete" ? JSON.stringify(item.data) : undefined,
          })

          if (response.ok) {
            // Sincronização bem-sucedida, remover dos pendentes
            OfflineSync.removePendingItem(item.id, item.collection)
            successCount++
          } else {
            // Falha na sincronização
            if ((item.retries || 0) < syncState.config.maxRetries) {
              // Incrementar contagem de tentativas
              const updatedItem = {
                ...item,
                retries: (item.retries || 0) + 1,
              }

              // Atualizar item na lista
              const index = syncState.pendingItems.findIndex(
                (i) => i.id === item.id && i.collection === item.collection,
              )

              if (index >= 0) {
                syncState.pendingItems[index] = updatedItem
              }

              failCount++
            } else {
              // Excedeu número máximo de tentativas
              console.error(`Falha ao sincronizar item após ${syncState.config.maxRetries} tentativas:`, item)

              // Opcionalmente, pode mover para uma lista de "falhas permanentes"
              // ou simplesmente remover
              OfflineSync.removePendingItem(item.id, item.collection)

              failCount++
            }
          }
        } catch (error) {
          console.error("Erro ao sincronizar item:", error, item)
          failCount++

          // Incrementar contagem de tentativas
          if ((item.retries || 0) < syncState.config.maxRetries) {
            const updatedItem = {
              ...item,
              retries: (item.retries || 0) + 1,
            }

            // Atualizar item na lista
            const index = syncState.pendingItems.findIndex((i) => i.id === item.id && i.collection === item.collection)

            if (index >= 0) {
              syncState.pendingItems[index] = updatedItem
            }
          } else {
            // Excedeu número máximo de tentativas
            OfflineSync.removePendingItem(item.id, item.collection)
          }
        }
      }

      // Atualizar último tempo de sincronização
      syncState.lastSyncTime = Date.now()

      // Salvar estado atualizado no localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(`${syncState.config.storagePrefix}pending`, JSON.stringify(syncState.pendingItems))
        localStorage.setItem(`${syncState.config.storagePrefix}last_sync`, syncState.lastSyncTime.toString())
      }

      // Notificar resultado
      if (successCount > 0) {
        toast({
          title: "Sincronização concluída",
          description: `${successCount} item(s) sincronizado(s) com sucesso.${failCount > 0 ? ` ${failCount} falha(s).` : ""}`,
        })
      } else if (failCount > 0) {
        toast({
          title: "Falha na sincronização",
          description: `${failCount} item(s) não puderam ser sincronizados.`,
          variant: "destructive",
        })
      }

      return successCount > 0
    } catch (error) {
      console.error("Erro durante sincronização:", error)

      toast({
        title: "Erro de sincronização",
        description: "Ocorreu um erro durante a sincronização. Tente novamente mais tarde.",
        variant: "destructive",
      })

      return false
    } finally {
      syncState.isSyncing = false

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("offline_sync_end"))
      }
    }
  },

  // Verificar e atualizar estado de conexão
  checkConnection: async (): Promise<boolean> => {
    try {
      // Verificar conexão com o servidor
      // Isso pode ser uma chamada simples para um endpoint que retorna 200
      const response = await fetch("/api/ping", {
        method: "HEAD",
        cache: "no-store",
        headers: { "cache-control": "no-cache" },
      })

      const online = response.ok

      if (online !== syncState.isOnline) {
        syncState.isOnline = online

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("offline_sync_connection_change", {
              detail: { isOnline: online },
            }),
          )
        }

        // Se voltou a ficar online, tentar sincronizar
        if (online && syncState.pendingItems.length > 0) {
          setTimeout(() => OfflineSync.synchronize(), 1000)
        }
      }

      return online
    } catch (error) {
      // Se ocorrer um erro, provavelmente está offline
      if (syncState.isOnline) {
        syncState.isOnline = false

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("offline_sync_connection_change", {
              detail: { isOnline: false },
            }),
          )
        }
      }

      return false
    }
  },

  // Inicializar sistema de sincronização
  initialize: (): void => {
    if (typeof window === "undefined") {
      return // Não executar durante SSR
    }

    try {
      // Carregar configuração do localStorage
      const savedConfig = localStorage.getItem("offline_sync_config")
      if (savedConfig) {
        syncState.config = {
          ...syncState.config,
          ...JSON.parse(savedConfig),
        }
      }

      // Carregar itens pendentes
      const savedItems = localStorage.getItem(`${syncState.config.storagePrefix}pending`)
      if (savedItems) {
        syncState.pendingItems = JSON.parse(savedItems)
      }

      // Carregar último tempo de sincronização
      const lastSync = localStorage.getItem(`${syncState.config.storagePrefix}last_sync`)
      if (lastSync) {
        syncState.lastSyncTime = Number.parseInt(lastSync, 10)
      }

      // Verificar conexão inicial
      OfflineSync.checkConnection()

      // Configurar verificação periódica de conexão
      const connectionInterval = setInterval(
        OfflineSync.checkConnection,
        30000, // Verificar a cada 30 segundos
      )

      // Configurar sincronização periódica
      const syncInterval = setInterval(() => {
        if (syncState.isOnline && syncState.pendingItems.length > 0 && !syncState.isSyncing) {
          OfflineSync.synchronize()
        }
      }, syncState.config.syncInterval)

      // Limpar intervalos quando a janela for fechada
      window.addEventListener("beforeunload", () => {
        clearInterval(connectionInterval)
        clearInterval(syncInterval)
      })

      // Configurar listener para eventos de conexão do navegador
      window.addEventListener("online", () => {
        OfflineSync.checkConnection()
      })

      window.addEventListener("offline", () => {
        if (syncState.isOnline) {
          syncState.isOnline = false
          window.dispatchEvent(
            new CustomEvent("offline_sync_connection_change", {
              detail: { isOnline: false },
            }),
          )
        }
      })
    } catch (error) {
      console.error("Erro ao inicializar sincronização offline:", error)
    }
  },
}

// Hook para usar sincronização offline em componentes
export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    // Inicializar sistema de sincronização
    OfflineSync.initialize()

    // Definir estados iniciais
    setIsOnline(OfflineSync.isOnline())
    setPendingCount(OfflineSync.getPendingCount())

    // Configurar listeners para eventos
    const handleConnectionChange = (event: CustomEvent) => {
      setIsOnline(event.detail.isOnline)
    }

    const handleSyncChange = () => {
      setPendingCount(OfflineSync.getPendingCount())
    }

    const handleSyncStart = () => {
      setIsSyncing(true)
    }

    const handleSyncEnd = () => {
      setIsSyncing(false)
      setPendingCount(OfflineSync.getPendingCount())
    }

    window.addEventListener("offline_sync_connection_change", handleConnectionChange as EventListener)
    window.addEventListener("offline_sync_change", handleSyncChange)
    window.addEventListener("offline_sync_start", handleSyncStart)
    window.addEventListener("offline_sync_end", handleSyncEnd)

    return () => {
      window.removeEventListener("offline_sync_connection_change", handleConnectionChange as EventListener)
      window.removeEventListener("offline_sync_change", handleSyncChange)
      window.removeEventListener("offline_sync_start", handleSyncStart)
      window.removeEventListener("offline_sync_end", handleSyncEnd)
    }
  }, [])

  // Função para adicionar item pendente
  const addPendingItem = useCallback((item: Omit<PendingItem, "timestamp" | "retries">) => {
    OfflineSync.addPendingItem(item)
  }, [])

  // Função para sincronização manual
  const synchronize = useCallback(async () => {
    return await OfflineSync.synchronize()
  }, [])

  // Função para configurar sincronização
  const configure = useCallback((config: Partial<OfflineSyncConfig>) => {
    OfflineSync.configure(config)
  }, [])

  return {
    isOnline,
    pendingCount,
    isSyncing,
    addPendingItem,
    synchronize,
    configure,
  }
}
