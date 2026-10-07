import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Switch from './Switch.vue'

describe('Switch', () => {
  it('es un input checkbox con role=switch y label asociado', () => {
    const wrapper = mount(Switch, { props: { label: 'Notificaciones', id: 'notif' } })
    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('checkbox')
    expect(input.attributes('role')).toBe('switch')
    expect(wrapper.attributes('for')).toBe('notif')
  })

  it('refleja modelValue y emite el nuevo estado', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false } })
    expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(false)
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('disabled deshabilita el input y aplica el modificador', () => {
    const wrapper = mount(Switch, { props: { disabled: true } })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('ui-switch--disabled')
  })

  it('muestra hint y pasa atributos extra al input', () => {
    const wrapper = mount(Switch, { props: { label: 'x', hint: 'Detalle' }, attrs: { name: 'n', class: 'mia' } })
    expect(wrapper.find('.ui-switch__hint').text()).toBe('Detalle')
    expect(wrapper.find('input').attributes('name')).toBe('n')
    expect(wrapper.classes()).toContain('mia')
  })
})
