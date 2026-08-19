import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'

describe('Button', () => {
  it('renderiza el slot', () => {
    const wrapper = mount(Button, { slots: { default: 'Continuar' } })
    expect(wrapper.text()).toBe('Continuar')
  })

  it('aplica la clase de variante por defecto', () => {
    const wrapper = mount(Button)
    expect(wrapper.classes()).toContain('ui-button--primary')
    expect(wrapper.classes()).toContain('ui-button--md')
  })

  it('aplica la variante y tamano indicados', () => {
    const wrapper = mount(Button, { props: { variant: 'danger', size: 'lg' } })
    expect(wrapper.classes()).toContain('ui-button--danger')
    expect(wrapper.classes()).toContain('ui-button--lg')
  })

  it('respeta el estado disabled', () => {
    const wrapper = mount(Button, { props: { disabled: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })
})
