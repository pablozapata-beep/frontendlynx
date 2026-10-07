import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Radio from './Radio.vue'

describe('Radio', () => {
  it('es un input radio nativo con label asociado', () => {
    const wrapper = mount(Radio, { props: { value: 'a', label: 'Opcion A', id: 'ra', name: 'grupo' } })
    expect(wrapper.find('input').attributes('type')).toBe('radio')
    expect(wrapper.find('input').attributes('name')).toBe('grupo')
    expect(wrapper.attributes('for')).toBe('ra')
  })

  it('suelto: esta marcado si modelValue coincide con value y emite su value al elegirlo', async () => {
    const wrapper = mount(Radio, { props: { value: 'a', modelValue: 'b', label: 'A' } })
    expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(false)
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])

    const checked = mount(Radio, { props: { value: 'a', modelValue: 'a' } })
    expect((checked.find('input').element as HTMLInputElement).checked).toBe(true)
  })

  it('respeta valores no string (numeros)', async () => {
    const checked = mount(Radio, { props: { value: 10, modelValue: 10 } })
    expect((checked.find('input').element as HTMLInputElement).checked).toBe(true)

    const other = mount(Radio, { props: { value: 10, modelValue: 5 } })
    await other.find('input').setValue(true)
    expect(other.emitted('update:modelValue')?.[0]).toEqual([10])
  })

  it('disabled, hint y atributos extra', () => {
    const wrapper = mount(Radio, {
      props: { value: 'a', disabled: true, label: 'A', hint: 'Detalle' },
      attrs: { class: 'mia', 'data-test': 'x' },
    })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('ui-radio--disabled')
    expect(wrapper.find('.ui-radio__hint').text()).toBe('Detalle')
    expect(wrapper.classes()).toContain('mia')
    expect(wrapper.find('input').attributes('data-test')).toBe('x')
  })
})
