import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeader from './AppHeader.vue'

describe('AppHeader', () => {
  it('es un <header> con hamburguesa y sticky por defecto', () => {
    const wrapper = mount(AppHeader)
    expect(wrapper.element.tagName).toBe('HEADER')
    expect(wrapper.find('[aria-label="Abrir menú"]').exists()).toBe(true)
    expect(wrapper.classes()).toContain('ui-app-header--sticky')
  })

  it('sticky=false quita el modificador', () => {
    expect(mount(AppHeader, { props: { sticky: false } }).classes()).not.toContain('ui-app-header--sticky')
  })

  it('renderiza el slot logo, y no el contenedor si no hay slot', () => {
    const withLogo = mount(AppHeader, { slots: { logo: '<img class="mi-logo" />' } })
    expect(withLogo.find('.ui-app-header__logo .mi-logo').exists()).toBe(true)
    expect(mount(AppHeader).find('.ui-app-header__logo').exists()).toBe(false)
  })

  describe('logo clickable', () => {
    it('con logoHref envuelve el slot en un <a> con aria-label accesible', () => {
      const wrapper = mount(AppHeader, {
        props: { logoHref: '/' },
        slots: { logo: '<img class="mi-logo" alt="" />' },
      })
      const link = wrapper.find('a.ui-app-header__logo-link')
      expect(link.attributes('href')).toBe('/')
      expect(link.attributes('aria-label')).toBe('Ir al inicio')
      expect(link.find('.mi-logo').exists()).toBe(true)
    })

    it('respeta logoLabel', () => {
      const wrapper = mount(AppHeader, {
        props: { logoHref: '/', logoLabel: 'Volver a MARCA' },
        slots: { logo: '<img />' },
      })
      expect(wrapper.find('.ui-app-header__logo-link').attributes('aria-label')).toBe('Volver a MARCA')
    })

    it('emite logo con el MouseEvent, que se puede cancelar para navegar con el router', async () => {
      const wrapper = mount(AppHeader, {
        props: { logoHref: '/', onLogo: (event: MouseEvent) => event.preventDefault() },
        slots: { logo: '<img />' },
      })
      const event = new MouseEvent('click', { bubbles: true, cancelable: true })
      wrapper.find('a.ui-app-header__logo-link').element.dispatchEvent(event)
      expect(wrapper.emitted('logo')).toHaveLength(1)
      expect(event.defaultPrevented).toBe(true)
    })

    it('sin logoHref no agrega ningun link: el slot va tal cual (ej. tu propio <router-link>)', () => {
      const wrapper = mount(AppHeader, { slots: { logo: '<a class="propio" href="/home">Logo</a>' } })
      expect(wrapper.find('.ui-app-header__logo-link').exists()).toBe(false)
      expect(wrapper.findAll('.ui-app-header__logo a')).toHaveLength(1)
    })
  })

  describe('hamburguesa', () => {
    it('emite menu al clickear, sin decidir por si sola abrir nada', async () => {
      const wrapper = mount(AppHeader)
      await wrapper.find('[aria-label="Abrir menú"]').trigger('click')
      expect(wrapper.emitted('menu')).toHaveLength(1)
    })

    it('menuOpen se refleja en aria-expanded', () => {
      expect(mount(AppHeader).find('[aria-label="Abrir menú"]').attributes('aria-expanded')).toBe('false')
      expect(
        mount(AppHeader, { props: { menuOpen: true } }).find('[aria-label="Abrir menú"]').attributes('aria-expanded'),
      ).toBe('true')
    })
  })

  describe('sin sesion', () => {
    it('muestra Ingresar y Registrarse, y no el saldo ni el usuario', () => {
      const wrapper = mount(AppHeader)
      const buttons = wrapper.findAll('.ui-app-header__session .ui-button')
      expect(buttons.map((b) => b.text())).toEqual(['Ingresar', 'Registrarse'])
      expect(wrapper.find('.ui-balance-pill').exists()).toBe(false)
      expect(wrapper.find('[aria-label="Mi cuenta"]').exists()).toBe(false)
    })

    it('emite login y signup', async () => {
      const wrapper = mount(AppHeader)
      const [login, signup] = wrapper.findAll('.ui-app-header__session .ui-button')
      await login.trigger('click')
      await signup.trigger('click')
      expect(wrapper.emitted('login')).toHaveLength(1)
      expect(wrapper.emitted('signup')).toHaveLength(1)
    })

    it('respeta los labels custom', () => {
      const wrapper = mount(AppHeader, { props: { loginLabel: 'Entrar', signupLabel: 'Crear cuenta' } })
      expect(wrapper.findAll('.ui-app-header__session .ui-button').map((b) => b.text())).toEqual([
        'Entrar',
        'Crear cuenta',
      ])
    })

    it('el slot guest reemplaza a los botones', () => {
      const wrapper = mount(AppHeader, { slots: { guest: '<a class="custom" href="/x">Mi acceso</a>' } })
      expect(wrapper.find('.custom').exists()).toBe(true)
      expect(wrapper.find('.ui-app-header__session .ui-button').exists()).toBe(false)
    })
  })

  describe('con sesion', () => {
    it('muestra el saldo y el icono de usuario, y no los botones de acceso', () => {
      const wrapper = mount(AppHeader, { props: { loggedIn: true, balance: 1500 } })
      expect(wrapper.find('.ui-balance-pill__amount').text()).toBe('$1500')
      expect(wrapper.find('[aria-label="Mi cuenta"]').exists()).toBe(true)
      expect(wrapper.find('.ui-app-header__session .ui-button').exists()).toBe(false)
    })

    it('reenvia currency, umbral y labels al BalancePill', () => {
      const wrapper = mount(AppHeader, {
        props: {
          loggedIn: true,
          balance: 50,
          currency: 'us$',
          lowBalanceThreshold: 20,
          balanceLabel: 'Tu saldo',
          addBalanceLabel: 'Recargar',
        },
      })
      expect(wrapper.find('.ui-balance-pill__amount').text()).toBe('us$50')
      expect(wrapper.find('.ui-balance-pill').classes()).not.toContain('ui-balance-pill--low')
      expect(wrapper.find('.ui-balance-pill__label').text()).toBe('Tu saldo')
      expect(wrapper.find('.ui-balance-pill__add').attributes('aria-label')).toBe('Recargar')
    })

    it('con saldo bajo el pill pasa a estado bajo', () => {
      const wrapper = mount(AppHeader, { props: { loggedIn: true, balance: 100 } })
      expect(wrapper.find('.ui-balance-pill').classes()).toContain('ui-balance-pill--low')
    })

    it('sin balance no muestra el pill pero si el icono de usuario', () => {
      const wrapper = mount(AppHeader, { props: { loggedIn: true } })
      expect(wrapper.find('.ui-balance-pill').exists()).toBe(false)
      expect(wrapper.find('[aria-label="Mi cuenta"]').exists()).toBe(true)
    })

    it('emite addBalance y account', async () => {
      const wrapper = mount(AppHeader, { props: { loggedIn: true, balance: 500 } })
      await wrapper.find('.ui-balance-pill__add').trigger('click')
      await wrapper.find('[aria-label="Mi cuenta"]').trigger('click')
      expect(wrapper.emitted('addBalance')).toHaveLength(1)
      expect(wrapper.emitted('account')).toHaveLength(1)
    })

    it('account-icon reemplaza el icono, y user reemplaza todo el bloque', () => {
      const icon = mount(AppHeader, {
        props: { loggedIn: true, balance: 500 },
        slots: { 'account-icon': '<img class="avatar" />' },
      })
      expect(icon.find('.ui-app-header__account .avatar').exists()).toBe(true)

      const user = mount(AppHeader, {
        props: { loggedIn: true, balance: 500 },
        slots: { user: '<div class="mi-usuario" />' },
      })
      expect(user.find('.mi-usuario').exists()).toBe(true)
      expect(user.find('.ui-balance-pill').exists()).toBe(false)
    })

    it('respeta accountLabel', () => {
      const wrapper = mount(AppHeader, { props: { loggedIn: true, accountLabel: 'Perfil' } })
      expect(wrapper.find('[aria-label="Perfil"]').exists()).toBe(true)
    })
  })

  it('actions y subnav solo se renderizan si hay slot', () => {
    expect(mount(AppHeader).find('.ui-app-header__actions').exists()).toBe(false)
    expect(mount(AppHeader).find('.ui-app-header__subnav').exists()).toBe(false)

    const wrapper = mount(AppHeader, {
      slots: { actions: '<button class="chat">Chat</button>', subnav: '<nav class="mi-subnav" />' },
    })
    expect(wrapper.find('.ui-app-header__actions .chat').exists()).toBe(true)
    expect(wrapper.find('.ui-app-header__subnav .mi-subnav').exists()).toBe(true)
  })
})
