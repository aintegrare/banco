"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { ToastNotification, type NotificationType } from "./toast-notification"
import { v4 as uuidv4 } from "uuid"

interface Notification {
  id: string
  message: string
  type: NotificationType
  details?: string | null
  duration?: number
  actionLabel?: string
  onAction?: () => void
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id">) => string
  removeNotification: (id: string) => void
  clearNotifications: () => void
  success: (message: string, details?: string, options?: Partial<Notification>) => string
  error: (message: string, details?: string, options?: Partial<Notification>) => string
  info: (message: string, details?: string, options?: Partial<Notification>) => string
  warning: (message: string, details?: string, options?: Partial<Notification>) => string
  loading: (message: string, details?: string, options?: Partial<Notification>) => string
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, "id">) => {
    const id = uuidv4()
    setNotifications((prev) => [...prev, { ...notification, id }])
    return id
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const success = useCallback(
    (message: string, details?: string, options?: Partial<Notification>) => {
      return addNotification({
        message,
        type: "success",
        details: details || null,
        duration: 5000,
        ...options,
      })
    },
    [addNotification],
  )

  const error = useCallback(
    (message: string, details?: string, options?: Partial<Notification>) => {
      return addNotification({
        message,
        type: "error",
        details: details || null,
        duration: 8000, // Erros ficam visíveis por mais tempo
        ...options,
      })
    },
    [addNotification],
  )

  const info = useCallback(
    (message: string, details?: string, options?: Partial<Notification>) => {
      return addNotification({
        message,
        type: "info",
        details: details || null,
        duration: 5000,
        ...options,
      })
    },
    [addNotification],
  )

  const warning = useCallback(
    (message: string, details?: string, options?: Partial<Notification>) => {
      return addNotification({
        message,
        type: "warning",
        details: details || null,
        duration: 6000,
        ...options,
      })
    },
    [addNotification],
  )

  const loading = useCallback(
    (message: string, details?: string, options?: Partial<Notification>) => {
      return addNotification({
        message,
        type: "loading",
        details: details || null,
        duration: 0, // Notificações de carregamento não desaparecem automaticamente
        ...options,
      })
    },
    [addNotification],
  )

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
        success,
        error,
        info,
        warning,
        loading,
      }}
    >
      {children}
      <div className="notification-container">
        {notifications.map((notification) => (
          <ToastNotification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            details={notification.details}
            duration={notification.duration}
            actionLabel={notification.actionLabel}
            onAction={notification.onAction}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}
