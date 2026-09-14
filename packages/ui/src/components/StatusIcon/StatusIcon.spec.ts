import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusIcon from './StatusIcon.vue'

describe('StatusIcon', () => {
  it('renderiza el circulo + check para success', () => {
    const wrapper = mount(StatusIcon, { props: { variant: 'success' } })
    expect(wrapper.find('circle.ui-status-icon__ring').exists()).toBe(true)
    expect(wrapper.findAll('path.ui-status-icon__mark')).toHaveLength(1)
  })

  it('renderiza el triangulo + signo de exclamacion para warning', () => {
    const wrapper = mount(StatusIcon, { props: { variant: 'warning' } })
    expect(wrapper.find('path.ui-status-icon__ring').exists()).toBe(true)
    expect(wrapper.find('circle.ui-status-icon__dot').exists()).toBe(true)
  })

  it('renderiza el circulo + X (dos trazos) para error', () => {
    const wrapper = mount(StatusIcon, { props: { variant: 'error' } })
    expect(wrapper.find('circle.ui-status-icon__ring').exists()).toBe(true)
    expect(wrapper.findAll('path.ui-status-icon__mark')).toHaveLength(2)
  })

  it('aplica la clase de variante y de tamaño', () => {
    const wrapper = mount(StatusIcon, { props: { variant: 'error', size: 'sm' } })
    expect(wrapper.classes()).toContain('ui-status-icon--error')
    expect(wrapper.classes()).toContain('ui-status-icon--sm')
  })

  it('por defecto es decorativo (aria-hidden, sin role)', () => {
    const wrapper = mount(StatusIcon, { props: { variant: 'success' } })
    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(wrapper.attributes('role')).toBeUndefined()
  })

  it('con label pasa a role=img con aria-label, sin aria-hidden', () => {
    const wrapper = mount(StatusIcon, { props: { variant: 'success', label: 'Pago exitoso' } })
    expect(wrapper.attributes('role')).toBe('img')
    expect(wrapper.attributes('aria-label')).toBe('Pago exitoso')
    expect(wrapper.attributes('aria-hidden')).toBeUndefined()
  })

  it('animated=false agrega el modificador estatico', () => {
    const wrapper = mount(StatusIcon, { props: { variant: 'success', animated: false } })
    expect(wrapper.classes()).toContain('ui-status-icon--static')
  })

  it('pulse=true agrega el modificador de pulso', () => {
    const wrapper = mount(StatusIcon, { props: { variant: 'warning', pulse: true } })
    expect(wrapper.classes()).toContain('ui-status-icon--pulse')
  })
})
