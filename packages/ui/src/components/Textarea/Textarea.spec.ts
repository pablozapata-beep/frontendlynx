import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Textarea from './Textarea.vue'

describe('Textarea', () => {
  it('muestra el valor y emite update:modelValue', async () => {
    const wrapper = mount(Textarea, { props: { modelValue: 'texto' } })
    expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('texto')
    await wrapper.find('textarea').setValue('otro')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['otro'])
  })

  it('respeta rows, maxlength y placeholder', () => {
    const wrapper = mount(Textarea, { props: { rows: 6, maxlength: 100, placeholder: 'Escribi' } })
    const el = wrapper.find('textarea')
    expect(el.attributes('rows')).toBe('6')
    expect(el.attributes('maxlength')).toBe('100')
    expect(el.attributes('placeholder')).toBe('Escribi')
  })

  it('showCount muestra el contador, con maxlength como "n/max"', () => {
    const plain = mount(Textarea, { props: { modelValue: 'abcd', showCount: true } })
    expect(plain.find('.ui-textarea__count').text()).toBe('4')
    const limited = mount(Textarea, { props: { modelValue: 'abcd', showCount: true, maxlength: 20 } })
    expect(limited.find('.ui-textarea__count').text()).toBe('4/20')
  })

  it('sin showCount no hay contador', () => {
    expect(mount(Textarea, { props: { modelValue: 'a' } }).find('.ui-textarea__count').exists()).toBe(false)
  })

  it('label, ayuda y error se enlazan igual que en TextInput', () => {
    const wrapper = mount(Textarea, { props: { label: 'Mensaje', error: 'Requerido', id: 'msg' } })
    expect(wrapper.find('label').attributes('for')).toBe('msg')
    expect(wrapper.find('textarea').attributes('aria-describedby')).toBe('msg-error')
    expect(wrapper.find('textarea').attributes('aria-invalid')).toBe('true')
  })

  it('resize none aplica el modificador', () => {
    const wrapper = mount(Textarea, { props: { resize: 'none' } })
    expect(wrapper.find('textarea').classes()).toContain('ui-textarea__control--resize-none')
  })
})
