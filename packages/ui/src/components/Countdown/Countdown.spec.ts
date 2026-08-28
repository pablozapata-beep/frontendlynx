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
})
