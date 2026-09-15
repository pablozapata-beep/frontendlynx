import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import GamePlayerToolbar from './GamePlayerToolbar.vue'

describe('GamePlayerToolbar', () => {
  it('renderiza el switch Demo/Juego Real con el modo activo', () => {
    const wrapper = mount(GamePlayerToolbar, { props: { mode: 'real' } })
    const active = wrapper.find('.ui-pill-toggle-group__pill--active')
    expect(active.text()).toBe('Juego Real')
  })

  it('emite update:mode al cambiar el pill activo', async () => {
    const wrapper = mount(GamePlayerToolbar, { props: { mode: 'demo' } })
    const pills = wrapper.findAll('.ui-pill-toggle-group__pill')
    await pills[1].trigger('click')
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

  it('emite screenshot y refresh al clickear sus botones', async () => {
    const wrapper = mount(GamePlayerToolbar, { props: { mode: 'demo' } })
    await wrapper.find('[aria-label="Capturar pantalla"]').trigger('click')
    await wrapper.find('[aria-label="Recargar"]').trigger('click')
    expect(wrapper.emitted('screenshot')).toHaveLength(1)
    expect(wrapper.emitted('refresh')).toHaveLength(1)
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
