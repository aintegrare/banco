"use client"

import { useState, useEffect } from "react"

// Interface para configuração da sincronização offline
export interface OfflineSyncConfig {
  enabled: boolean
  syncInterval: number // em milissegundos
  maxRetries: number
  collections: string[]
}

// Estado da sincronização
export interface SyncState {
  lastSync: Date | null
  pendingChanges: number
  isOnline: boolean
  isSyncing: boolean
  error: string | null
}

// Configuração padrão
const defaultConfig: OfflineSyncConfig = {
  enabled: true,
  syncInterval: 60000, // 1 minuto
  maxRetries: 5,
  collections: ["posts", "projects", "tasks", "clients"],
}

// Classe para gerenciar sincronização offline
export class OfflineSync {
  private config: OfflineSyncConfig
  private syncState: SyncState
  private syncInterval: NodeJS.Timeout | null = null
  private listeners: ((state: SyncState) => void)[] = []

  constructor(config?: Partial<OfflineSyncConfig>) {
    this.config = { ...defaultConfig, ...config }
    this.syncState = {
      lastSync: null,
      pendingChanges: 0,
      isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
      isSyncing: false,
      error: null,
    }

    // Inicializar apenas no cliente
    if (typeof window !== "undefined") {
      this.initialize()
    }
  }

  // Inicializar eventos e sincronização
  private initialize() {
    // Monitorar estado da conexão
    window.addEventListener("online", this.handleOnline)
    window.addEventListener("offline", this.handleOffline)

    // Carregar estado do localStorage
    this.loadState()

    // Iniciar sincronização periódica se estiver online
    if (this.config.enabled && this.syncState.isOnline) {
      this.startSyncInterval()
    }
  }

  // Manipulador para evento online
  private handleOnline = () => {
    this.syncState.isOnline = true
    this.notifyListeners()

    // Tentar sincronizar imediatamente quando ficar online
    if (this.config.enabled && this.syncState.pendingChanges > 0) {
      this.sync()
    }

    // Reiniciar intervalo de sincronização
    this.startSyncInterval()
  }

  // Manipulador para evento offline
  private handleOffline = () => {
    this.syncState.isOnline = false
    this.notifyListeners()

    // Parar intervalo de sincronização
    this.stopSyncInterval()
  }

  // Iniciar intervalo de sincronização
  private startSyncInterval() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }

    this.syncInterval = setInterval(() => {
      if (this.config.enabled && this.syncState.isOnline) {
        this.sync()
      }
    }, this.config.syncInterval)
  }

  // Parar intervalo de sincronização
  private stopSyncInterval() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  // Carregar estado do localStorage
  private loadState() {
    try {
      const savedState = localStorage.getItem("offline_sync_state")
      if (savedState) {
        const parsedState = JSON.parse(savedState)
        this.syncState = {
          ...this.syncState,
          lastSync: parsedState.lastSync ? new Date(parsedState.lastSync) : null,
          pendingChanges: parsedState.pendingChanges || 0,
        }
      }

      // Carregar mudanças pendentes
      this.loadPendingChanges()
    } catch (error) {
      console.error("Erro ao carregar estado de sincronização:", error)
    }
  }

  // Salvar estado no localStorage
  private saveState() {
    try {
      localStorage.setItem(
        "offline_sync_state",
        JSON.stringify({
          lastSync: this.syncState.lastSync?.toISOString(),
          pendingChanges: this.syncState.pendingChanges,
        }),
      )
    } catch (error) {
      console.error("Erro ao salvar estado de sincronização:", error)
    }
  }

  // Carregar mudanças pendentes
  private loadPendingChanges() {
    let totalChanges = 0

    this.config.collections.forEach((collection) => {
      try {
        const pendingChanges = localStorage.getItem(`offline_changes_${collection}`)
        if (pendingChanges) {
          const changes = JSON.parse(pendingChanges)
          totalChanges += changes.length
        }
      } catch (error) {
        console.error(`Erro ao carregar mudanças pendentes para ${collection}:`, error)
      }
    })

    this.syncState.pendingChanges = totalChanges
    this.notifyListeners()
  }

  // Sincronizar dados com o servidor
  public async sync(): Promise<boolean> {
    // Não sincronizar se já estiver sincronizando ou offline
    if (this.syncState.isSyncing || !this.syncState.isOnline) {
      return false
    }

    try {
      this.syncState.isSyncing = true
      this.syncState.error = null
      this.notifyListeners()

      // Processar cada coleção
      for (const collection of this.config.collections) {
        await this.syncCollection(collection)
      }

      // Atualizar estado após sincronização bem-sucedida
      this.syncState.lastSync = new Date()
      this.syncState.pendingChanges = 0
      this.syncState.isSyncing = false
      this.saveState()
      this.notifyListeners()

      return true
    } catch (error) {
      this.syncState.isSyncing = false
      this.syncState.error = error instanceof Error ? error.message : "Erro desconhecido durante sincronização"
      this.notifyListeners()
      console.error("Erro durante sincronização:", error)
      return false
    }
  }

  // Sincronizar uma coleção específica
  private async syncCollection(collection: string): Promise<void> {
    try {
      const pendingChangesKey = `offline_changes_${collection}`
      const pendingChanges = localStorage.getItem(pendingChangesKey)

      if (!pendingChanges) {
        return // Nenhuma mudança pendente
      }

      const changes = JSON.parse(pendingChanges)
      if (changes.length === 0) {
        return // Array vazio
      }

      // Enviar mudanças para o servidor
      const response = await fetch(`/api/sync/${collection}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ changes }),
      })

      if (!response.ok) {
        throw new Error(`Erro ao sincronizar ${collection}: ${response.statusText}`)
      }

      // Limpar mudanças sincronizadas
      localStorage.removeItem(pendingChangesKey)
    } catch (error) {
      console.error(`Erro ao sincronizar coleção ${collection}:`, error)
      throw error
    }
  }

  // Adicionar uma mudança para sincronização posterior
  public addChange(collection: string, change: any): void {
    try {
      const pendingChangesKey = `offline_changes_${collection}`
      let changes = []

      // Carregar mudanças existentes
      const existingChanges = localStorage.getItem(pendingChangesKey)
      if (existingChanges) {
        changes = JSON.parse(existingChanges)
      }

      // Adicionar nova mudança
      changes.push({
        ...change,
        timestamp: new Date().toISOString(),
      })

      // Salvar mudanças
      localStorage.setItem(pendingChangesKey, JSON.stringify(changes))

      // Atualizar estado
      this.syncState.pendingChanges += 1
      this.saveState()
      this.notifyListeners()

      // Tentar sincronizar se estiver online
      if (this.config.enabled && this.syncState.isOnline) {
        this.sync()
      }
    } catch (error) {
      console.error(`Erro ao adicionar mudança para ${collection}:`, error)
    }
  }

  // Registrar listener para mudanças de estado
  public subscribe(listener: (state: SyncState) => void): () => void {
    this.listeners.push(listener)

    // Notificar imediatamente com o estado atual
    listener({ ...this.syncState })

    // Retornar função para cancelar inscrição
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  // Notificar todos os listeners
  private notifyListeners(): void {
    const state = { ...this.syncState }
    this.listeners.forEach((listener) => listener(state))
  }

  // Limpar recursos ao desmontar
  public dispose(): void {
    if (typeof window !== "undefined") {
      window.removeEventListener("online", this.handleOnline)
      window.removeEventListener("offline", this.handleOffline)
    }

    this.stopSyncInterval()
  }

  // Obter estado atual
  public getState(): SyncState {
    return { ...this.syncState }
  }

  // Habilitar/desabilitar sincronização
  public setEnabled(enabled: boolean): void {
    this.config.enabled = enabled

    if (enabled && this.syncState.isOnline) {
      this.startSyncInterval()
    } else {
      this.stopSyncInterval()
    }
  }
}

// Instância global
let syncInstance: OfflineSync | null = null

// Obter instância singleton
export function getOfflineSync(config?: Partial<OfflineSyncConfig>): OfflineSync {
  if (!syncInstance && typeof window !== "undefined") {
    syncInstance = new OfflineSync(config)
  }
  return syncInstance as OfflineSync
}

// Hook para usar sincronização offline em componentes
export function useOfflineSync() {
  const [syncState, setSyncState] = useState<SyncState>({
    lastSync: null,
    pendingChanges: 0,
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
    isSyncing: false,
    error: null,
  })

  useEffect(() => {
    const sync = getOfflineSync()
    const unsubscribe = sync.subscribe(setSyncState)

    return () => {
      unsubscribe()
    }
  }, [])

  return {
    ...syncState,
    sync: () => getOfflineSync().sync(),
    addChange: (collection: string, change: any) => getOfflineSync().addChange(collection, change),
  }
}
