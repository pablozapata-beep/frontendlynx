import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchInput from './SearchInput.vue'

describe('SearchInput', () => {
  it('es un input type=search con lupa, placeholder y aria-label por defecto', () => {
    const wrapper = mount(SearchInput)
    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('search')
    expect(input.attributes('placeholder')).toBe('Buscar')
    expect(input.attributes('aria-label')).toBe('Buscar')
    expect(wrapper.find('.ui-text-input__adornment svg').exists()).toBe(true)
  })

  it('emite update:modelValue como string al tipear', async () => {
    const wrapper = mount(SearchInput)
    await wrapper.find('input').setValue('powerball')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['powerball'])
  })

  it('emite search con el texto al presionar Enter', async () => {
    const wrapper = mount(SearchInput, { props: { modelValue: 'mega' } })
    await wrapper.find('input').trigger('keydown.enter')
    expect(wrapper.emitted('search')?.[0]).toEqual(['mega'])
  })

  it('el boton de limpiar aparece con texto y emite clear + vacio', async () => {
    const wrapper = mount(SearchInput, { props: { modelValue: 'abc', clearLabel: 'Borrar' } })
    await wrapper.find('[aria-label="Borrar"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('respeta placeholder, searchLabel y disabled', () => {
    const wrapper = mount(SearchInput, {
      props: { placeholder: 'Buscar juego', searchLabel: 'Buscar juegos', disabled: true },
    })
    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('Buscar juego')
    expect(input.attributes('aria-label')).toBe('Buscar juegos')
    expect(input.attributes('disabled')).toBeDefined()
  })
})
