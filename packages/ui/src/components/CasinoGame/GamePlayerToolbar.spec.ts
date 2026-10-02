import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import GamePlayerToolbar from './GamePlayerToolbar.vue'

describe('GamePlayerToolbar', () => {
  it('renderiza el switch Demo/Juego Real con el modo activo', () => {
    const wrapper = mount(GamePlayerToolbar, { props: { mode: 'real' } })
    const active = wrapper.find('.ui-segmented-toggle__option--active')
    expect(active.text()).toBe('Jugar')
  })

  it('emite update:mode al cambiar la opcion activa', async () => {
    const wrapper = mount(GamePlayerToolbar, { props: { mode: 'demo' } })
    const options = wrapper.findAll('.ui-segmented-toggle__option')
    await options[1].trigger('click')
    expect(wrapper.emitted('update:mode')?.[0]).toEqual(['real'])
  })

  it('togglea fullscreen al clickear su boton', async () => {
    const wrapper = mount(GamePlayerToolbar, { props: { mode: 'demo', fullscreen: false } })
    await wrapper.find('[aria-label="Pantalla completa"]').trigger('click')
    expect(wrapper.emitted('update:fullscreen')?.[0]).toEqual([true])
  })

  it('togglea floating al clickear su boton', async () => {
    const wrapper = mount(GamePlayerToolbar, { props: { mode: 'demo', floating: true } })
    await wrapper.find('[aria-label="Ventana flotante"]').trigger('click')
    expect(wrapper.emitted('update:floating')?.[0]).toEqual([false])
  })

  it('togglea favorite al clickear su boton', async () => {
    const wrapper = mount(GamePlayerToolbar, { props: { mode: 'demo', favorite: false } })
    await wrapper.find('[aria-label="Favorito"]').trigger('click')
    expect(wrapper.emitted('update:favorite')?.[0]).toEqual([true])
  })

  it('solo tiene los botones de pantalla completa, favorito y ventana flotante', () => {
    const wrapper = mount(GamePlayerToolbar, { props: { mode: 'demo' } })
    const buttons = wrapper.findAll('.ui-game-player-toolbar__icon-btn')
    expect(buttons.map((b) => b.attributes('aria-label'))).toEqual([
      'Pantalla completa',
      'Favorito',
      'Ventana flotante',
    ])
  })

  it('favorito y ventana flotante se marcan como desktop-only (se ocultan en mobile); pantalla completa no', () => {
    const wrapper = mount(GamePlayerToolbar, { props: { mode: 'demo' } })
    const hasMarker = (label: string) =>
      wrapper
        .find(`[aria-label="${label}"]`)
        .classes()
        .includes('ui-game-player-toolbar__icon-btn--desktop-only')
    expect(hasMarker('Pantalla completa')).toBe(false)
    expect(hasMarker('Favorito')).toBe(true)
    expect(hasMarker('Ventana flotante')).toBe(true)
  })

  it('cada boton tiene un tooltip con su label, que respeta los labels custom', () => {
    const wrapper = mount(GamePlayerToolbar, {
      props: { mode: 'demo', favoriteLabel: 'Agregar a favoritos' },
    })
    const tooltips = wrapper
      .findAll('.ui-game-player-toolbar__icon-btn')
      .map((b) => b.attributes('data-tooltip'))
    expect(tooltips).toEqual(['Pantalla completa', 'Agregar a favoritos', 'Ventana flotante'])
  })

  describe('pill de saldo', () => {
    it('no se muestra si no se pasa balance', () => {
      const wrapper = mount(GamePlayerToolbar, { props: { mode: 'demo' } })
      expect(wrapper.find('.ui-balance-pill').exists()).toBe(false)
    })

    it('se muestra con el saldo, la moneda y los labels que recibe el toolbar', () => {
      const wrapper = mount(GamePlayerToolbar, {
        props: {
          mode: 'demo',
          balance: 500,
          currency: 'us$',
          balanceLabel: 'Tu saldo',
          addBalanceLabel: 'Recargar',
        },
      })
      expect(wrapper.find('.ui-balance-pill__label').text()).toBe('Tu saldo')
      expect(wrapper.find('.ui-balance-pill__amount').text()).toBe('us$500')
      expect(wrapper.find('.ui-balance-pill__add').attributes('aria-label')).toBe('Recargar')
    })

    it('reenvia lowBalanceThreshold, lowBalanceLabel y noBalanceLabel', () => {
      const low = mount(GamePlayerToolbar, {
        props: { mode: 'real', balance: 30, lowBalanceThreshold: 20 },
      })
      expect(low.find('.ui-balance-pill').classes()).not.toContain('ui-balance-pill--low')

      const custom = mount(GamePlayerToolbar, {
        props: { mode: 'real', balance: 0, noBalanceLabel: 'Saldo agotado' },
      })
      expect(custom.find('.ui-balance-pill__label').text()).toBe('Saldo agotado')
    })

    it('re-emite addBalance cuando el pill emite add', async () => {
      const wrapper = mount(GamePlayerToolbar, { props: { mode: 'demo', balance: 500 } })
      await wrapper.find('.ui-balance-pill__add').trigger('click')
      expect(wrapper.emitted('addBalance')).toHaveLength(1)
    })
  })

  it('muestra el contador de favoritos cuando se pasa', () => {
    const wrapper = mount(GamePlayerToolbar, { props: { mode: 'demo', favoriteCount: 838 } })
    expect(wrapper.find('.ui-game-player-toolbar__favorite-count').text()).toBe('838')
  })

  it('aplica el modificador activo a fullscreen/floating/favorite segun sus props', () => {
    const wrapper = mount(GamePlayerToolbar, {
      props: { mode: 'demo', fullscreen: true, floating: false, favorite: true },
    })
    expect(wrapper.find('[aria-label="Pantalla completa"]').classes()).toContain(
      'ui-game-player-toolbar__icon-btn--active',
    )
    expect(wrapper.find('[aria-label="Ventana flotante"]').classes()).not.toContain(
      'ui-game-player-toolbar__icon-btn--active',
    )
    expect(wrapper.find('[aria-label="Favorito"]').classes()).toContain('ui-game-player-toolbar__icon-btn--active')
  })
})
