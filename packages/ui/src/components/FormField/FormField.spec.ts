import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FormField from './FormField.vue'

describe('FormField', () => {
  it('renderiza label enlazado por for y la ayuda con el id que referencia aria-describedby', () => {
    const wrapper = mount(FormField, {
      props: { id: 'campo', label: 'Nombre', hint: 'Tal como figura en tu DNI' },
      slots: { default: '<input id="campo" />' },
    })
    expect(wrapper.find('label').attributes('for')).toBe('campo')
    expect(wrapper.find('#campo-hint').text()).toBe('Tal como figura en tu DNI')
  })

  it('expone describedby e invalid al slot', () => {
    const wrapper = mount(FormField, {
      props: { id: 'c', error: 'Invalido' },
      slots: {
        default: `<template #default="{ describedby, invalid }"><i class="probe" :data-d="describedby" :data-i="String(invalid)" /></template>`,
      },
    })
    expect(wrapper.find('.probe').attributes('data-d')).toBe('c-error')
    expect(wrapper.find('.probe').attributes('data-i')).toBe('true')
  })

  it('el error tiene prioridad sobre la ayuda y es un role=alert', () => {
    const wrapper = mount(FormField, { props: { id: 'c', hint: 'ayuda', error: 'Invalido' } })
    expect(wrapper.find('#c-error').attributes('role')).toBe('alert')
    expect(wrapper.find('#c-hint').exists()).toBe(false)
    expect(wrapper.classes()).toContain('ui-form-field--invalid')
  })

  it('sin label, hint ni error no renderiza esos elementos', () => {
    const wrapper = mount(FormField, { props: { id: 'c' } })
    expect(wrapper.find('label').exists()).toBe(false)
    expect(wrapper.find('.ui-form-field__message').exists()).toBe(false)
  })
})
