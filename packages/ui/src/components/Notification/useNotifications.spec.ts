import { afterEach, describe, expect, it, vi } from 'vitest'
import { useNotifications } from './useNotifications'

describe('useNotifications', () => {
  const { items } = useNotifications()

  afterEach(() => {
    items.splice(0, items.length)
    vi.useRealTimers()
  })

  it('agrega una notificacion a la cola', () => {
    const { notify, items } = useNotifications()
    notify('Hola', { variant: 'success', title: 'Titulo' })
    expect(items).toHaveLength(1)
    expect(items[0]).toMatchObject({ message: 'Hola', variant: 'success', title: 'Titulo' })
  })

  it('los helpers por variante setean el variant correcto', () => {
    const { success, danger, warning, info, items } = useNotifications()
    success('a')
    danger('b')
    warning('c')
    info('d')
    expect(items.map((i) => i.variant)).toEqual(['success', 'danger', 'warning', 'info'])
  })

  it('dismiss saca la notificacion de la cola', () => {
    const { notify, dismiss, items } = useNotifications()
    const id = notify('Hola')
    expect(items).toHaveLength(1)
    dismiss(id)
    expect(items).toHaveLength(0)
  })

  it('se auto-descarta despues de la duracion indicada', () => {
    vi.useFakeTimers()
    const { notify, items } = useNotifications()
    notify('Hola', { duration: 1000 })
    expect(items).toHaveLength(1)
    vi.advanceTimersByTime(1000)
    expect(items).toHaveLength(0)
  })

  it('con duration 0 no se auto-descarta', () => {
    vi.useFakeTimers()
    const { notify, items } = useNotifications()
    notify('Persistente', { duration: 0 })
    vi.advanceTimersByTime(10_000)
    expect(items).toHaveLength(1)
  })
})
