import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FieldShell from './FieldShell.vue'

describe('FieldShell', () => {
  it('renderiza el slot con tamano md por defecto', () => {
    const wrapper = mount(FieldShell, { slots: { default: '<span class="hijo" />' } })
    expect(wrapper.find('.hijo').exists()).toBe(true)
    expect(wrapper.classes()).toContain('ui-field-shell--md')
  })

  it('aplica los modificadores de tamano, invalid, disabled y multiline', () => {
    const wrapper = mount(FieldShell, { props: { size: 'lg', invalid: true, disabled: true, multiline: true } })
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'ui-field-shell--lg',
        'ui-field-shell--invalid',
        'ui-field-shell--disabled',
        'ui-field-shell--multiline',
      ]),
    )
  })
})
