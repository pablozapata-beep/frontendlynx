import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import StatCard from './StatCard.vue'

describe('StatCard', () => {
  it('renderiza el valor y el label', () => {
    const wrapper = mount(StatCard, { props: { value: '$847M+', label: 'En premios pagados' } })
    expect(wrapper.find('.ui-stat-card__value').text()).toBe('$847M+')
    expect(wrapper.find('.ui-stat-card__label').text()).toBe('En premios pagados')
  })

  it('acepta un value numerico', () => {
    const wrapper = mount(StatCard, { props: { value: 4.8, label: 'Rating' } })
    expect(wrapper.find('.ui-stat-card__value').text()).toBe('4.8')
  })

  it('sin icon ni slot #icon, no renderiza el bloque de icono', () => {
    const wrapper = mount(StatCard, { props: { value: '1', label: 'x' } })
    expect(wrapper.find('.ui-stat-card__icon').exists()).toBe(false)
  })

  it('renderiza el icon pasado por prop', () => {
    const wrapper = mount(StatCard, { props: { value: '1', label: 'x', icon: '💰' } })
    expect(wrapper.find('.ui-stat-card__icon').text()).toBe('💰')
    expect(wrapper.find('.ui-stat-card__icon').attributes('aria-hidden')).toBe('true')
  })

  it('el slot #icon tiene prioridad sobre la prop icon', () => {
    const wrapper = mount(StatCard, {
      props: { value: '1', label: 'x', icon: '💰' },
      slots: { icon: '<svg data-test="custom-icon"></svg>' },
    })
    expect(wrapper.find('[data-test="custom-icon"]').exists()).toBe(true)
    expect(wrapper.find('.ui-stat-card__icon').text()).not.toContain('💰')
  })

  it('valueLabel se expone como aria-label del valor', () => {
    const wrapper = mount(StatCard, {
      props: { value: '$847M+', label: 'x', valueLabel: '847 millones de dólares' },
    })
    expect(wrapper.find('.ui-stat-card__value').attributes('aria-label')).toBe('847 millones de dólares')
  })
})
