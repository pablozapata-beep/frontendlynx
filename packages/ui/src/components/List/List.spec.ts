import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import List from './List.vue'
import ListItem from './ListItem.vue'

describe('List', () => {
  it('por defecto es un ul con vinetas', () => {
    const wrapper = mount(List, { props: { items: ['a', 'b'] } })
    expect(wrapper.element.tagName).toBe('UL')
    expect(wrapper.classes()).toContain('ui-list--bullets')
    expect(wrapper.attributes('role')).toBeUndefined()
  })

  it('variant ordered usa un ol', () => {
    const wrapper = mount(List, { props: { variant: 'ordered', items: ['a'] } })
    expect(wrapper.element.tagName).toBe('OL')
    expect(wrapper.classes()).toContain('ui-list--ordered')
  })

  it('variant none es un ul sin vinetas con role=list (para que los lectores de pantalla lo sigan anunciando como lista)', () => {
    const wrapper = mount(List, { props: { variant: 'none', items: ['a'] } })
    expect(wrapper.element.tagName).toBe('UL')
    expect(wrapper.classes()).toContain('ui-list--none')
    expect(wrapper.attributes('role')).toBe('list')
  })

  it('items genera un ListItem por texto', () => {
    const wrapper = mount(List, { props: { items: ['Uno', 'Dos', 'Tres'] } })
    const items = wrapper.findAll('li.ui-list-item')
    expect(items.map((i) => i.text())).toEqual(['Uno', 'Dos', 'Tres'])
  })

  it('el slot permite contenido rico con ListItem y tiene prioridad sobre items', () => {
    const wrapper = mount(List, {
      props: { items: ['ignorado'] },
      slots: {
        default: () => [
          h(ListItem, null, () => [h('strong', 'Proteccion de menores'), ': texto']),
          h(ListItem, null, () => 'Segundo'),
        ],
      },
    })
    const items = wrapper.findAll('li')
    expect(items).toHaveLength(2)
    expect(items[0].find('strong').text()).toBe('Proteccion de menores')
    expect(wrapper.text()).not.toContain('ignorado')
  })

  it('aplica size y gap', () => {
    const wrapper = mount(List, { props: { size: 'sm', gap: 'lg', items: ['a'] } })
    expect(wrapper.classes()).toContain('ui-list--sm')
    expect(wrapper.classes()).toContain('ui-list--gap-lg')
  })

  it('por defecto size md y gap md', () => {
    const wrapper = mount(List, { props: { items: ['a'] } })
    expect(wrapper.classes()).toContain('ui-list--md')
    expect(wrapper.classes()).toContain('ui-list--gap-md')
  })
})

describe('ListItem', () => {
  it('es un <li> con el slot', () => {
    const wrapper = mount(ListItem, { slots: { default: 'Item' } })
    expect(wrapper.element.tagName).toBe('LI')
    expect(wrapper.text()).toBe('Item')
    expect(wrapper.classes()).not.toContain('ui-list-item--with-icon')
  })

  it('con slot icon lo muestra antes del contenido y aplica el modificador', () => {
    const wrapper = mount(ListItem, {
      slots: { default: 'Item', icon: '<svg class="chk" />' },
    })
    expect(wrapper.find('.ui-list-item__icon .chk').exists()).toBe(true)
    expect(wrapper.find('.ui-list-item__content').text()).toBe('Item')
    expect(wrapper.classes()).toContain('ui-list-item--with-icon')
  })
})
