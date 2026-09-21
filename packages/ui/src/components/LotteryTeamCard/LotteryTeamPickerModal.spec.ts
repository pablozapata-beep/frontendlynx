import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import LotteryTeamPickerModal from './LotteryTeamPickerModal.vue'
import type { LotteryGroup } from './types'

const baseGroup: LotteryGroup = {
  id: 'powercombo',
  name: 'Powercombo',
  total: 150,
  balls: [{ id: 'pb', label: 'PB', background: '#E4002B' }],
  jackpotAmount: 786_000_000,
  currency: 'us$',
  ticketsLabel: '20 Powerball por sorteo',
  options: [{ id: '1m', label: '1 mes', sorteosLabel: '36 sorteos', price: 40, min: 100, sold: 46 }],
}

function findButtonByText(text: string) {
  return [...document.querySelectorAll('button')].find((b) => b.textContent?.trim() === text)!
}

describe('LotteryTeamPickerModal', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('renderiza nombre, duracion y balls del grupo cuando esta abierto', () => {
    mount(LotteryTeamPickerModal, { props: { open: true, group: baseGroup, optionIndex: 0 } })
    expect(document.querySelector('.ui-lottery-team-picker-modal__title')!.textContent).toBe('Powercombo')
    expect(document.querySelector('.ui-lottery-team-picker-modal__subtitle')!.textContent).toBe(
      '1 mes · 36 sorteos',
    )
    expect(document.querySelectorAll('.ui-lottery-ball')).toHaveLength(1)
  })

  it('no renderiza contenido si no hay group', () => {
    mount(LotteryTeamPickerModal, { props: { open: true } })
    expect(document.querySelector('.ui-lottery-team-picker-modal__title')).toBeNull()
  })

  it('el total inicial es 1 participacion al precio de la opcion', () => {
    mount(LotteryTeamPickerModal, { props: { open: true, group: baseGroup, optionIndex: 0 } })
    expect(document.querySelector('.ui-lottery-team-picker-modal__total-amount')!.textContent).toBe('$40')
  })

  it('el stepper actualiza el total', async () => {
    mount(LotteryTeamPickerModal, { props: { open: true, group: baseGroup, optionIndex: 0 } })
    ;(document.querySelector('[aria-label="Sumar"]') as HTMLElement).click()
    await nextTick()
    expect(document.querySelector('.ui-lottery-team-picker-modal__total-amount')!.textContent).toBe('$80')
  })

  it('el maximo del stepper respeta las participaciones disponibles, con tope 10', () => {
    const casiAgotado = { ...baseGroup, options: [{ ...baseGroup.options[0], sold: 147 }] }
    mount(LotteryTeamPickerModal, { props: { open: true, group: casiAgotado, optionIndex: 0 } })
    expect(document.querySelector('.ui-lottery-team-picker-modal__max-available')!.textContent).toBe(
      'Hasta 3 participaciones disponibles',
    )
  })

  it('confirmar agrega al carrito, deshabilita el boton y cierra el modal despues de un delay', async () => {
    const wrapper = mount(LotteryTeamPickerModal, {
      props: { open: true, group: baseGroup, optionIndex: 0 },
    })
    findButtonByText('Agregar al carrito').click()
    await nextTick()

    expect(wrapper.emitted('addToCart')?.[0]).toEqual([{ group: baseGroup, optionIndex: 0, quantity: 1 }])
    expect(findButtonByText('✓ Agregado').hasAttribute('disabled')).toBe(true)

    await vi.advanceTimersByTimeAsync(900)
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('sin nextDrawDate no muestra countdown ni el label de cerrado', () => {
    mount(LotteryTeamPickerModal, { props: { open: true, group: baseGroup, optionIndex: 0 } })
    expect(document.querySelector('.ui-lottery-team-picker-modal__countdown')).toBeNull()
  })

  it('muestra el countdown minimal cuando la opcion tiene nextDrawDate', () => {
    const withDraw = {
      ...baseGroup,
      options: [{ ...baseGroup.options[0], nextDrawDate: Date.now() + (9 * 3600 + 36 * 60 + 33) * 1000 }],
    }
    mount(LotteryTeamPickerModal, { props: { open: true, group: withDraw, optionIndex: 0 } })
    expect(document.querySelector('.ui-lottery-team-picker-modal__countdown')!.textContent).toBe(
      'Cierra en 09:36:33',
    )
  })

  it('al expirar el countdown pasa a mostrar el label de cerrado', async () => {
    const withDraw = {
      ...baseGroup,
      options: [{ ...baseGroup.options[0], nextDrawDate: Date.now() + 1000 }],
    }
    mount(LotteryTeamPickerModal, { props: { open: true, group: withDraw, optionIndex: 0 } })

    await vi.advanceTimersByTimeAsync(1000)
    await nextTick()

    expect(document.querySelector('.ui-lottery-team-picker-modal__countdown--closed')!.textContent).toBe(
      'Grupo Cerrado',
    )
  })

  it('reabrir el modal resetea cantidad y el estado de agregado', async () => {
    const wrapper = mount(LotteryTeamPickerModal, {
      props: { open: true, group: baseGroup, optionIndex: 0 },
    })
    ;(document.querySelector('[aria-label="Sumar"]') as HTMLElement).click()
    await nextTick()
    expect(document.querySelector('.ui-lottery-team-picker-modal__total-amount')!.textContent).toBe('$80')

    await wrapper.setProps({ open: false })
    await wrapper.setProps({ open: true })
    expect(document.querySelector('.ui-lottery-team-picker-modal__total-amount')!.textContent).toBe('$40')
  })
})
