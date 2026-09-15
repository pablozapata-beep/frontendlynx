import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import GameBalanceModal from './GameBalanceModal.vue'
import type { BalanceOption } from './types'

const balances: BalanceOption[] = [
  { value: 'bcd', label: 'BCD (Balance de depósito)' },
  { value: 'usdt', label: 'USDT (Balance de depósito)' },
]

afterEach(() => {
  document.body.innerHTML = ''
})

describe('GameBalanceModal', () => {
  it('renderiza el selector de balances con la opcion seleccionada', () => {
    mount(GameBalanceModal, { props: { open: true, balances, modelValue: 'usdt' } })
    const select = document.querySelector('.ui-game-balance-modal__select') as HTMLSelectElement
    expect(select).not.toBeNull()
    expect(select.value).toBe('usdt')
    expect(select.querySelectorAll('option')).toHaveLength(2)
  })

  it('emite update:modelValue al cambiar el balance seleccionado', async () => {
    const wrapper = mount(GameBalanceModal, { props: { open: true, balances, modelValue: 'bcd' } })
    const select = document.querySelector('.ui-game-balance-modal__select') as HTMLSelectElement
    select.value = 'usdt'
    await select.dispatchEvent(new Event('change'))
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['usdt'])
  })

  it('los labels de los botones son "Depositar ahora" y "Juego Gratis" por defecto', () => {
    mount(GameBalanceModal, { props: { open: true, balances, modelValue: 'bcd' } })
    const buttons = [...document.querySelectorAll('.ui-button')].map((b) => b.textContent?.trim())
    expect(buttons).toContain('Depositar ahora')
    expect(buttons).toContain('Juego Gratis')
  })

  it('muestra el mensaje y el bono solo si se pasan', () => {
    mount(GameBalanceModal, {
      props: { open: true, balances, modelValue: 'bcd', message: 'Saldo insuficiente', bonusLabel: '+180%' },
    })
    expect(document.querySelector('.ui-game-balance-modal__message')?.textContent).toBe('Saldo insuficiente')
    expect(document.querySelector('.ui-game-balance-modal__bonus')?.textContent).toBe('+180%')
  })

  it('sin mensaje ni bono, no renderiza esos bloques', () => {
    mount(GameBalanceModal, { props: { open: true, balances, modelValue: 'bcd' } })
    expect(document.querySelector('.ui-game-balance-modal__message')).toBeNull()
    expect(document.querySelector('.ui-game-balance-modal__bonus')).toBeNull()
  })

  it('emite deposit y freePlay al clickear cada boton', () => {
    const wrapper = mount(GameBalanceModal, { props: { open: true, balances, modelValue: 'bcd' } })
    const buttons = [...document.querySelectorAll('.ui-button')] as HTMLElement[]
    const depositBtn = buttons.find((b) => b.textContent?.trim() === 'Depositar ahora')!
    const freePlayBtn = buttons.find((b) => b.textContent?.trim() === 'Juego Gratis')!

    depositBtn.click()
    freePlayBtn.click()

    expect(wrapper.emitted('deposit')).toHaveLength(1)
    expect(wrapper.emitted('freePlay')).toHaveLength(1)
  })

  it('emite close al cerrar el modal', () => {
    const wrapper = mount(GameBalanceModal, { props: { open: true, balances, modelValue: 'bcd' } })
    ;(document.querySelector('.ui-modal-close') as HTMLElement).click()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
