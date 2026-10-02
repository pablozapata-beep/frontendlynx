import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BalancePill from './BalancePill.vue'

describe('BalancePill', () => {
  it('con saldo suficiente muestra "Saldo disponible", el monto y no esta en estado bajo', () => {
    const wrapper = mount(BalancePill, { props: { balance: 500 } })
    expect(wrapper.find('.ui-balance-pill__label').text()).toBe('Saldo disponible')
    expect(wrapper.find('.ui-balance-pill__amount').text()).toBe('$500')
    expect(wrapper.classes()).not.toContain('ui-balance-pill--low')
  })

  it('con saldo igual o menor al umbral pasa a estado bajo (rojo) con "Saldo bajo"', () => {
    const atThreshold = mount(BalancePill, { props: { balance: 200 } })
    expect(atThreshold.classes()).toContain('ui-balance-pill--low')
    expect(atThreshold.find('.ui-balance-pill__label').text()).toBe('Saldo bajo')

    const above = mount(BalancePill, { props: { balance: 201 } })
    expect(above.classes()).not.toContain('ui-balance-pill--low')
  })

  it('con saldo 0 muestra "Sin saldo"', () => {
    const wrapper = mount(BalancePill, { props: { balance: 0 } })
    expect(wrapper.find('.ui-balance-pill__label').text()).toBe('Sin saldo')
    expect(wrapper.classes()).toContain('ui-balance-pill--low')
  })

  it('respeta lowThreshold, currency y los labels custom', () => {
    const wrapper = mount(BalancePill, {
      props: {
        balance: 50,
        lowThreshold: 20,
        currency: 'us$',
        label: 'Tu saldo',
        addLabel: 'Recargar',
      },
    })
    expect(wrapper.classes()).not.toContain('ui-balance-pill--low')
    expect(wrapper.find('.ui-balance-pill__label').text()).toBe('Tu saldo')
    expect(wrapper.find('.ui-balance-pill__amount').text()).toBe('us$50')
    expect(wrapper.find('.ui-balance-pill__add-text').text()).toBe('Recargar')
  })

  it('se actualiza al cambiar el saldo y entra/sale del estado bajo', async () => {
    const wrapper = mount(BalancePill, { props: { balance: 500 } })
    await wrapper.setProps({ balance: 100 })
    expect(wrapper.classes()).toContain('ui-balance-pill--low')
    await wrapper.setProps({ balance: 900 })
    expect(wrapper.classes()).not.toContain('ui-balance-pill--low')
  })

  it('anuncia los cambios de saldo a lectores de pantalla (role=status, aria-live)', () => {
    const wrapper = mount(BalancePill, { props: { balance: 500 } })
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-live')).toBe('polite')
  })

  describe('boton de agregar saldo', () => {
    it('tiene icono "+", texto, aria-label y tooltip con el mismo label (el tooltip solo se ve en mobile)', () => {
      const wrapper = mount(BalancePill, { props: { balance: 500, addLabel: 'Recargar' } })
      const add = wrapper.find('.ui-balance-pill__add')
      expect(add.attributes('aria-label')).toBe('Recargar')
      expect(add.attributes('data-tooltip')).toBe('Recargar')
      expect(add.find('.ui-balance-pill__add-icon').exists()).toBe(true)
      expect(add.find('.ui-balance-pill__add-text').text()).toBe('Recargar')
    })

    it('emite add al clickearlo', async () => {
      const wrapper = mount(BalancePill, { props: { balance: 500 } })
      await wrapper.find('.ui-balance-pill__add').trigger('click')
      expect(wrapper.emitted('add')).toHaveLength(1)
    })
  })
})
