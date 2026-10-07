import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TextInput from './TextInput.vue'

const input = (w: ReturnType<typeof mount>) => w.find('input').element as HTMLInputElement

describe('TextInput', () => {
  it('muestra el valor y emite update:modelValue al tipear', async () => {
    const wrapper = mount(TextInput, { props: { modelValue: 'hola' } })
    expect(input(wrapper).value).toBe('hola')
    await wrapper.find('input').setValue('chau')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['chau'])
  })

  it('con type="number" emite numeros, y vacio como string vacio', async () => {
    const wrapper = mount(TextInput, { props: { modelValue: '', type: 'number' } })
    await wrapper.find('input').setValue('42')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([42])
    await wrapper.find('input').setValue('')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([''])
  })

  it('enlaza el label con el input por id', () => {
    const wrapper = mount(TextInput, { props: { label: 'Email', id: 'mail' } })
    expect(wrapper.find('label').attributes('for')).toBe('mail')
    expect(wrapper.find('input').attributes('id')).toBe('mail')
  })

  it('genera un id propio si no se pasa, enlazado al label', () => {
    const wrapper = mount(TextInput, { props: { label: 'Nombre' } })
    const id = wrapper.find('input').attributes('id')!
    expect(id).toMatch(/^ui-text-input-/)
    expect(wrapper.find('label').attributes('for')).toBe(id)
  })

  it('marca el obligatorio con un asterisco decorativo y required en el input', () => {
    const wrapper = mount(TextInput, { props: { label: 'Nombre', required: true } })
    expect(wrapper.find('.ui-form-field__required').attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('input').attributes('required')).toBeDefined()
  })

  it('muestra la ayuda y la referencia con aria-describedby', () => {
    const wrapper = mount(TextInput, { props: { hint: 'Minimo 8 caracteres', id: 'pw' } })
    expect(wrapper.find('.ui-form-field__message').text()).toBe('Minimo 8 caracteres')
    expect(wrapper.find('input').attributes('aria-describedby')).toBe('pw-hint')
  })

  it('con error reemplaza la ayuda, marca aria-invalid y anuncia con role=alert', () => {
    const wrapper = mount(TextInput, { props: { hint: 'ayuda', error: 'Campo invalido', id: 'f' } })
    expect(wrapper.find('[role="alert"]').text()).toBe('Campo invalido')
    expect(wrapper.text()).not.toContain('ayuda')
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.find('input').attributes('aria-describedby')).toBe('f-error')
    expect(wrapper.find('.ui-field-shell--invalid').exists()).toBe(true)
  })

  it('disabled deshabilita el input y el contenedor', () => {
    const wrapper = mount(TextInput, { props: { disabled: true } })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    expect(wrapper.find('.ui-field-shell--disabled').exists()).toBe(true)
  })

  it('pasa los atributos extra al input y class al contenedor', () => {
    const wrapper = mount(TextInput, {
      attrs: { name: 'email', autocomplete: 'email', class: 'mi-clase' },
    })
    expect(wrapper.find('input').attributes('name')).toBe('email')
    expect(wrapper.find('input').attributes('autocomplete')).toBe('email')
    expect(wrapper.classes()).toContain('mi-clase')
    expect(wrapper.find('input').classes()).not.toContain('mi-clase')
  })

  it('renderiza los slots prefix y suffix', () => {
    const wrapper = mount(TextInput, {
      slots: { prefix: '<i class="pre">$</i>', suffix: '<i class="suf">USD</i>' },
    })
    expect(wrapper.find('.pre').exists()).toBe(true)
    expect(wrapper.find('.suf').exists()).toBe(true)
  })

  describe('clearable', () => {
    it('muestra el boton solo cuando hay contenido, y lo limpia emitiendo clear', async () => {
      const empty = mount(TextInput, { props: { modelValue: '', clearable: true } })
      expect(empty.find('[aria-label="Limpiar"]').exists()).toBe(false)

      const wrapper = mount(TextInput, { props: { modelValue: 'abc', clearable: true } })
      await wrapper.find('[aria-label="Limpiar"]').trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
      expect(wrapper.emitted('clear')).toHaveLength(1)
    })

    it('no se muestra si esta disabled o readonly', () => {
      const disabled = mount(TextInput, { props: { modelValue: 'a', clearable: true, disabled: true } })
      const readonly = mount(TextInput, { props: { modelValue: 'a', clearable: true, readonly: true } })
      expect(disabled.find('[aria-label="Limpiar"]').exists()).toBe(false)
      expect(readonly.find('[aria-label="Limpiar"]').exists()).toBe(false)
    })
  })

  describe('password', () => {
    it('alterna entre ocultar y mostrar con un boton accesible', async () => {
      const wrapper = mount(TextInput, { props: { modelValue: 'secreto', type: 'password' } })
      expect(wrapper.find('input').attributes('type')).toBe('password')

      await wrapper.find('.ui-text-input__toggle').trigger('click')
      expect(wrapper.find('input').attributes('type')).toBe('text')
      expect(wrapper.find('.ui-text-input__toggle').attributes('aria-pressed')).toBe('true')
      expect(wrapper.find('.ui-text-input__toggle').attributes('aria-label')).toBe('Ocultar contraseña')
    })

    it('sin type password no hay boton de mostrar', () => {
      expect(mount(TextInput).find('.ui-text-input__toggle').exists()).toBe(false)
    })
  })
})
