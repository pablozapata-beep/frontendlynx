import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingBar from './LoadingBar.vue'

describe('LoadingBar', () => {
  it('sin value es indeterminada: sin aria-valuenow, con el modificador de sweep', () => {
    const wrapper = mount(LoadingBar)
    expect(wrapper.attributes('aria-valuenow')).toBeUndefined()
    expect(wrapper.find('.ui-loading-bar__fill--indeterminate').exists()).toBe(true)
  })

  it('con value es determinada: expone aria-valuenow y el ancho del fill', () => {
    const wrapper = mount(LoadingBar, { props: { value: 62 } })
    expect(wrapper.attributes('aria-valuenow')).toBe('62')
    expect(wrapper.find('.ui-loading-bar__fill--indeterminate').exists()).toBe(false)
    expect((wrapper.find('.ui-loading-bar__fill').element as HTMLElement).style.width).toBe('62%')
  })

  it('clampea value fuera de rango', () => {
    const overflow = mount(LoadingBar, { props: { value: 150 } })
    expect((overflow.find('.ui-loading-bar__fill').element as HTMLElement).style.width).toBe('100%')

    const negative = mount(LoadingBar, { props: { value: -20 } })
    expect((negative.find('.ui-loading-bar__fill').element as HTMLElement).style.width).toBe('0%')
  })

  it('aplica el modificador striped', () => {
    const wrapper = mount(LoadingBar, { props: { value: 50, striped: true } })
    expect(wrapper.find('.ui-loading-bar__fill--striped').exists()).toBe(true)
  })

  it('expone role=progressbar y aria-label', () => {
    const wrapper = mount(LoadingBar, { props: { label: 'Subiendo archivo' } })
    expect(wrapper.attributes('role')).toBe('progressbar')
    expect(wrapper.attributes('aria-label')).toBe('Subiendo archivo')
  })

  it('aplica la clase de tamaño', () => {
    const wrapper = mount(LoadingBar, { props: { size: 'sm' } })
    expect(wrapper.classes()).toContain('ui-loading-bar--sm')
  })
})
