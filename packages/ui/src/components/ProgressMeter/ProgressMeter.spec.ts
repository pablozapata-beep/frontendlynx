import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ProgressMeter from './ProgressMeter.vue'

describe('ProgressMeter', () => {
  it('calcula el ancho del relleno segun value/max', () => {
    const wrapper = mount(ProgressMeter, { props: { value: 50, max: 200 } })
    expect((wrapper.find('.ui-progress-meter__fill').element as HTMLElement).style.width).toBe('25%')
  })

  it('no supera el 100% aunque value sea mayor a max', () => {
    const wrapper = mount(ProgressMeter, { props: { value: 999, max: 200 } })
    expect((wrapper.find('.ui-progress-meter__fill').element as HTMLElement).style.width).toBe('100%')
  })

  it('muestra la marca de minimo cuando min esta definido y todavia no se alcanza', () => {
    const wrapper = mount(ProgressMeter, { props: { value: 46, max: 150, min: 100 } })
    expect(wrapper.find('.ui-progress-meter__min-marker').exists()).toBe(true)
  })

  it('oculta la marca de minimo y aplica el modificador locked al alcanzarlo', () => {
    const wrapper = mount(ProgressMeter, { props: { value: 120, max: 150, min: 100 } })
    expect(wrapper.find('.ui-progress-meter__min-marker').exists()).toBe(false)
    expect(wrapper.classes()).toContain('ui-progress-meter--locked')
  })

  it('no muestra marca de minimo si no se paso min', () => {
    const wrapper = mount(ProgressMeter, { props: { value: 46, max: 150 } })
    expect(wrapper.find('.ui-progress-meter__min-marker').exists()).toBe(false)
  })

  it('aplica el modificador closing cuando la prop closing es true', () => {
    const wrapper = mount(ProgressMeter, { props: { value: 46, max: 150, closing: true } })
    expect(wrapper.classes()).toContain('ui-progress-meter--closing')
  })
})
