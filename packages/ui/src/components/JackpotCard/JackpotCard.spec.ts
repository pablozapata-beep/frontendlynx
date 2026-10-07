import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import JackpotCard from './JackpotCard.vue'
import type { JackpotGame } from './types'

const baseGame: JackpotGame = {
  id: 'powerball',
  name: 'Powerball',
  region: 'Estados Unidos',
  balls: [
    { id: 'pb', label: 'PB', background: '#E4002B' },
    { id: 'extra', label: 'EX', background: '#000000' },
  ],
  jackpotAmount: 350_000_000,
  price: 3,
  drawLabel: 'Sábado 22:00',
  closesAt: Date.now() + 60_000,
  config: {
    kind: 'range',
    mainCount: 5,
    mainMin: 1,
    mainMax: 69,
    bonusCount: 1,
    bonusMin: 1,
    bonusMax: 26,
    defaultPlays: 2,
  },
}

describe('JackpotCard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renderiza una LotteryBallBadge por cada ball del juego', () => {
    const wrapper = mount(JackpotCard, { props: { game: baseGame } })
    expect(wrapper.findAll('.ui-lottery-ball')).toHaveLength(2)
  })

  it('renderiza nombre, region y monto del jackpot', () => {
    const wrapper = mount(JackpotCard, { props: { game: baseGame } })
    expect(wrapper.find('.ui-jackpot-card__name').text()).toBe('Powerball')
    expect(wrapper.find('.ui-jackpot-card__region').text()).toBe('Estados Unidos')
    expect(wrapper.find('.ui-jackpot-card__jackpot-amount').text()).toContain('350 millones')
  })

  it('no muestra badges de hot/descuento si el juego no los tiene', () => {
    const wrapper = mount(JackpotCard, { props: { game: baseGame } })
    expect(wrapper.find('.ui-jackpot-card__badges').exists()).toBe(false)
  })

  it('muestra el badge de hot cuando game.hot es true', () => {
    const wrapper = mount(JackpotCard, { props: { game: { ...baseGame, hot: true } } })
    expect(wrapper.text()).toContain('Pozo alto')
  })

  it('muestra el badge de descuento cuando game.discountLabel esta presente', () => {
    const wrapper = mount(JackpotCard, {
      props: { game: { ...baseGame, discountLabel: '-20% hoy' } },
    })
    expect(wrapper.text()).toContain('-20% hoy')
  })

  it('muestra el precio anterior tachado solo si hay oldPrice', () => {
    const withoutOld = mount(JackpotCard, { props: { game: baseGame } })
    expect(withoutOld.find('.ui-jackpot-card__old-price').exists()).toBe(false)

    const withOld = mount(JackpotCard, { props: { game: { ...baseGame, oldPrice: 5 } } })
    expect(withOld.find('.ui-jackpot-card__old-price').text()).toContain('5.00')
  })

  it('usa "por línea" para juegos de rango y "por décimo" para juegos fijos, por defecto', () => {
    const rangeCard = mount(JackpotCard, { props: { game: baseGame } })
    expect(rangeCard.find('.ui-jackpot-card__price-unit').text()).toBe('por línea')

    const fixedGame: JackpotGame = {
      ...baseGame,
      config: {
        kind: 'fixed',
        digits: 5,
        volumeDiscount: 0.3,
        volumeThreshold: 3,
        volumeMax: 10,
        enteroDecimos: 10,
        enteroDiscount: 0.2,
      },
    }
    const fixedCard = mount(JackpotCard, { props: { game: fixedGame } })
    expect(fixedCard.find('.ui-jackpot-card__price-unit').text()).toBe('por décimo')
  })

  it('emite play con el juego completo al clickear el CTA', async () => {
    const wrapper = mount(JackpotCard, { props: { game: baseGame } })
    await wrapper.find('.ui-button').trigger('click')
    expect(wrapper.emitted('play')?.[0]).toEqual([baseGame])
  })

  it('usa los defaults en espanol cuando no se pasan props de copy', () => {
    const wrapper = mount(JackpotCard, { props: { game: baseGame } })
    expect(wrapper.text()).toContain('Pozo actual')
    expect(wrapper.text()).toContain('Sube en cada sorteo sin ganador')
    expect(wrapper.text()).toContain('Jugar ahora')
    expect(wrapper.text()).toContain('Sorteo: Sábado 22:00')
  })

  it('reenvia el evento expire del Countdown embebido', async () => {
    const wrapper = mount(JackpotCard, {
      props: { game: { ...baseGame, closesAt: Date.now() + 1000 } },
    })
    await vi.advanceTimersByTimeAsync(1000)
    expect(wrapper.emitted('expire')).toHaveLength(1)
  })

  describe('sin closesAt (sorteo pendiente)', () => {
    const { closesAt: _omit, ...gameWithoutDraw } = baseGame

    it('muestra "Pendiente" por defecto en el marco del countdown, sin contador', () => {
      const wrapper = mount(JackpotCard, { props: { game: gameWithoutDraw } })
      expect(wrapper.find('.ui-countdown__framed-pending').text()).toBe('Pendiente')
      expect(wrapper.find('.ui-countdown__framed-value').exists()).toBe(false)
    })

    it('respeta la prop pendingLabel', () => {
      const wrapper = mount(JackpotCard, { props: { game: gameWithoutDraw, pendingLabel: 'Pending' } })
      expect(wrapper.find('.ui-countdown__framed-pending').text()).toBe('Pending')
    })

    it('no emite expire', async () => {
      const wrapper = mount(JackpotCard, { props: { game: gameWithoutDraw } })
      await vi.advanceTimersByTimeAsync(5000)
      expect(wrapper.emitted('expire')).toBeUndefined()
    })

    it('cuando se abre un nuevo sorteo (llega closesAt) pasa a mostrar el contador', async () => {
      const wrapper = mount(JackpotCard, { props: { game: gameWithoutDraw } })
      await wrapper.setProps({ game: { ...gameWithoutDraw, closesAt: Date.now() + 90_000 } })
      expect(wrapper.find('.ui-countdown__framed-pending').exists()).toBe(false)
      expect(wrapper.find('.ui-countdown__framed-value').exists()).toBe(true)
    })
  })

  describe('sin detailUrl', () => {
    it('no muestra el nombre, el logo ni "mas informacion" como links, pero el nombre sigue siendo un h3', () => {
      const wrapper = mount(JackpotCard, { props: { game: baseGame } })
      expect(wrapper.find('.ui-jackpot-card__name a').exists()).toBe(false)
      expect(wrapper.find('.ui-jackpot-card__name').element.tagName).toBe('H3')
      expect(wrapper.find('.ui-jackpot-card__name').text()).toBe('Powerball')
      expect(wrapper.find('a.ui-jackpot-card__balls').exists()).toBe(false)
      expect(wrapper.find('.ui-jackpot-card__more-info').exists()).toBe(false)
    })
  })

  describe('con detailUrl', () => {
    const gameWithUrl: JackpotGame = { ...baseGame, detailUrl: '/loterias/powerball' }

    it('el nombre sigue siendo un h3, con un link adentro apuntando al detalle', () => {
      const wrapper = mount(JackpotCard, { props: { game: gameWithUrl } })
      const name = wrapper.find('.ui-jackpot-card__name')
      expect(name.element.tagName).toBe('H3')
      const link = name.find('a')
      expect(link.exists()).toBe(true)
      expect(link.attributes('href')).toBe('/loterias/powerball')
      expect(link.text()).toBe('Powerball')
    })

    it('el logo/balls se vuelve un link al detalle, con aria-label accesible', () => {
      const wrapper = mount(JackpotCard, { props: { game: gameWithUrl } })
      const link = wrapper.find('a.ui-jackpot-card__balls')
      expect(link.attributes('href')).toBe('/loterias/powerball')
      expect(link.attributes('aria-label')).toContain('Powerball')
      expect(link.findAll('.ui-lottery-ball')).toHaveLength(2)
    })

    it('muestra el link "mas informacion" debajo del proximo sorteo', () => {
      const wrapper = mount(JackpotCard, { props: { game: gameWithUrl } })
      const link = wrapper.find('.ui-jackpot-card__more-info')
      expect(link.attributes('href')).toBe('/loterias/powerball')
      expect(link.text()).toBe('Más información de la lotería')
    })

    it('respeta la prop moreInfoLabel', () => {
      const wrapper = mount(JackpotCard, {
        props: { game: gameWithUrl, moreInfoLabel: 'Más información del Grupo' },
      })
      expect(wrapper.find('.ui-jackpot-card__more-info').text()).toBe('Más información del Grupo')
    })
  })
})
