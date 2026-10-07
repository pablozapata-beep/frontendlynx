import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CheckboxGroup from './CheckboxGroup.vue'

const options = [
  { value: 'pb', label: 'Powerball' },
  { value: 'mm', label: 'Mega Millions', hint: 'Martes y viernes' },
  { value: 'em', label: 'EuroMillions', disabled: true },
]

describe('CheckboxGroup', () => {
  it('es un fieldset con legend y un checkbox por opcion', () => {
    const wrapper = mount(CheckboxGroup, { props: { options, legend: 'Loterias' } })
    expect(wrapper.element.tagName).toBe('FIELDSET')
    expect(wrapper.find('legend').text()).toBe('Loterias')
    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(3)
  })

  it('marca las opciones incluidas en modelValue', () => {
    const wrapper = mount(CheckboxGroup, { props: { options, modelValue: ['mm'] } })
    const checked = wrapper.findAll('input').map((i) => (i.element as HTMLInputElement).checked)
    expect(checked).toEqual([false, true, false])
  })

  it('emite el array actualizado al marcar una opcion', async () => {
    const wrapper = mount(CheckboxGroup, { props: { options, modelValue: ['mm'] } })
    await wrapper.findAll('input')[0].setValue(true)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['mm', 'pb']])
  })

  it('respeta disabled por opcion y del grupo, y muestra hint/error', () => {
    const wrapper = mount(CheckboxGroup, { props: { options, error: 'Elegi al menos una' } })
    expect(wrapper.findAll('input')[2].attributes('disabled')).toBeDefined()
    expect(wrapper.find('[role="alert"]').text()).toBe('Elegi al menos una')
    expect(wrapper.text()).toContain('Martes y viernes')

    const disabled = mount(CheckboxGroup, { props: { options, disabled: true } })
    expect(disabled.attributes('disabled')).toBeDefined()
  })

  it('orientation horizontal aplica el modificador', () => {
    const wrapper = mount(CheckboxGroup, { props: { options, orientation: 'horizontal' } })
    expect(wrapper.find('.ui-checkbox-group__options--horizontal').exists()).toBe(true)
  })
})
