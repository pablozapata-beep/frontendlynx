import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PillToggleGroup from './PillToggleGroup.vue'

const options = [
  { value: '1m', label: '1 mes' },
  { value: '3m', label: '3 meses' },
  { value: '6m', label: '6 meses' },
]

describe('PillToggleGroup', () => {
  it('renderiza un pill por cada opcion', () => {
    const wrapper = mount(PillToggleGroup, { props: { options, modelValue: '1m' } })
    expect(wrapper.findAll('.ui-pill-toggle-group__pill')).toHaveLength(3)
  })

  it('marca como activo el pill que coincide con modelValue', () => {
    const wrapper = mount(PillToggleGroup, { props: { options, modelValue: '3m' } })
    const active = wrapper.findAll('.ui-pill-toggle-group__pill--active')
    expect(active).toHaveLength(1)
    expect(active[0].text()).toBe('3 meses')
  })

  it('emite update:modelValue con el value de la opcion clickeada', async () => {
    const wrapper = mount(PillToggleGroup, { props: { options, modelValue: '1m' } })
    await wrapper.findAll('.ui-pill-toggle-group__pill')[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['6m'])
  })
})
