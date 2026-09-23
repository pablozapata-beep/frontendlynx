import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Countdown from './Countdown.vue'

describe('Countdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('muestra el label cuando se provee', () => {
    const wrapper = mount(Countdown, {
      props: { target: Date.now() + 60_000, label: 'Cierre de ventas en' },
    })
    expect(wrapper.find('.ui-countdown__label').text()).toBe('Cierre de ventas en')
  })

  it('no renderiza el label cuando no se provee', () => {
    const wrapper = mount(Countdown, { props: { target: Date.now() + 60_000 } })
    expect(wrapper.find('.ui-countdown__label').exists()).toBe(false)
  })

  it('calcula dias/horas/minutos/segundos restantes', () => {
    const target = Date.now() + (2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000
    const wrapper = mount(Countdown, { props: { target } })
    const tiles = wrapper.findAll('.ui-countdown__tile')
    expect(tiles.map((t) => t.text())).toEqual(['02', '03', '04', '05'])
  })

  it('se actualiza cada segundo', async () => {
    const target = Date.now() + 5000
    const wrapper = mount(Countdown, { props: { target } })
    expect(wrapper.findAll('.ui-countdown__tile').at(-1)?.text()).toBe('05')

    await vi.advanceTimersByTimeAsync(1000)
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.ui-countdown__tile').at(-1)?.text()).toBe('04')
  })

  it('emite expire una sola vez al llegar a cero y detiene el timer', async () => {
    const target = Date.now() + 1000
    const wrapper = mount(Countdown, { props: { target } })

    await vi.advanceTimersByTimeAsync(1000)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('expire')).toHaveLength(1)
    expect(wrapper.findAll('.ui-countdown__tile').map((t) => t.text())).toEqual([
      '00',
      '00',
      '00',
      '00',
    ])

    await vi.advanceTimersByTimeAsync(5000)
    expect(wrapper.emitted('expire')).toHaveLength(1)
  })

  it('emite expire de inmediato si el target ya paso', async () => {
    const wrapper = mount(Countdown, { props: { target: Date.now() - 1000 } })
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('expire')).toHaveLength(1)
  })

  describe('variant="minimal"', () => {
    it('muestra HH:MM:SS sin dias cuando falta menos de un dia', () => {
      const target = Date.now() + (9 * 3600 + 36 * 60 + 33) * 1000
      const wrapper = mount(Countdown, { props: { target, variant: 'minimal' } })
      expect(wrapper.find('.ui-countdown__value').text()).toBe('09:36:33')
      expect(wrapper.find('.ui-countdown__tile').exists()).toBe(false)
    })

    it('antepone "N Días" cuando falta un dia o mas, con pluralizacion', () => {
      const twoDays = Date.now() + (2 * 86400 + 11 * 3600 + 15 * 60 + 33) * 1000
      const wrapper = mount(Countdown, { props: { target: twoDays, variant: 'minimal' } })
      expect(wrapper.find('.ui-countdown__value').text()).toBe('2 Días 11:15:33')

      const oneDay = Date.now() + (1 * 86400 + 8 * 3600 + 15 * 60 + 0) * 1000
      const singular = mount(Countdown, { props: { target: oneDay, variant: 'minimal' } })
      expect(singular.find('.ui-countdown__value').text()).toBe('1 Día 08:15:00')
    })

    it('respeta formatDays custom', () => {
      const target = Date.now() + (3 * 86400 * 1000 + 1000)
      const wrapper = mount(Countdown, {
        props: { target, variant: 'minimal', formatDays: (d: number) => `d${d}` },
      })
      expect(wrapper.find('.ui-countdown__value').text()).toContain('3 d3')
    })

    it('se sigue actualizando cada segundo y emitiendo expire igual que la variante tiles', async () => {
      const target = Date.now() + 1000
      const wrapper = mount(Countdown, { props: { target, variant: 'minimal' } })
      expect(wrapper.find('.ui-countdown__value').text()).toBe('00:00:01')

      await vi.advanceTimersByTimeAsync(1000)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.ui-countdown__value').text()).toBe('00:00:00')
      expect(wrapper.emitted('expire')).toHaveLength(1)
    })

    it('muestra el label arriba del valor, igual que en la variante tiles', () => {
      const wrapper = mount(Countdown, {
        props: { target: Date.now() + 60_000, variant: 'minimal', label: 'Cierra en' },
      })
      expect(wrapper.find('.ui-countdown__label').text()).toBe('Cierra en')
    })
  })

  describe('variant="framed"', () => {
    it('muestra dias/horas/minutos/segundos, cada uno con su label', () => {
      const target = Date.now() + (2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000
      const wrapper = mount(Countdown, { props: { target, variant: 'framed' } })
      const values = wrapper.findAll('.ui-countdown__framed-value')
      expect(values.map((v) => v.text())).toEqual(['02', '03', '04', '05'])

      const labels = wrapper.findAll('.ui-countdown__framed-label')
      expect(labels.map((l) => l.text())).toEqual(['d', 'h', 'm', 's'])
    })

    it('respeta los labels custom por unidad', () => {
      const target = Date.now() + (2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000
      const wrapper = mount(Countdown, {
        props: {
          target,
          variant: 'framed',
          dayLabel: 'días',
          hourLabel: 'hs',
          minuteLabel: 'min',
          secondLabel: 'seg',
        },
      })
      const labels = wrapper.findAll('.ui-countdown__framed-label')
      expect(labels.map((l) => l.text())).toEqual(['días', 'hs', 'min', 'seg'])
    })

    it('se sigue actualizando cada segundo y emitiendo expire igual que la variante tiles', async () => {
      const target = Date.now() + 1000
      const wrapper = mount(Countdown, { props: { target, variant: 'framed' } })
      expect(wrapper.findAll('.ui-countdown__framed-value').at(-1)?.text()).toBe('01')

      await vi.advanceTimersByTimeAsync(1000)
      await wrapper.vm.$nextTick()
      expect(wrapper.findAll('.ui-countdown__framed-value').at(-1)?.text()).toBe('00')
      expect(wrapper.emitted('expire')).toHaveLength(1)
    })
  })
})
