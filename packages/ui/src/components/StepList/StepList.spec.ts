import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import StepList from './StepList.vue'
import type { StepItem } from './types'

const steps: StepItem[] = [
  { title: 'Primero' },
  { title: 'Segundo', description: 'Detalle del segundo paso' },
  { title: 'Tercero' },
]

describe('StepList', () => {
  it('renderiza un <li> por paso, dentro de un <ol>', () => {
    const wrapper = mount(StepList, { props: { steps } })
    expect(wrapper.element.tagName).toBe('OL')
    expect(wrapper.findAll('li')).toHaveLength(3)
  })

  it('numera los pasos automaticamente empezando en 1', () => {
    const wrapper = mount(StepList, { props: { steps } })
    const numbers = wrapper.findAll('.ui-step-list__number').map((n) => n.text())
    expect(numbers).toEqual(['1', '2', '3'])
  })

  it('renderiza el titulo de cada paso', () => {
    const wrapper = mount(StepList, { props: { steps } })
    const titles = wrapper.findAll('.ui-step-list__title').map((t) => t.text())
    expect(titles).toEqual(['Primero', 'Segundo', 'Tercero'])
  })

  it('muestra la descripcion solo cuando el paso la trae', () => {
    const wrapper = mount(StepList, { props: { steps } })
    expect(wrapper.findAll('.ui-step-list__description')).toHaveLength(1)
    expect(wrapper.find('.ui-step-list__description').text()).toBe('Detalle del segundo paso')
  })

  it('expone un aria-label configurable', () => {
    const wrapper = mount(StepList, { props: { steps, ariaLabel: 'Como funciona' } })
    expect(wrapper.attributes('aria-label')).toBe('Como funciona')
  })
})
