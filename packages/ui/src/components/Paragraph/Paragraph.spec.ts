import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Paragraph from './Paragraph.vue'

describe('Paragraph', () => {
  it('es un <p> con el contenido del slot y tamano md por defecto', () => {
    const wrapper = mount(Paragraph, { slots: { default: 'Texto' } })
    expect(wrapper.element.tagName).toBe('P')
    expect(wrapper.text()).toBe('Texto')
    expect(wrapper.classes()).toContain('ui-paragraph--md')
  })

  it('aplica size y align', () => {
    const wrapper = mount(Paragraph, { props: { size: 'xsm', align: 'center' } })
    expect(wrapper.classes()).toContain('ui-paragraph--xsm')
    expect(wrapper.classes()).toContain('ui-paragraph--align-center')
  })

  it('sin align no hay modificador de alineacion', () => {
    expect(mount(Paragraph).classes().some((c) => c.startsWith('ui-paragraph--align'))).toBe(false)
  })

  it('renderiza contenido rico (strong, links) dentro del slot', () => {
    const wrapper = mount(Paragraph, {
      slots: { default: 'Mira <strong>esto</strong> y <a href="/politica">click here</a>.' },
    })
    expect(wrapper.find('strong').text()).toBe('esto')
    expect(wrapper.find('a').attributes('href')).toBe('/politica')
  })
})
