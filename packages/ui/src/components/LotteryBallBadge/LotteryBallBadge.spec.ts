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

  it('renderiza el logo cuando se pasa logoUrl, en vez del label', () => {
    const wrapper = mount(LotteryBallBadge, {
      props: {
        label: 'PB',
        background: '#E4002B',
        logoUrl: 'https://d3tmfelegj51yl.cloudfront.net/lotto-logos/wt/3.png',
      },
    })
    const img = wrapper.find('img.ui-lottery-ball__logo')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://d3tmfelegj51yl.cloudfront.net/lotto-logos/wt/3.png')
    expect(img.attributes('alt')).toBe('PB')
    expect(wrapper.text()).toBe('')
  })

  it('vuelve a mostrar el label si la imagen del logo falla al cargar', async () => {
    const wrapper = mount(LotteryBallBadge, {
      props: {
        label: 'PB',
        background: '#E4002B',
        logoUrl: 'https://d3tmfelegj51yl.cloudfront.net/lotto-logos/wt/roto.png',
      },
    })
    await wrapper.find('img.ui-lottery-ball__logo').trigger('error')
    expect(wrapper.find('img.ui-lottery-ball__logo').exists()).toBe(false)
    expect(wrapper.text()).toBe('PB')
  })

  it('sin logoUrl muestra el label como antes', () => {
    const wrapper = mount(LotteryBallBadge, { props: { label: 'PB', background: '#E4002B' } })
    expect(wrapper.find('img.ui-lottery-ball__logo').exists()).toBe(false)
    expect(wrapper.text()).toBe('PB')
  })
})
