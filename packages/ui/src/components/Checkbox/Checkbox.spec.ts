import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Checkbox from './Checkbox.vue'

const input = (w: ReturnType<typeof mount>) => w.find('input').element as HTMLInputElement

describe('Checkbox', () => {
  it('es un input checkbox nativo con su label asociado', () => {
    const wrapper = mount(Checkbox, { props: { label: 'Acepto', id: 'acepto' } })
    expect(wrapper.find('input').attributes('type')).toBe('checkbox')
    expect(wrapper.find('label').exists() || wrapper.element.tagName === 'LABEL').toBe(true)
    expect(wrapper.attributes('for')).toBe('acepto')
    expect(wrapper.text()).toContain('Acepto')
  })

  it('refleja modelValue booleano y emite el nuevo estado', async () => {
    const wrapper = mount(Checkbox, { props: { modelValue: false } })
    expect(input(wrapper).checked).toBe(false)
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  describe('modelValue como array', () => {
    it('esta marcado si el array incluye su value', () => {
      const wrapper = mount(Checkbox, { props: { modelValue: ['a', 'b'], value: 'b' } })
      expect(input(wrapper).checked).toBe(true)
    })

    it('al marcar agrega su value sin mutar el array original', async () => {
      const source = ['a']
      const wrapper = mount(Checkbox, { props: { modelValue: source, value: 'b' } })
      await wrapper.find('input').setValue(true)
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a', 'b']])
      expect(source).toEqual(['a'])
    })

    it('al desmarcar quita su value', async () => {
      const wrapper = mount(Checkbox, { props: { modelValue: ['a', 'b'], value: 'a' } })
      await wrapper.find('input').setValue(false)
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['b']])
    })
  })

  it('indeterminate marca el input como mixto', () => {
    const wrapper = mount(Checkbox, { props: { indeterminate: true } })
    expect(input(wrapper).indeterminate).toBe(true)
    expect(wrapper.find('input').attributes('aria-checked')).toBe('mixed')
  })

  it('disabled deshabilita el input y aplica el modificador', () => {
    const wrapper = mount(Checkbox, { props: { disabled: true } })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('ui-checkbox--disabled')
  })

  it('muestra hint, y el slot reemplaza al label', () => {
    const hinted = mount(Checkbox, { props: { label: 'Newsletter', hint: 'Una vez por semana' } })
    expect(hinted.find('.ui-checkbox__hint').text()).toBe('Una vez por semana')

    const slotted = mount(Checkbox, { slots: { default: 'Acepto los <a href="#">terminos</a>' } })
    expect(slotted.find('.ui-checkbox__label a').exists()).toBe(true)
  })

  it('pasa atributos extra al input y class al label raiz', () => {
    const wrapper = mount(Checkbox, { attrs: { name: 'terms', class: 'mia' } })
    expect(wrapper.find('input').attributes('name')).toBe('terms')
    expect(wrapper.classes()).toContain('mia')
  })
})
