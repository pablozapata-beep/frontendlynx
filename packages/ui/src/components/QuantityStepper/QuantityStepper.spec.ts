import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import QuantityStepper from './QuantityStepper.vue'

const valueInput = (wrapper: ReturnType<typeof mount>) =>
  wrapper.find('.ui-quantity-stepper__value')

describe('QuantityStepper', () => {
  it('muestra el valor actual', () => {
    const wrapper = mount(QuantityStepper, { props: { modelValue: 3 } })
    expect((valueInput(wrapper).element as HTMLInputElement).value).toBe('3')
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

  describe('edicion manual del valor', () => {
    it('es un input editable con el mismo nombre accesible que el grupo', () => {
      const wrapper = mount(QuantityStepper, { props: { modelValue: 3, ariaLabel: 'Participaciones' } })
      const input = valueInput(wrapper)
      expect(input.element.tagName).toBe('INPUT')
      expect(input.attributes('inputmode')).toBe('numeric')
      expect(input.attributes('aria-label')).toBe('Participaciones')
    })

    it('no emite mientras se tipea; emite al perder el foco', async () => {
      const wrapper = mount(QuantityStepper, { props: { modelValue: 3, max: 10 } })
      const input = valueInput(wrapper)
      await input.setValue('7')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()

      await input.trigger('blur')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([7])
    })

    it('emite al presionar Enter', async () => {
      const wrapper = mount(QuantityStepper, { props: { modelValue: 3, max: 10 } })
      const input = valueInput(wrapper)
      await input.setValue('5')
      await input.trigger('keydown.enter')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([5])
    })

    it('acota al maximo si se tipea un valor mayor', async () => {
      const wrapper = mount(QuantityStepper, { props: { modelValue: 3, max: 10 } })
      const input = valueInput(wrapper)
      await input.setValue('250')
      await input.trigger('blur')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([10])
      expect((input.element as HTMLInputElement).value).toBe('10')
    })

    it('acota al minimo si se tipea un valor menor', async () => {
      const wrapper = mount(QuantityStepper, { props: { modelValue: 3, min: 2 } })
      const input = valueInput(wrapper)
      await input.setValue('0')
      await input.trigger('blur')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
    })

    it('descarta caracteres que no son digitos', async () => {
      const wrapper = mount(QuantityStepper, { props: { modelValue: 3, max: 99 } })
      const input = valueInput(wrapper)
      await input.setValue('1a2.b')
      expect((input.element as HTMLInputElement).value).toBe('12')
      await input.trigger('blur')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([12])
    })

    it('si queda vacio, vuelve al valor anterior sin emitir', async () => {
      const wrapper = mount(QuantityStepper, { props: { modelValue: 3 } })
      const input = valueInput(wrapper)
      await input.setValue('')
      await input.trigger('blur')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect((input.element as HTMLInputElement).value).toBe('3')
    })

    it('no emite si el valor confirmado es igual al actual', async () => {
      const wrapper = mount(QuantityStepper, { props: { modelValue: 3 } })
      const input = valueInput(wrapper)
      await input.setValue('3')
      await input.trigger('blur')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('se sincroniza cuando cambia modelValue desde afuera (ej. con los botones)', async () => {
      const wrapper = mount(QuantityStepper, { props: { modelValue: 3 } })
      await wrapper.setProps({ modelValue: 8 })
      expect((valueInput(wrapper).element as HTMLInputElement).value).toBe('8')
    })

    it('el input queda deshabilitado y no emite si el stepper esta disabled', async () => {
      const wrapper = mount(QuantityStepper, { props: { modelValue: 3, disabled: true } })
      const input = valueInput(wrapper)
      expect(input.attributes('disabled')).toBeDefined()
      await input.trigger('blur')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })
})
