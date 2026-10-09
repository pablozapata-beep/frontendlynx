import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import NavDrawer from './NavDrawer.vue'
import type { NavItem } from './types'

const IconStub = defineComponent({ render: () => h('svg', { class: 'icono-componente' }) })

const items: NavItem[] = [
  { id: 'casino', label: 'Casino', href: '/casino', icon: IconStub },
  { id: 'predicciones', label: 'Predicciones', badge: 'New', icon: 'https://cdn.test/icon.png' },
  {
    id: 'deportes',
    label: 'Deportes',
    children: [
      { id: 'futbol', label: 'Fútbol', href: '/futbol' },
      { id: 'tenis', label: 'Tenis' },
    ],
  },
  { id: 'd1', label: '', type: 'divider' },
  { id: 'h1', label: 'Más', type: 'heading' },
  { id: 'vip', label: 'VIP Club', disabled: true },
]

const $ = (selector: string) => document.body.querySelector(selector)
const $$ = (selector: string) => Array.from(document.body.querySelectorAll(selector))
const click = (el: Element | null) => (el as HTMLElement).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

afterEach(() => {
  document.body.innerHTML = ''
  document.body.style.overflow = ''
})

describe('NavDrawer', () => {
  it('no renderiza nada si open es false', () => {
    mount(NavDrawer, { props: { open: false, items } })
    expect($('.ui-nav-drawer')).toBeNull()
  })

  it('abierto: dialog modal con nav, fuera del arbol del componente (Teleport a <body>)', () => {
    const wrapper = mount(NavDrawer, { props: { open: true, items } })
    const dialog = $('[role="dialog"]')!
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(dialog.getAttribute('aria-label')).toBe('Menú principal')
    expect($('nav')).not.toBeNull()
    expect(wrapper.element.contains($('.ui-nav-drawer'))).toBe(false)
  })

  describe('items', () => {
    it('con href es un <a> real; sin href es un <button>', () => {
      mount(NavDrawer, { props: { open: true, items } })
      const links = $$('.ui-nav-drawer-list__link')
      expect(links[0].tagName).toBe('A')
      expect(links[0].getAttribute('href')).toBe('/casino')
      expect(links[1].tagName).toBe('BUTTON')
    })

    it('muestra el badge', () => {
      mount(NavDrawer, { props: { open: true, items } })
      expect($('.ui-nav-drawer-list__badge')!.textContent).toBe('New')
    })

    it('icon acepta un componente Vue o la URL de una imagen', () => {
      mount(NavDrawer, { props: { open: true, items } })
      expect($('.ui-nav-drawer-list__icon .icono-componente')).not.toBeNull()
      expect($('.ui-nav-drawer-list__icon img')!.getAttribute('src')).toBe('https://cdn.test/icon.png')
    })

    it('renderiza headings y separadores', () => {
      mount(NavDrawer, { props: { open: true, items } })
      expect($('.ui-nav-drawer-list__heading')!.textContent).toBe('Más')
      expect($('[role="separator"]')).not.toBeNull()
    })

    it('un item disabled es un boton deshabilitado aunque tenga href', () => {
      mount(NavDrawer, { props: { open: true, items: [{ id: 'x', label: 'X', href: '/x', disabled: true }] } })
      const link = $('.ui-nav-drawer-list__link')!
      expect(link.tagName).toBe('BUTTON')
      expect(link.hasAttribute('disabled')).toBe(true)
      expect(link.hasAttribute('href')).toBe(false)
    })

    it('activeId marca aria-current="page"', () => {
      mount(NavDrawer, { props: { open: true, items, activeId: 'casino' } })
      expect($$('.ui-nav-drawer-list__link')[0].getAttribute('aria-current')).toBe('page')
      expect($$('.ui-nav-drawer-list__link')[1].getAttribute('aria-current')).toBeNull()
    })
  })

  describe('grupos', () => {
    it('arrancan cerrados y se despliegan con aria-expanded', async () => {
      const wrapper = mount(NavDrawer, { props: { open: true, items } })
      const group = $$('.ui-nav-drawer-list__link').find((l) => l.textContent?.includes('Deportes'))!
      expect(group.getAttribute('aria-expanded')).toBe('false')
      expect($('.ui-nav-drawer-list--nested')).toBeNull()

      click(group)
      await wrapper.vm.$nextTick()
      expect(group.getAttribute('aria-expanded')).toBe('true')
      expect($$('.ui-nav-drawer-list--nested .ui-nav-drawer-list__link').map((l) => l.textContent?.trim())).toEqual([
        'Fútbol',
        'Tenis',
      ])
      expect(group.getAttribute('aria-controls')).toBe($('.ui-nav-drawer-list--nested')!.parentElement!.id)
    })

    it('expanded:true arranca desplegado', () => {
      mount(NavDrawer, {
        props: {
          open: true,
          items: [{ id: 'g', label: 'Grupo', expanded: true, children: [{ id: 'h', label: 'Hijo' }] }],
        },
      })
      expect($('.ui-nav-drawer-list--nested')).not.toBeNull()
    })

    it('abrir/cerrar un grupo no emite select ni close', async () => {
      const wrapper = mount(NavDrawer, { props: { open: true, items } })
      click($$('.ui-nav-drawer-list__link').find((l) => l.textContent?.includes('Deportes'))!)
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('select')).toBeUndefined()
      expect(wrapper.emitted('close')).toBeUndefined()
    })

    it('los items hijos emiten select', async () => {
      const wrapper = mount(NavDrawer, { props: { open: true, items } })
      click($$('.ui-nav-drawer-list__link').find((l) => l.textContent?.includes('Deportes'))!)
      await wrapper.vm.$nextTick()
      click($$('.ui-nav-drawer-list--nested .ui-nav-drawer-list__link')[1])
      expect(wrapper.emitted('select')?.[0][0]).toMatchObject({ id: 'tenis' })
    })
  })

  describe('select y close', () => {
    it('emite select con el item y el evento, y luego close', () => {
      const wrapper = mount(NavDrawer, { props: { open: true, items } })
      click($$('.ui-nav-drawer-list__link')[1])
      const [item, event] = wrapper.emitted('select')![0] as [NavItem, MouseEvent]
      expect(item.id).toBe('predicciones')
      expect(event).toBeInstanceOf(MouseEvent)
      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('closeOnSelect=false no cierra al elegir', () => {
      const wrapper = mount(NavDrawer, { props: { open: true, items, closeOnSelect: false } })
      click($$('.ui-nav-drawer-list__link')[1])
      expect(wrapper.emitted('select')).toHaveLength(1)
      expect(wrapper.emitted('close')).toBeUndefined()
    })

    it('el consumidor puede cancelar la navegacion de un <a> con preventDefault', () => {
      const wrapper = mount(NavDrawer, {
        props: { open: true, items, 'onSelect': (_item: NavItem, event: MouseEvent) => event.preventDefault() },
      })
      const anchor = $$('.ui-nav-drawer-list__link')[0]
      const event = new MouseEvent('click', { bubbles: true, cancelable: true })
      anchor.dispatchEvent(event)
      expect(event.defaultPrevented).toBe(true)
      expect(wrapper.emitted('select')).toBeDefined()
    })

    it('cierra con el boton de cerrar, el backdrop y Escape', () => {
      const wrapper = mount(NavDrawer, { props: { open: true, items } })
      click($('.ui-nav-drawer__close'))
      click($('.ui-nav-drawer'))
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      expect(wrapper.emitted('close')).toHaveLength(3)
    })

    it('no cierra al clickear dentro del panel', () => {
      const wrapper = mount(NavDrawer, { props: { open: true, items } })
      click($('.ui-nav-drawer__panel'))
      expect(wrapper.emitted('close')).toBeUndefined()
    })

    it('closeOnBackdrop=false y closeOnEscape=false lo evitan', () => {
      const wrapper = mount(NavDrawer, {
        props: { open: true, items, closeOnBackdrop: false, closeOnEscape: false },
      })
      click($('.ui-nav-drawer'))
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      expect(wrapper.emitted('close')).toBeUndefined()
    })
  })

  describe('foco y scroll', () => {
    it('al abrir mueve el foco al boton de cerrar y bloquea el scroll del body', async () => {
      const trigger = document.createElement('button')
      document.body.appendChild(trigger)
      trigger.focus()

      const wrapper = mount(NavDrawer, { props: { open: false, items } })
      await wrapper.setProps({ open: true })
      expect(document.activeElement).toBe($('.ui-nav-drawer__close'))
      expect(document.body.style.overflow).toBe('hidden')
    })

    it('al cerrar restaura el scroll y devuelve el foco al elemento anterior', async () => {
      document.body.style.overflow = 'auto'
      const trigger = document.createElement('button')
      document.body.appendChild(trigger)
      trigger.focus()

      const wrapper = mount(NavDrawer, { props: { open: false, items } })
      await wrapper.setProps({ open: true })
      await wrapper.setProps({ open: false })
      expect(document.body.style.overflow).toBe('auto')
      expect(document.activeElement).toBe(trigger)
    })

    it('Tab en el ultimo elemento vuelve al primero, y Shift+Tab en el primero va al ultimo', async () => {
      const wrapper = mount(NavDrawer, { props: { open: false, items: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }] } })
      await wrapper.setProps({ open: true })
      const focusables = $$('.ui-nav-drawer__panel button')
      const first = focusables[0] as HTMLElement
      const last = focusables[focusables.length - 1] as HTMLElement

      last.focus()
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', cancelable: true }))
      expect(document.activeElement).toBe(first)

      first.focus()
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true }))
      expect(document.activeElement).toBe(last)
    })

    it('si se desmonta abierto, no deja el scroll bloqueado', () => {
      const wrapper = mount(NavDrawer, { props: { open: true, items } })
      expect(document.body.style.overflow).toBe('hidden')
      wrapper.unmount()
      expect(document.body.style.overflow).toBe('')
    })
  })

  it('side right aplica el modificador, y los labels son personalizables', () => {
    mount(NavDrawer, { props: { open: true, items, side: 'right', navLabel: 'Navegación', closeLabel: 'Cerrar' } })
    expect($('.ui-nav-drawer--right')).not.toBeNull()
    expect($('[role="dialog"]')!.getAttribute('aria-label')).toBe('Navegación')
    expect($('.ui-nav-drawer__close')!.getAttribute('aria-label')).toBe('Cerrar')
  })

  it('renderiza los slots header y footer', () => {
    mount(NavDrawer, {
      props: { open: true, items },
      slots: { header: '<span class="mi-logo">Logo</span>', footer: '<span class="mi-idioma">ES</span>' },
    })
    expect($('.ui-nav-drawer__header .mi-logo')).not.toBeNull()
    expect($('.ui-nav-drawer__footer .mi-idioma')).not.toBeNull()
  })
})
