import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Prose from './Prose.vue'

describe('Prose', () => {
  it('renderiza el HTML recibido tal cual dentro de un contenedor', () => {
    const wrapper = mount(Prose, {
      slots: {
        default: '<h2>Titulo</h2><p>Texto con <a href="/x">link</a></p><ul><li>Uno</li></ul>',
      },
    })
    expect(wrapper.classes()).toContain('ui-prose')
    expect(wrapper.find('h2').text()).toBe('Titulo')
    expect(wrapper.find('a').attributes('href')).toBe('/x')
    expect(wrapper.find('ul li').text()).toBe('Uno')
  })

  it('size md por defecto, y respeta size', () => {
    expect(mount(Prose).classes()).toContain('ui-prose--md')
    expect(mount(Prose, { props: { size: 'xsm' } }).classes()).toContain('ui-prose--xsm')
  })
})
