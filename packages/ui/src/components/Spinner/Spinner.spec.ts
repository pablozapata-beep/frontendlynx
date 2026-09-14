import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Spinner from './Spinner.vue'

describe('Spinner', () => {
  it('por defecto renderiza la variante dual-ring', () => {
    const wrapper = mount(Spinner)
    expect(wrapper.find('.ui-spinner__dual-ring').exists()).toBe(true)
    expect(wrapper.findAll('.ui-spinner__ring')).toHaveLength(2)
  })

  it('renderiza la variante ring', () => {
    const wrapper = mount(Spinner, { props: { variant: 'ring' } })
    expect(wrapper.find('.ui-spinner__single-ring').exists()).toBe(true)
  })

  it('renderiza la variante dots con 3 puntos', () => {
    const wrapper = mount(Spinner, { props: { variant: 'dots' } })
    expect(wrapper.findAll('.ui-spinner__dot')).toHaveLength(3)
  })

  it('aplica las clases de tamaño y tono', () => {
    const wrapper = mount(Spinner, { props: { size: 'sm', tone: 'current' } })
    expect(wrapper.classes()).toContain('ui-spinner--sm')
    expect(wrapper.classes()).toContain('ui-spinner--current')
  })

  it('expone role=status y aria-label para lectores de pantalla', () => {
    const wrapper = mount(Spinner, { props: { label: 'Procesando pago' } })
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-label')).toBe('Procesando pago')
  })
})
