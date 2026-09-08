import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LotteryBallBadge from './LotteryBallBadge.vue'

describe('LotteryBallBadge', () => {
  it('renderiza el label', () => {
    const wrapper = mount(LotteryBallBadge, { props: { label: 'PB', background: '#E4002B' } })
    expect(wrapper.text()).toBe('PB')
  })

  it('aplica el background indicado', () => {
    const wrapper = mount(LotteryBallBadge, { props: { label: 'MM', background: '#3E7BE8' } })
    expect(getComputedStyle(wrapper.element).backgroundColor).toBe('rgb(62, 123, 232)')
  })

  it('usa blanco como color de texto por defecto', () => {
    const wrapper = mount(LotteryBallBadge, { props: { label: 'PB', background: '#E4002B' } })
    expect(getComputedStyle(wrapper.element).color).toBe('rgb(255, 255, 255)')
  })

  it('respeta un color de texto custom', () => {
    const wrapper = mount(LotteryBallBadge, {
      props: { label: 'EM', background: '#B788F2', color: '#1a0f2e' },
    })
    expect(getComputedStyle(wrapper.element).color).toBe('rgb(26, 15, 46)')
  })

  it('aplica el tamano sm', () => {
    const wrapper = mount(LotteryBallBadge, {
      props: { label: 'PB', background: '#E4002B', size: 'sm' },
    })
    expect(wrapper.classes()).toContain('ui-lottery-ball--sm')
  })
})
