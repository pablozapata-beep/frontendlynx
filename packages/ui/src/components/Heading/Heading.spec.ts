import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Heading from './Heading.vue'

describe('Heading', () => {
  it('renderiza el slot en un h2 por defecto', () => {
    const wrapper = mount(Heading, { slots: { default: 'Hola' } })
    expect(wrapper.element.tagName).toBe('H2')
    expect(wrapper.text()).toBe('Hola')
  })

  it('level decide la etiqueta semantica', () => {
    for (const level of [1, 2, 3, 4, 5, 6] as const) {
      expect(mount(Heading, { props: { level } }).element.tagName).toBe(`H${level}`)
    }
  })

  it('sin size deriva el tamano visual del nivel', () => {
    const bySize = (level: 1 | 2 | 3 | 4 | 5 | 6) => mount(Heading, { props: { level } }).classes()
    expect(bySize(1)).toContain('ui-heading--title')
    expect(bySize(2)).toContain('ui-heading--md')
    expect(bySize(3)).toContain('ui-heading--sm')
    expect(bySize(4)).toContain('ui-heading--xsm')
    expect(bySize(5)).toContain('ui-heading--xxsm')
    expect(bySize(6)).toContain('ui-heading--xxsm')
  })

  it('size es independiente del nivel (un h2 puede verse como main-title)', () => {
    const wrapper = mount(Heading, { props: { level: 2, size: 'main-title' } })
    expect(wrapper.element.tagName).toBe('H2')
    expect(wrapper.classes()).toContain('ui-heading--main-title')
    expect(wrapper.classes()).not.toContain('ui-heading--md')
  })

  it('acepta las variantes subtitle', () => {
    for (const size of ['subtitle', 'subtitle-sm', 'subtitle-xsm'] as const) {
      expect(mount(Heading, { props: { size } }).classes()).toContain(`ui-heading--${size}`)
    }
  })

  it('align aplica el modificador, y sin align no hay ninguno', () => {
    expect(mount(Heading, { props: { align: 'center' } }).classes()).toContain('ui-heading--align-center')
    expect(mount(Heading).classes().some((c) => c.startsWith('ui-heading--align'))).toBe(false)
  })

  it('con slot icon lo renderiza antes del texto y aplica el modificador', () => {
    const wrapper = mount(Heading, {
      slots: { default: 'Titulo', icon: '<svg class="mi-icono" />' },
    })
    expect(wrapper.find('.ui-heading__icon .mi-icono').exists()).toBe(true)
    expect(wrapper.classes()).toContain('ui-heading--with-icon')
  })

  it('sin slot icon no hay wrapper de icono', () => {
    const wrapper = mount(Heading, { slots: { default: 'Titulo' } })
    expect(wrapper.find('.ui-heading__icon').exists()).toBe(false)
  })
})
