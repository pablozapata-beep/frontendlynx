import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CasinoGameCard from './CasinoGameCard.vue'

describe('CasinoGameCard', () => {
  it('renderiza la imagen y el titulo', () => {
    const wrapper = mount(CasinoGameCard, { props: { image: '/a.webp', title: '4 Dragon Kings' } })
    expect(wrapper.find('img').attributes('src')).toBe('/a.webp')
    expect(wrapper.find('img').attributes('alt')).toBe('4 Dragon Kings')
    expect(wrapper.find('.ui-casino-game-card__title').text()).toBe('4 Dragon Kings')
  })

  it('sin jackpotAmount no muestra la pill', () => {
    const wrapper = mount(CasinoGameCard, { props: { image: '/a.webp', title: 'x' } })
    expect(wrapper.find('.ui-casino-game-card__jackpot').exists()).toBe(false)
  })

  it('con jackpotAmount formatea el monto con separador de miles y 2 decimales', () => {
    const wrapper = mount(CasinoGameCard, {
      props: { image: '/a.webp', title: 'x', jackpotAmount: 1098618.51 },
    })
    expect(wrapper.find('.ui-casino-game-card__jackpot').text()).toBe('us$ 1,098,618.51')
  })

  it('respeta la prop currency', () => {
    const wrapper = mount(CasinoGameCard, {
      props: { image: '/a.webp', title: 'x', jackpotAmount: 500, currency: 'ARS' },
    })
    expect(wrapper.find('.ui-casino-game-card__jackpot').text()).toBe('ARS 500.00')
  })

  it('emite play al clickear', async () => {
    const wrapper = mount(CasinoGameCard, { props: { image: '/a.webp', title: 'x' } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('play')).toHaveLength(1)
  })

  it('expone un aria-label accesible con el titulo del juego', () => {
    const wrapper = mount(CasinoGameCard, { props: { image: '/a.webp', title: 'Plinko' } })
    expect(wrapper.attributes('aria-label')).toContain('Plinko')
  })

  it('variant=overlay: titulo siempre visible en el footer, el play queda solo en el overlay de hover', () => {
    const wrapper = mount(CasinoGameCard, { props: { image: '/a.webp', title: 'Sugar Rush' } })
    expect(wrapper.find('.ui-casino-game-card__overlay').exists()).toBe(true)
    expect(wrapper.find('.ui-casino-game-card__overlay .ui-casino-game-card__title').exists()).toBe(false)
    expect(wrapper.find('.ui-casino-game-card__overlay .ui-casino-game-card__play-icon').exists()).toBe(true)

    expect(wrapper.find('.ui-casino-game-card__footer').exists()).toBe(true)
    expect(wrapper.find('.ui-casino-game-card__footer .ui-casino-game-card__title').text()).toBe('Sugar Rush')
  })

  it('variant=overlay: sin provider no muestra ninguna segunda linea en el footer', () => {
    const wrapper = mount(CasinoGameCard, { props: { image: '/a.webp', title: 'x' } })
    expect(wrapper.find('.ui-casino-game-card__provider').exists()).toBe(false)
    expect(wrapper.find('.ui-casino-game-card__subtitle').exists()).toBe(false)
  })

  it('variant=overlay: con provider, lo muestra debajo del titulo en el footer', () => {
    const wrapper = mount(CasinoGameCard, {
      props: { image: '/a.webp', title: 'Sugar Rush', provider: 'Pragmaticplay' },
    })
    expect(wrapper.find('.ui-casino-game-card__footer .ui-casino-game-card__provider').text()).toBe(
      'Pragmaticplay',
    )
  })

  it('variant=badge muestra titulo y subtitulo siempre visibles, sin overlay de hover', () => {
    const wrapper = mount(CasinoGameCard, { props: { image: '/a.webp', title: 'Crash', variant: 'badge' } })
    expect(wrapper.find('.ui-casino-game-card__overlay').exists()).toBe(false)
    expect(wrapper.find('.ui-casino-game-card__footer').exists()).toBe(true)
    expect(wrapper.find('.ui-casino-game-card__title').text()).toBe('Crash')
    expect(wrapper.find('.ui-casino-game-card__subtitle').text()).toBe('Juego original')
  })

  it('variant=badge ignora provider: siempre muestra subtitle, no la desarrolladora', () => {
    const wrapper = mount(CasinoGameCard, {
      props: { image: '/a.webp', title: 'x', variant: 'badge', provider: 'Pragmaticplay' },
    })
    expect(wrapper.find('.ui-casino-game-card__subtitle').exists()).toBe(true)
    expect(wrapper.find('.ui-casino-game-card__provider').exists()).toBe(false)
  })

  it('sin playersOnline no muestra el badge de jugadores', () => {
    const wrapper = mount(CasinoGameCard, { props: { image: '/a.webp', title: 'x' } })
    expect(wrapper.find('.ui-casino-game-card__players').exists()).toBe(false)
  })

  it('formatea playersOnline debajo de 1000 tal cual', () => {
    const wrapper = mount(CasinoGameCard, { props: { image: '/a.webp', title: 'x', playersOnline: 236 } })
    expect(wrapper.find('.ui-casino-game-card__players').text()).toBe('236')
  })

  it('abrevia playersOnline desde 1000 con formato "K"', () => {
    const wrapper = mount(CasinoGameCard, { props: { image: '/a.webp', title: 'x', playersOnline: 2800 } })
    expect(wrapper.find('.ui-casino-game-card__players').text()).toBe('2.8K')
  })

  it('no deja un ".0" colgando al abreviar un numero redondo', () => {
    const wrapper = mount(CasinoGameCard, { props: { image: '/a.webp', title: 'x', playersOnline: 3000 } })
    expect(wrapper.find('.ui-casino-game-card__players').text()).toBe('3K')
  })

  it('respeta la prop subtitle', () => {
    const wrapper = mount(CasinoGameCard, {
      props: { image: '/a.webp', title: 'x', variant: 'badge', subtitle: 'Exclusivo' },
    })
    expect(wrapper.find('.ui-casino-game-card__subtitle').text()).toBe('Exclusivo')
  })
})
