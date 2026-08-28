import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Notification from './Notification.vue'

describe('Notification', () => {
  it('renderiza el mensaje del slot y el titulo', () => {
    const wrapper = mount(Notification, {
      props: { title: 'Listo' },
      slots: { default: 'Se guardo correctamente.' },
    })
    expect(wrapper.find('.ui-notification__title').text()).toBe('Listo')
    expect(wrapper.text()).toContain('Se guardo correctamente.')
  })

  it('aplica la variante info por defecto', () => {
    const wrapper = mount(Notification)
    expect(wrapper.classes()).toContain('ui-notification--info')
  })

  it('muestra el boton de cerrar por defecto y emite dismiss', async () => {
    const wrapper = mount(Notification)
    await wrapper.find('.ui-notification__dismiss').trigger('click')
    expect(wrapper.emitted('dismiss')).toHaveLength(1)
  })

  it('oculta el boton de cerrar cuando dismissible es false', () => {
    const wrapper = mount(Notification, { props: { dismissible: false } })
    expect(wrapper.find('.ui-notification__dismiss').exists()).toBe(false)
  })
})
