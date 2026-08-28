import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Card from './Card.vue'

describe('Card', () => {
  it('renderiza el slot por defecto', () => {
    const wrapper = mount(Card, { slots: { default: 'Contenido' } })
    expect(wrapper.text()).toContain('Contenido')
  })

  it('aplica la variante elevated por defecto', () => {
    const wrapper = mount(Card)
    expect(wrapper.classes()).toContain('ui-card--elevated')
  })

  it('no renderiza header ni footer si no se pasan esos slots', () => {
    const wrapper = mount(Card)
    expect(wrapper.find('.ui-card__header').exists()).toBe(false)
    expect(wrapper.find('.ui-card__footer').exists()).toBe(false)
  })

  it('renderiza header y footer cuando se proveen', () => {
    const wrapper = mount(Card, {
      slots: { header: 'Titulo', default: 'Cuerpo', footer: 'Pie' },
    })
    expect(wrapper.find('.ui-card__header').text()).toBe('Titulo')
    expect(wrapper.find('.ui-card__footer').text()).toBe('Pie')
  })
})
