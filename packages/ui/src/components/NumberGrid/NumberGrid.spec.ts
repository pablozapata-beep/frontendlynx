import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import NumberGrid from './NumberGrid.vue'

describe('NumberGrid', () => {
  it('renderiza un boton por cada numero del rango', () => {
    const wrapper = mount(NumberGrid, { props: { min: 1, max: 5, modelValue: [] } })
    expect(wrapper.findAll('.ui-number-grid__cell')).toHaveLength(5)
  })

  it('marca como seleccionados los numeros del modelValue', () => {
    const wrapper = mount(NumberGrid, { props: { min: 1, max: 3, modelValue: [2] } })
    const buttons = wrapper.findAll('.ui-number-grid__cell')
    expect(buttons[1]!.classes()).toContain('ui-number-grid__cell--selected')
  })

  it('emite update:modelValue agregando el numero clickeado', async () => {
    const wrapper = mount(NumberGrid, { props: { min: 1, max: 3, modelValue: [1] } })
    await wrapper.findAll('.ui-number-grid__cell')[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[1, 3]])
  })

  it('emite update:modelValue sacando el numero si ya estaba seleccionado', async () => {
    const wrapper = mount(NumberGrid, { props: { min: 1, max: 3, modelValue: [1, 2] } })
    await wrapper.findAll('.ui-number-grid__cell')[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[2]])
  })

  it('deshabilita los numeros no seleccionados al llegar a maxSelected', () => {
    const wrapper = mount(NumberGrid, {
      props: { min: 1, max: 3, modelValue: [1, 2], maxSelected: 2 },
    })
    const buttons = wrapper.findAll('.ui-number-grid__cell')
    expect(buttons[2]!.attributes('disabled')).toBeDefined()
    expect(buttons[0]!.attributes('disabled')).toBeUndefined()
  })

  it('respeta disabledNumbers', () => {
    const wrapper = mount(NumberGrid, {
      props: { min: 1, max: 3, modelValue: [], disabledNumbers: [2] },
    })
    expect(wrapper.findAll('.ui-number-grid__cell')[1]!.attributes('disabled')).toBeDefined()
  })

  it('no emite si se clickea un numero deshabilitado', async () => {
    const wrapper = mount(NumberGrid, {
      props: { min: 1, max: 3, modelValue: [], disabledNumbers: [2] },
    })
    await wrapper.findAll('.ui-number-grid__cell')[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
