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
  detailUrl: '/loterias/powercombo',
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

  it('reenvia el logoUrl de cada ball a LotteryBallBadge, igual que JackpotCard', () => {
    const withLogos: LotteryGroup = {
      ...baseGroup,
      balls: [
        { id: 'pb', label: 'PB', background: '#E4002B', logoUrl: 'https://example.com/pb.png' },
        { id: 'mm', label: 'MM', background: '#3E7BE8' },
      ],
    }
    const wrapper = mount(LotteryTeamCard, { props: { group: withLogos } })
    const images = wrapper.findAll('.ui-lottery-ball__logo')
    expect(images).toHaveLength(1)
    expect(images[0].attributes('src')).toBe('https://example.com/pb.png')
    expect(images[0].attributes('alt')).toBe('PB')
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

  it('muestra "Faltan N para que juegue" cuando no se alcanzo el minimo, con el pill en variant info', () => {
    const wrapper = mount(LotteryTeamCard, { props: { group: baseGroup } })
    expect(wrapper.text()).toContain('Faltan 54 para que juegue')
    expect(wrapper.find('.ui-pill').classes()).toContain('ui-pill--info')
  })

  it('muestra "Listo para jugar" y el proximo sorteo cuando se alcanzo el minimo, con el pill en variant gold', () => {
    const locked = { ...baseGroup, options: baseGroup.options.map((o) => ({ ...o, sold: 120 })) }
    const wrapper = mount(LotteryTeamCard, { props: { group: locked } })
    expect(wrapper.text()).toContain('Listo para jugar')
    expect(wrapper.text()).toContain('Sortea 12 de julio')
    expect(wrapper.find('.ui-pill').classes()).toContain('ui-pill--gold')
  })

  it('con isClosingSoon muestra las participaciones restantes en vez del estado de minimo, con el pill en variant danger', () => {
    const wrapper = mount(LotteryTeamCard, { props: { group: baseGroup, isClosingSoon: true } })
    expect(wrapper.text()).toContain('Cierra pronto – quedan 104 participaciones')
    expect(wrapper.find('.ui-pill').classes()).toContain('ui-pill--danger')
  })

  it('emite join con el grupo y el indice de opcion seleccionado', async () => {
    const wrapper = mount(LotteryTeamCard, { props: { group: baseGroup } })
    await wrapper.findAll('.ui-pill-toggle-group__pill')[1].trigger('click')
    await wrapper.find('.ui-button').trigger('click')
    expect(wrapper.emitted('join')?.[0]).toEqual([{ group: baseGroup, optionIndex: 1 }])
  })

  it('sin nextDrawDate no muestra countdown ni el label de cerrado', () => {
    const wrapper = mount(LotteryTeamCard, { props: { group: baseGroup } })
    expect(wrapper.find('.ui-lottery-team-card__countdown').exists()).toBe(false)
  })

  it('muestra el countdown minimal cuando la opcion activa tiene nextDrawDate', () => {
    const withDraw = {
      ...baseGroup,
      options: [{ ...baseGroup.options[0], nextDrawDate: Date.now() + (9 * 3600 + 36 * 60 + 33) * 1000 }],
    }
    const wrapper = mount(LotteryTeamCard, { props: { group: withDraw } })
    expect(wrapper.find('.ui-lottery-team-card__countdown').text()).toBe('Cierra en 09:36:33')
  })

  it('al expirar el countdown pasa a mostrar el label de cerrado', async () => {
    const withDraw = {
      ...baseGroup,
      options: [{ ...baseGroup.options[0], nextDrawDate: Date.now() + 1000 }],
    }
    const wrapper = mount(LotteryTeamCard, { props: { group: withDraw } })

    await vi.advanceTimersByTimeAsync(1000)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.ui-lottery-team-card__countdown--closed').text()).toBe('Grupo Cerrado')
  })

  it('al cambiar de opcion, el countdown se resetea para la nueva fecha', async () => {
    const withDraw = {
      ...baseGroup,
      options: [
        { ...baseGroup.options[0], nextDrawDate: Date.now() + 1000 },
        { ...baseGroup.options[1], nextDrawDate: Date.now() + (2 * 3600 + 5 * 60) * 1000 },
      ],
    }
    const wrapper = mount(LotteryTeamCard, { props: { group: withDraw } })

    await vi.advanceTimersByTimeAsync(1000)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.ui-lottery-team-card__countdown--closed').exists()).toBe(true)

    await wrapper.findAll('.ui-pill-toggle-group__pill')[1].trigger('click')
    expect(wrapper.find('.ui-lottery-team-card__countdown--closed').exists()).toBe(false)
    // 02:05:00 menos el segundo que ya avanzamos con vi.advanceTimersByTimeAsync arriba
    // (ambas fechas se calcularon relativas al mismo "ahora" inicial).
    expect(wrapper.find('.ui-lottery-team-card__countdown').text()).toBe('Cierra en 02:04:59')
  })

  it('muestra el link "mas informacion" solo si hay detailUrl', () => {
    const withLink = mount(LotteryTeamCard, { props: { group: baseGroup } })
    expect(withLink.find('.ui-lottery-team-card__more-info').exists()).toBe(true)

    const withoutLink = mount(LotteryTeamCard, {
      props: { group: { ...baseGroup, detailUrl: undefined } },
    })
    expect(withoutLink.find('.ui-lottery-team-card__more-info').exists()).toBe(false)
  })

  describe('con detailUrl', () => {
    it('el nombre sigue siendo un h3, con un link adentro apuntando al detalle', () => {
      const wrapper = mount(LotteryTeamCard, { props: { group: baseGroup } })
      const name = wrapper.find('.ui-lottery-team-card__name')
      expect(name.element.tagName).toBe('H3')
      const link = name.find('a')
      expect(link.exists()).toBe(true)
      expect(link.attributes('href')).toBe('/loterias/powercombo')
      expect(link.text()).toBe('Powercombo')
    })

    it('el logo/balls se vuelve un link al detalle, con aria-label accesible', () => {
      const wrapper = mount(LotteryTeamCard, { props: { group: baseGroup } })
      const link = wrapper.find('a.ui-lottery-team-card__balls')
      expect(link.attributes('href')).toBe('/loterias/powercombo')
      expect(link.attributes('aria-label')).toContain('Powercombo')
      expect(link.findAll('.ui-lottery-ball')).toHaveLength(2)
    })

    it('muestra el link "mas informacion" apuntando al mismo detailUrl', () => {
      const wrapper = mount(LotteryTeamCard, { props: { group: baseGroup } })
      const link = wrapper.find('.ui-lottery-team-card__more-info')
      expect(link.attributes('href')).toBe('/loterias/powercombo')
      expect(link.text()).toBe('Más información del Grupo')
    })
  })

  describe('sin detailUrl', () => {
    const groupWithoutUrl = { ...baseGroup, detailUrl: undefined }

    it('el nombre no tiene link adentro y las balls no son clickables', () => {
      const wrapper = mount(LotteryTeamCard, { props: { group: groupWithoutUrl } })
      const name = wrapper.find('.ui-lottery-team-card__name')
      expect(name.element.tagName).toBe('H3')
      expect(name.find('a').exists()).toBe(false)
      expect(name.text()).toBe('Powercombo')
      expect(wrapper.find('a.ui-lottery-team-card__balls').exists()).toBe(false)
    })
  })
})
