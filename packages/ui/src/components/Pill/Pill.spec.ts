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

  it('sin outline no aplica el modificador', () => {
    const wrapper = mount(Pill, { props: { variant: 'gold' } })
    expect(wrapper.classes()).not.toContain('ui-pill--outline')
  })

  it('con outline aplica el modificador ademas de la clase de variante', () => {
    const wrapper = mount(Pill, { props: { variant: 'gold', outline: true } })
    expect(wrapper.classes()).toContain('ui-pill--outline')
    expect(wrapper.classes()).toContain('ui-pill--gold')
  })
})
