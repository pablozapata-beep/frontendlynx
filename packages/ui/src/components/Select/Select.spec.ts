import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Select from './Select.vue'

const options = [
  { value: 'ar', label: 'Argentina' },
  { value: 'uy', label: 'Uruguay', disabled: true },
  { value: 3, label: 'Chile (numerico)' },
]

describe('Select', () => {
  it('renderiza una opcion por entrada y marca la seleccionada', () => {
    const wrapper = mount(Select, { props: { options, modelValue: 'ar' } })
    expect(wrapper.findAll('option')).toHaveLength(3)
    expect((wrapper.find('select').element as HTMLSelectElement).value).toBe('ar')
  })

  it('emite el value original de la opcion elegida (respeta numeros)', async () => {
    const wrapper = mount(Select, { props: { options, modelValue: 'ar' } })
    await wrapper.find('select').setValue('3')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
  })

  it('con placeholder agrega una opcion inicial deshabilitada y mantiene el indice correcto', async () => {
    const wrapper = mount(Select, { props: { options, modelValue: '', placeholder: 'Elegi un pais' } })
    const first = wrapper.findAll('option')[0]
    expect(first.text()).toBe('Elegi un pais')
    expect(first.attributes('disabled')).toBeDefined()
    expect(wrapper.findAll('option')).toHaveLength(4)

    await wrapper.find('select').setValue('ar')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['ar'])
  })

  it('marca opciones deshabilitadas', () => {
    const wrapper = mount(Select, { props: { options } })
    expect(wrapper.findAll('option')[1].attributes('disabled')).toBeDefined()
  })

  it('label, error y disabled', () => {
    const wrapper = mount(Select, { props: { options, label: 'Pais', error: 'Elegi uno', id: 'pais', disabled: true } })
    expect(wrapper.find('label').attributes('for')).toBe('pais')
    expect(wrapper.find('select').attributes('aria-describedby')).toBe('pais-error')
    expect(wrapper.find('select').attributes('disabled')).toBeDefined()
  })
})
