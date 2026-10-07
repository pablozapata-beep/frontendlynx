import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import RadioGroup from './RadioGroup.vue'
import Radio from '../Radio/Radio.vue'

const options = [
  { value: 'mes', label: '1 mes' },
  { value: 'trim', label: '3 meses', hint: 'Ahorras 10%' },
  { value: 'sem', label: '6 meses', disabled: true },
]

describe('RadioGroup', () => {
  it('es un fieldset role=radiogroup con legend y un radio por opcion', () => {
    const wrapper = mount(RadioGroup, { props: { options, legend: 'Duracion' } })
    expect(wrapper.attributes('role')).toBe('radiogroup')
    expect(wrapper.find('legend').text()).toBe('Duracion')
    expect(wrapper.findAll('input[type="radio"]')).toHaveLength(3)
  })

  it('todos los radios comparten el mismo name (el navegador maneja las flechas del teclado)', () => {
    const wrapper = mount(RadioGroup, { props: { options, name: 'duracion' } })
    const names = wrapper.findAll('input').map((i) => i.attributes('name'))
    expect(new Set(names)).toEqual(new Set(['duracion']))
  })

  it('genera un name unico si no se pasa', () => {
    const a = mount(RadioGroup, { props: { options } }).find('input').attributes('name')
    const b = mount(RadioGroup, { props: { options } }).find('input').attributes('name')
    expect(a).toBeTruthy()
    expect(a).not.toBe(b)
  })

  it('marca el radio cuyo value coincide con modelValue', () => {
    const wrapper = mount(RadioGroup, { props: { options, modelValue: 'trim' } })
    const checked = wrapper.findAll('input').map((i) => (i.element as HTMLInputElement).checked)
    expect(checked).toEqual([false, true, false])
  })

  it('emite update:modelValue con el value elegido', async () => {
    const wrapper = mount(RadioGroup, { props: { options, modelValue: 'mes' } })
    await wrapper.findAll('input')[1].setValue(true)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['trim'])
  })

  it('el slot permite poner Radio a mano y comparten el contexto del grupo', async () => {
    const wrapper = mount(RadioGroup, {
      props: { modelValue: 'b', name: 'g' },
      slots: {
        default: () => [h(Radio, { value: 'a', label: 'A' }), h(Radio, { value: 'b', label: 'B' })],
      },
    })
    const inputs = wrapper.findAll('input')
    expect(inputs.map((i) => i.attributes('name'))).toEqual(['g', 'g'])
    expect((inputs[1].element as HTMLInputElement).checked).toBe(true)
    await inputs[0].setValue(true)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])
  })

  it('disabled del grupo deshabilita todos; disabled por opcion solo ese', () => {
    const perOption = mount(RadioGroup, { props: { options } })
    expect(perOption.findAll('input').map((i) => i.attributes('disabled') !== undefined)).toEqual([
      false,
      false,
      true,
    ])

    const group = mount(RadioGroup, { props: { options, disabled: true } })
    expect(group.findAll('input').every((i) => i.attributes('disabled') !== undefined)).toBe(true)
  })

  it('muestra hint o error (el error con role=alert)', () => {
    const hinted = mount(RadioGroup, { props: { options, hint: 'Elegi una' } })
    expect(hinted.find('.ui-radio-group__message').text()).toBe('Elegi una')
    const errored = mount(RadioGroup, { props: { options, error: 'Requerido' } })
    expect(errored.find('[role="alert"]').text()).toBe('Requerido')
    expect(errored.attributes('aria-invalid')).toBe('true')
  })
})
