import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Pill from './Pill.vue'

describe('Pill', () => {
  it('renderiza el slot', () => {
    const wrapper = mount(Pill, { slots: { default: 'Nueva' } })
    expect(wrapper.text()).toBe('Nueva')
  })

  it('aplica variante y tamano por defecto', () => {
    const wrapper = mount(Pill)
    expect(wrapper.classes()).toContain('ui-pill--neutral')
    expect(wrapper.classes()).toContain('ui-pill--md')
  })

  it('no muestra el boton de quitar si removable es false', () => {
    const wrapper = mount(Pill)
    expect(wrapper.find('.ui-pill__remove').exists()).toBe(false)
  })

  it('emite remove al hacer click en el boton de quitar', async () => {
    const wrapper = mount(Pill, { props: { removable: true } })
    await wrapper.find('.ui-pill__remove').trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(1)
  })
})
