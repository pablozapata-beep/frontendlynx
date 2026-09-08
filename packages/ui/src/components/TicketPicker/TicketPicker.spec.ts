import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import TicketPicker from './TicketPicker.vue'
import type { RangeTicketPayload, Ticket } from './types'
import type { JackpotGame } from '../JackpotCard/types'

const rangeGame: JackpotGame = {
  id: 'powerball',
  name: 'Powerball',
  region: 'Estados Unidos',
  balls: [{ id: 'pb', label: 'PB', background: '#E4002B' }],
  jackpotAmount: 350_000_000,
  price: 3,
  drawLabel: 'Sábado 22:00',
  closesAt: Date.now() + 60_000,
  config: {
    kind: 'range',
    mainCount: 2,
    mainMin: 1,
    mainMax: 10,
    bonusCount: 1,
    bonusMin: 1,
    bonusMax: 5,
    defaultPlays: 2,
  },
}

const fixedGame: JackpotGame = {
  id: 'loteria-nacional',
  name: 'Lotería Nacional',
  region: 'España',
  balls: [{ id: 'ln', label: 'LN', background: '#8A6E2E' }],
  jackpotAmount: 300_000,
  price: 3,
  currency: '€',
  drawLabel: 'Jueves 21:15',
  closesAt: Date.now() + 60_000,
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

afterEach(() => {
  document.body.innerHTML = ''
})

function numberGridButtons(index: number) {
  return document.querySelectorAll('.ui-number-grid')[index]!.querySelectorAll('.ui-number-grid__cell')
}

function findButtonByText(text: string) {
  return [...document.querySelectorAll('button')].find((b) => b.textContent?.includes(text))!
}

// Cada click real de usuario ocurre en un tick del navegador separado, muy por
// detras de un microtask de Vue — por eso esperamos un nextTick entre cada uno:
// sin eso, dos clicks sincronos sobre el mismo NumberGrid leen un modelValue
// todavia viejo (el padre no re-renderizo entre uno y otro) y el segundo pisa
// al primero en vez de acumularse.
async function buildOneManualLine() {
  const mainButtons = numberGridButtons(0)
  ;(mainButtons[0] as HTMLElement).click()
  await nextTick()
  ;(numberGridButtons(0)[1] as HTMLElement).click()
  await nextTick()
  const bonusButtons = numberGridButtons(1)
  ;(bonusButtons[0] as HTMLElement).click()
  await nextTick()
}

describe('TicketPicker', () => {
  it('no renderiza nada cuando open es false', () => {
    mount(TicketPicker, { props: { game: rangeGame, open: false } })
    expect(document.querySelector('.ui-modal-backdrop')).toBeNull()
  })

  it('muestra el flujo de rango para un juego "range"', () => {
    mount(TicketPicker, { props: { game: rangeGame, open: true } })
    expect(document.querySelector('.ui-range-flow')).not.toBeNull()
    expect(document.querySelector('.ui-fixed-flow')).toBeNull()
  })

  it('muestra el flujo de decimos para un juego "fixed"', () => {
    mount(TicketPicker, { props: { game: fixedGame, open: true } })
    expect(document.querySelector('.ui-fixed-flow')).not.toBeNull()
    expect(document.querySelector('.ui-range-flow')).toBeNull()
  })

  it('el submit arranca deshabilitado hasta que se arma algo', () => {
    mount(TicketPicker, { props: { game: rangeGame, open: true } })
    expect(findButtonByText('Agregar al carrito').hasAttribute('disabled')).toBe(true)
  })

  it('arma una linea manual completa y actualiza lista + total', async () => {
    mount(TicketPicker, { props: { game: rangeGame, open: true } })

    await buildOneManualLine()

    const addLineBtn = findButtonByText('Agregar línea')
    expect(addLineBtn.hasAttribute('disabled')).toBe(false)
    addLineBtn.click()
    await nextTick()

    expect(document.querySelectorAll('.ui-ticket-lines-list__row')).toHaveLength(1)
    expect(findButtonByText('Agregar al carrito').hasAttribute('disabled')).toBe(false)
    expect(document.querySelector('.ui-ticket-picker__total-amount')!.textContent).toContain('3.00')
  })

  it('el modo sorpresa agrega numPlays lineas de una', async () => {
    mount(TicketPicker, { props: { game: rangeGame, open: true } })

    const surpriseTab = [...document.querySelectorAll('[role="radio"]')].find(
      (b) => b.textContent === 'Sorpresa',
    ) as HTMLElement
    surpriseTab.click()
    await nextTick()

    findButtonByText('Agregar líneas sorpresa').click()
    await nextTick()

    expect(document.querySelectorAll('.ui-ticket-lines-list__row')).toHaveLength(2)
  })

  it('el flujo de decimos actualiza el total al subir la cantidad y cruzar el umbral de descuento', async () => {
    mount(TicketPicker, { props: { game: fixedGame, open: true } })
    const totalAmount = document.querySelector('.ui-ticket-picker__total-amount')!
    expect(totalAmount.textContent).toContain('€3.00')

    const sumarBtn = document.querySelectorAll('[aria-label="Sumar"]')[0] as HTMLElement
    for (let i = 0; i < 4; i++) {
      sumarBtn.click()
      await nextTick()
    }

    expect(totalAmount.textContent).toContain('€13.50')
  })

  it('cambiar de opcion en el flujo de decimos usa la cantidad guardada de esa opcion', async () => {
    mount(TicketPicker, { props: { game: fixedGame, open: true } })
    const radios = document.querySelectorAll('[role="radio"]')
    ;(radios[2] as HTMLElement).click() // "entero"
    await nextTick()

    const totalAmount = document.querySelector('.ui-ticket-picker__total-amount')!
    expect(totalAmount.textContent).toContain('€25.00')
  })

  it('submit emite un Ticket con el payload y total correctos', async () => {
    const wrapper = mount(TicketPicker, { props: { game: rangeGame, open: true } })
    await buildOneManualLine()
    findButtonByText('Agregar línea').click()
    await nextTick()

    findButtonByText('Agregar al carrito').click()

    const emitted = wrapper.emitted('submit')
    expect(emitted).toHaveLength(1)
    const ticket = emitted![0]![0] as Ticket
    expect(ticket.gameId).toBe('powerball')
    expect(ticket.total).toBe(3)
    expect(ticket.payload.kind).toBe('range')
    expect((ticket.payload as RangeTicketPayload).lines).toHaveLength(1)
  })

  it('emite close al clickear el boton de cerrar del modal', () => {
    const wrapper = mount(TicketPicker, { props: { game: rangeGame, open: true } })
    ;(document.querySelector('.ui-modal-close') as HTMLElement).click()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('resetea el estado al reabrir con un juego distinto', async () => {
    const wrapper = mount(TicketPicker, { props: { game: rangeGame, open: false } })
    await wrapper.setProps({ open: true })

    await buildOneManualLine()
    findButtonByText('Agregar línea').click()
    await nextTick()
    expect(document.querySelectorAll('.ui-ticket-lines-list__row')).toHaveLength(1)

    await wrapper.setProps({ open: false })
    await wrapper.setProps({ game: fixedGame, open: true })

    expect(document.querySelector('.ui-fixed-flow')).not.toBeNull()
    expect(document.querySelectorAll('.ui-ticket-lines-list__row')).toHaveLength(0)
  })
})
