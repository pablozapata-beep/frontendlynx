import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Modal from './Modal.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('Modal', () => {
  it('no renderiza nada cuando open es false', () => {
    mount(Modal, { props: { open: false } })
    expect(document.querySelector('.ui-modal-backdrop')).toBeNull()
  })

  it('renderiza el backdrop y el dialog cuando open es true', () => {
    mount(Modal, { props: { open: true } })
    expect(document.querySelector('.ui-modal-backdrop')).not.toBeNull()
    expect(document.querySelector('[role="dialog"]')).not.toBeNull()
  })

  it('renderiza los slots header/default/footer', () => {
    mount(Modal, {
      props: { open: true },
      slots: { header: 'Titulo', default: 'Cuerpo', footer: 'Pie' },
    })
    expect(document.querySelector('.ui-modal-header')?.textContent?.trim()).toBe('Titulo')
    expect(document.querySelector('.ui-modal-body')?.textContent?.trim()).toBe('Cuerpo')
    expect(document.querySelector('.ui-modal-footer')?.textContent?.trim()).toBe('Pie')
  })

  it('aplica sheetClass al .ui-modal-sheet, que vive fuera del arbol del componente por el Teleport', () => {
    mount(Modal, { props: { open: true, sheetClass: 'mi-modal' } })
    const sheet = document.querySelector('.ui-modal-sheet')
    expect(sheet?.classList.contains('mi-modal')).toBe(true)
    expect(document.querySelector('.ui-modal-backdrop')?.contains(sheet)).toBe(true)
  })

  it('emite close al clickear el boton de cerrar', () => {
    const wrapper = mount(Modal, { props: { open: true } })
    const closeBtn = document.querySelector('.ui-modal-close') as HTMLElement
    closeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('emite close al clickear el backdrop', () => {
    const wrapper = mount(Modal, { props: { open: true } })
    const backdrop = document.querySelector('.ui-modal-backdrop') as HTMLElement
    backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('no emite close al clickear el backdrop si closeOnBackdrop es false', () => {
    const wrapper = mount(Modal, { props: { open: true, closeOnBackdrop: false } })
    const backdrop = document.querySelector('.ui-modal-backdrop') as HTMLElement
    backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('no emite close al clickear dentro del sheet', () => {
    const wrapper = mount(Modal, { props: { open: true }, slots: { default: 'Cuerpo' } })
    const body = document.querySelector('.ui-modal-body') as HTMLElement
    body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('emite close al presionar Escape', () => {
    const wrapper = mount(Modal, { props: { open: true } })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('no emite close al presionar Escape si closeOnEscape es false', () => {
    const wrapper = mount(Modal, { props: { open: true, closeOnEscape: false } })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('mueve el foco al boton de cerrar al abrir', async () => {
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    trigger.focus()

    const wrapper = mount(Modal, { props: { open: false } })
    await wrapper.setProps({ open: true })

    expect(document.activeElement).toBe(document.querySelector('.ui-modal-close'))
    trigger.remove()
  })

  it('restaura el foco al elemento anterior al cerrar', async () => {
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    trigger.focus()

    const wrapper = mount(Modal, { props: { open: false } })
    await wrapper.setProps({ open: true })
    await wrapper.setProps({ open: false })

    expect(document.activeElement).toBe(trigger)
    trigger.remove()
  })
})
