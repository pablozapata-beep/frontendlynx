import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SegmentedToggle from './SegmentedToggle.vue'

const options = [
  { value: 'demo', label: 'Demo' },
  { value: 'real', label: 'Juego Real' },
]

describe('SegmentedToggle', () => {
  it('renderiza una opcion por cada entrada', () => {
    const wrapper = mount(SegmentedToggle, { props: { options, modelValue: 'demo' } })
    expect(wrapper.findAll('.ui-segmented-toggle__option')).toHaveLength(2)
  })

  it('marca como activa la opcion que coincide con modelValue', () => {
    const wrapper = mount(SegmentedToggle, { props: { options, modelValue: 'real' } })
    const active = wrapper.findAll('.ui-segmented-toggle__option--active')
    expect(active).toHaveLength(1)
    expect(active[0].text()).toBe('Juego Real')
    expect(active[0].attributes('aria-checked')).toBe('true')
  })

  it('emite update:modelValue con el value de la opcion clickeada', async () => {
    const wrapper = mount(SegmentedToggle, { props: { options, modelValue: 'demo' } })
    await wrapper.findAll('.ui-segmented-toggle__option')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['real'])
  })
})
