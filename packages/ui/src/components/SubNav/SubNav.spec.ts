import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SubNav from './SubNav.vue'

const items = [
  { id: 'casino', label: 'Casino' },
  { id: 'live', label: 'Casino en Vivo' },
  { id: 'cats', label: 'Categorías', hasMenu: true },
  { id: 'off', label: 'Deshabilitado', disabled: true },
]

describe('SubNav', () => {
  it('es un nav con un boton por item', () => {
    const wrapper = mount(SubNav, { props: { items } })
    expect(wrapper.element.tagName).toBe('NAV')
    expect(wrapper.attributes('aria-label')).toBe('Secciones')
    expect(wrapper.findAll('.ui-sub-nav__pill').map((p) => p.text())).toEqual([
      'Casino',
      'Casino en Vivo',
      'Categorías',
      'Deshabilitado',
    ])
  })

  it('marca el activo con aria-current', () => {
    const wrapper = mount(SubNav, { props: { items, modelValue: 'live' } })
    const pills = wrapper.findAll('.ui-sub-nav__pill')
    expect(pills[1].attributes('aria-current')).toBe('true')
    expect(pills[1].classes()).toContain('ui-sub-nav__pill--active')
    expect(pills[0].attributes('aria-current')).toBeUndefined()
  })

  it('click en un item emite update:modelValue y select', async () => {
    const wrapper = mount(SubNav, { props: { items, modelValue: 'casino' } })
    await wrapper.findAll('.ui-sub-nav__pill')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['live'])
    expect(wrapper.emitted('select')?.[0][0]).toEqual(items[1])
  })

  it('un item con menu emite select pero no cambia el activo, y muestra la flecha', async () => {
    const wrapper = mount(SubNav, { props: { items, modelValue: 'casino' } })
    const pill = wrapper.findAll('.ui-sub-nav__pill')[2]
    expect(pill.find('.ui-sub-nav__chevron').exists()).toBe(true)
    expect(pill.attributes('aria-haspopup')).toBe('true')
    await pill.trigger('click')
    expect(wrapper.emitted('select')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(pill.attributes('aria-current')).toBeUndefined()
  })

  it('expanded se refleja en aria-expanded', () => {
    const wrapper = mount(SubNav, {
      props: { items: [{ id: 'cats', label: 'Categorías', hasMenu: true, expanded: true }] },
    })
    const pill = wrapper.find('.ui-sub-nav__pill')
    expect(pill.attributes('aria-expanded')).toBe('true')
    expect(pill.find('.ui-sub-nav__chevron--open').exists()).toBe(true)
  })

  it('disabled deshabilita el boton', () => {
    const wrapper = mount(SubNav, { props: { items } })
    expect(wrapper.findAll('.ui-sub-nav__pill')[3].attributes('disabled')).toBeDefined()
  })

  it('respeta ariaLabel', () => {
    expect(mount(SubNav, { props: { items, ariaLabel: 'Juegos' } }).attributes('aria-label')).toBe('Juegos')
  })
})
