import { reactive } from 'vue'

export type NotificationVariant = 'success' | 'danger' | 'warning' | 'info'

export interface NotificationItem {
  id: number
  variant: NotificationVariant
  title?: string
  message: string
  duration: number
}

interface NotifyOptions {
  variant?: NotificationVariant
  title?: string
  duration?: number
}

let nextId = 1
const items = reactive<NotificationItem[]>([])

function dismiss(id: number) {
  const index = items.findIndex((item) => item.id === id)
  if (index !== -1) items.splice(index, 1)
}

function notify(message: string, options: NotifyOptions = {}) {
  const id = nextId++
  const duration = options.duration ?? 4000

  items.push({
    id,
    message,
    variant: options.variant ?? 'info',
    title: options.title,
    duration,
  })

  if (duration > 0) {
    setTimeout(() => dismiss(id), duration)
  }

  return id
}

// Estado en closure a proposito: es un singleton compartido por toda la app,
// sin depender de Pinia ni de que el consumidor tenga un store instalado.
export function useNotifications() {
  return {
    items,
    notify,
    dismiss,
    success: (message: string, title?: string) => notify(message, { variant: 'success', title }),
    danger: (message: string, title?: string) => notify(message, { variant: 'danger', title }),
    warning: (message: string, title?: string) => notify(message, { variant: 'warning', title }),
    info: (message: string, title?: string) => notify(message, { variant: 'info', title }),
  }
}
