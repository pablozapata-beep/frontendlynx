import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import Accordion from './Accordion.vue'
import AccordionItem from './AccordionItem.vue'

function toggle(detailsEl: HTMLDetailsElement, open: boolean) {
  detailsEl.open = open
  detailsEl.dispatchEvent(new Event('toggle'))
}

describe('AccordionItem', () => {
  it('renderiza el titulo y el contenido del slot', () => {
    const wrapper = mount(AccordionItem, {
      props: { title: '¿Cómo me registro?' },
      slots: { default: () => 'Respuesta de ejemplo' },
    })
    expect(wrapper.find('.ui-accordion-item__title').text()).toBe('¿Cómo me registro?')
    expect(wrapper.find('.ui-accordion-item__content').text()).toBe('Respuesta de ejemplo')
  })

  it('empieza cerrado por defecto', () => {
    const wrapper = mount(AccordionItem, { props: { title: 'Q' } })
    expect((wrapper.find('details').element as HTMLDetailsElement).open).toBe(false)
  })

  it('defaultOpen lo abre desde el inicio', () => {
    const wrapper = mount(AccordionItem, { props: { title: 'Q', defaultOpen: true } })
    expect((wrapper.find('details').element as HTMLDetailsElement).open).toBe(true)
  })

  it('usado solo, mantiene su estado al hacer toggle', () => {
    const wrapper = mount(AccordionItem, { props: { title: 'Q' } })
    const details = wrapper.get('details').element as HTMLDetailsElement
    toggle(details, true)
    expect(details.open).toBe(true)
  })
})

describe('Accordion', () => {
  it('renderiza un AccordionItem por cada item pasado por slot', () => {
    const wrapper = mount(Accordion, {
      slots: {
        default: () => [
          h(AccordionItem, { title: 'Q1' }, () => 'A1'),
          h(AccordionItem, { title: 'Q2' }, () => 'A2'),
        ],
      },
    })
    expect(wrapper.findAll('.ui-accordion-item')).toHaveLength(2)
  })

  it('con multiple=true (default), abrir un item no cierra los demas', async () => {
    const wrapper = mount(Accordion, {
      slots: {
        default: () => [
          h(AccordionItem, { title: 'Q1' }, () => 'A1'),
          h(AccordionItem, { title: 'Q2' }, () => 'A2'),
        ],
      },
    })
    const items = wrapper.findAll('details').map((w) => w.element as HTMLDetailsElement)
    toggle(items[0], true)
    await nextTick()
    toggle(items[1], true)
    await nextTick()
    expect(items[0].open).toBe(true)
    expect(items[1].open).toBe(true)
  })

  it('con multiple=false, abrir un item cierra los demas abiertos', async () => {
    const wrapper = mount(Accordion, {
      props: { multiple: false },
      slots: {
        default: () => [
          h(AccordionItem, { title: 'Q1' }, () => 'A1'),
          h(AccordionItem, { title: 'Q2' }, () => 'A2'),
        ],
      },
    })
    const items = wrapper.findAll('details').map((w) => w.element as HTMLDetailsElement)

    toggle(items[0], true)
    await nextTick()
    expect(items[0].open).toBe(true)

    toggle(items[1], true)
    await nextTick()
    expect(items[1].open).toBe(true)
    expect(items[0].open).toBe(false)
  })
})
