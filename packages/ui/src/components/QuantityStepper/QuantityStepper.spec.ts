import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import QuantityStepper from './QuantityStepper.vue'

describe('QuantityStepper', () => {
  it('muestra el valor actual', () => {
    const wrapper = mount(QuantityStepper, { props: { modelValue: 3 } })
    expect(wrapper.find('.ui-quantity-stepper__value').text()).toBe('3')
  })

  it('emite update:modelValue incrementado al sumar', async () => {
    const wrapper = mount(QuantityStepper, { props: { modelValue: 3 } })
    await wrapper.find('[aria-label="Sumar"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
  })

  it('emite update:modelValue decrementado al restar', async () => {
    const wrapper = mount(QuantityStepper, { props: { modelValue: 3 } })
    await wrapper.find('[aria-label="Restar"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
  })

  it('respeta el step indicado', async () => {
    const wrapper = mount(QuantityStepper, { props: { modelValue: 5, step: 5 } })
    await wrapper.find('[aria-label="Sumar"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([10])
  })

  it('deshabilita restar en el minimo', () => {
    const wrapper = mount(QuantityStepper, { props: { modelValue: 1, min: 1 } })
    expect(wrapper.find('[aria-label="Restar"]').attributes('disabled')).toBeDefined()
  })

  it('deshabilita sumar en el maximo', () => {
    const wrapper = mount(QuantityStepper, { props: { modelValue: 10, max: 10 } })
    expect(wrapper.find('[aria-label="Sumar"]').attributes('disabled')).toBeDefined()
  })

  it('no emite si esta disabled', async () => {
    const wrapper = mount(QuantityStepper, { props: { modelValue: 3, disabled: true } })
    await wrapper.find('[aria-label="Sumar"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
