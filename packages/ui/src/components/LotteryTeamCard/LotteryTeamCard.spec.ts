import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LotteryTeamCard from './LotteryTeamCard.vue'
import type { LotteryGroup } from './types'

const baseGroup: LotteryGroup = {
  id: 'powercombo',
  name: 'Powercombo',
  total: 150,
  balls: [
    { id: 'pb', label: 'PB', background: '#E4002B' },
    { id: 'mm', label: 'MM', background: '#3E7BE8' },
  ],
  jackpotAmount: 786_000_000,
  currency: 'us$',
  ticketsLabel: '20 Powerball · 20 Mega Millions por sorteo',
  partialPath: 'powercombo',
  options: [
    { id: '1m', label: '1 mes', sorteosLabel: '36 sorteos', price: 40, min: 100, sold: 46, nextDrawLabel: '12 de julio' },
    { id: '3m', label: '3 meses', sorteosLabel: '108 sorteos', price: 110, min: 100, sold: 46, nextDrawLabel: '12 de julio' },
  ],
}

describe('LotteryTeamCard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renderiza nombre, total y una LotteryBallBadge por ball', () => {
    const wrapper = mount(LotteryTeamCard, { props: { group: baseGroup } })
    expect(wrapper.find('.ui-lottery-team-card__name').text()).toBe('Powercombo')
    expect(wrapper.find('.ui-lottery-team-card__sub').text()).toBe('150 participaciones totales')
    expect(wrapper.findAll('.ui-lottery-ball')).toHaveLength(2)
  })

  it('formatea el jackpot en millones', () => {
    const wrapper = mount(LotteryTeamCard, { props: { group: baseGroup } })
    expect(wrapper.find('.ui-lottery-team-card__jackpot-amount').text()).toBe('786')
    expect(wrapper.find('.ui-lottery-team-card__jackpot-word').text()).toBe('millones')
  })

  it('usa la primera opcion por defecto en el price row', () => {
    const wrapper = mount(LotteryTeamCard, { props: { group: baseGroup } })
    expect(wrapper.find('.ui-lottery-team-card__price').text()).toBe('$40')
    expect(wrapper.find('.ui-lottery-team-card__price-unit').text()).toContain('36 sorteos')
  })

  it('cambiar el pill de duracion actualiza el precio activo', async () => {
    const wrapper = mount(LotteryTeamCard, { props: { group: baseGroup } })
    const pills = wrapper.findAll('.ui-pill-toggle-group__pill')
    await pills[1].trigger('click')
    expect(wrapper.find('.ui-lottery-team-card__price').text()).toBe('$110')
  })

  it('no muestra los pills de duracion si solo hay una opcion', () => {
    const wrapper = mount(LotteryTeamCard, {
      props: { group: { ...baseGroup, options: [baseGroup.options[0]] } },
    })
    expect(wrapper.find('.ui-pill-toggle-group').exists()).toBe(false)
  })

  it('muestra "Faltan N para que juegue" cuando no se alcanzo el minimo', () => {
    const wrapper = mount(LotteryTeamCard, { props: { group: baseGroup } })
    expect(wrapper.text()).toContain('Faltan 54 para que juegue')
  })

  it('muestra "Listo para jugar" y el proximo sorteo cuando se alcanzo el minimo', () => {
    const locked = { ...baseGroup, options: baseGroup.options.map((o) => ({ ...o, sold: 120 })) }
    const wrapper = mount(LotteryTeamCard, { props: { group: locked } })
    expect(wrapper.text()).toContain('Listo para jugar')
    expect(wrapper.text()).toContain('Sortea 12 de julio')
  })

  it('con isClosingSoon muestra las participaciones restantes en vez del estado de minimo', () => {
    const wrapper = mount(LotteryTeamCard, { props: { group: baseGroup, isClosingSoon: true } })
    expect(wrapper.text()).toContain('Cierra pronto – quedan 104 participaciones')
  })

  it('emite join con el grupo y el indice de opcion seleccionado', async () => {
    const wrapper = mount(LotteryTeamCard, { props: { group: baseGroup } })
    await wrapper.findAll('.ui-pill-toggle-group__pill')[1].trigger('click')
    await wrapper.find('.ui-button').trigger('click')
    expect(wrapper.emitted('join')?.[0]).toEqual([{ group: baseGroup, optionIndex: 1 }])
  })

  it('emite moreInfo al clickear el link, solo si hay partialPath', () => {
    const withLink = mount(LotteryTeamCard, { props: { group: baseGroup } })
    expect(withLink.find('.ui-lottery-team-card__more-info').exists()).toBe(true)

    const withoutLink = mount(LotteryTeamCard, {
      props: { group: { ...baseGroup, partialPath: undefined } },
    })
    expect(withoutLink.find('.ui-lottery-team-card__more-info').exists()).toBe(false)
  })
})
