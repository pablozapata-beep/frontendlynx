import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, inject } from 'vue'
import { mount } from '@vue/test-utils'
import CarouselSection from './CarouselSection.vue'
import Carousel from './Carousel.vue'
import CarouselSlide from './CarouselSlide.vue'

// Sonda que expone lo que realmente recibe via inject(), sin pasar por CSS
// (v-bind() en <style> no se refleja en el DOM bajo jsdom/vitest, asi que
// leer el style de CarouselSlide no sirve para probar esto).
const InjectProbe = defineComponent({
  setup() {
    return {
      slidesPerView: inject('carousel-slides-per-view', 1),
      gap: inject('carousel-gap', '1rem'),
      peek: inject('carousel-peek', 0),
    }
  },
  template: '<div data-test="probe" :data-slides-per-view="slidesPerView" :data-gap="gap" :data-peek="peek" />',
})

// jsdom no implementa scroll real
Element.prototype.scrollBy = vi.fn()

describe('CarouselSection', () => {
  it('renderiza el titulo y el boton "Ver todo"', () => {
    const wrapper = mount(CarouselSection, { props: { title: 'Britanialynx Originales' } })
    expect(wrapper.find('.ui-carousel-section__title').text()).toBe('Britanialynx Originales')
    expect(wrapper.find('.ui-carousel-section__view-all').text()).toBe('Ver todo')
  })

  it('oculta "Ver todo" si showViewAll es false', () => {
    const wrapper = mount(CarouselSection, { props: { title: 'x', showViewAll: false } })
    expect(wrapper.find('.ui-carousel-section__view-all').exists()).toBe(false)
  })

  it('emite viewAll al clickear el boton', async () => {
    const wrapper = mount(CarouselSection, { props: { title: 'x' } })
    await wrapper.find('.ui-carousel-section__view-all').trigger('click')
    expect(wrapper.emitted('viewAll')).toHaveLength(1)
  })

  it('renderiza las slides pasadas por slot dentro del Carousel interno', () => {
    const wrapper = mount(CarouselSection, {
      props: { title: 'x' },
      slots: { default: () => [h(CarouselSlide, () => 'A'), h(CarouselSlide, () => 'B')] },
    })
    expect(wrapper.findAll('.ui-carousel-slide')).toHaveLength(2)
  })

  it('las flechas del header llaman al scroll del Carousel interno', async () => {
    const wrapper = mount(CarouselSection, { props: { title: 'x' } })
    const track = wrapper.find('.ui-carousel__track').element
    const scrollBySpy = vi.spyOn(track, 'scrollBy')

    await wrapper.find('[aria-label="Siguiente"]').trigger('click')
    expect(scrollBySpy).toHaveBeenCalledTimes(1)

    await wrapper.find('[aria-label="Anterior"]').trigger('click')
    expect(scrollBySpy).toHaveBeenCalledTimes(2)
  })

  it('el Carousel interno no muestra sus propias flechas (las del header las reemplazan)', () => {
    const wrapper = mount(CarouselSection, { props: { title: 'x' } })
    expect(wrapper.find('.ui-carousel__arrow').exists()).toBe(false)
  })

  it('slidesPerView/gap/peek llegan a las slides a traves del slot forwarding (provide/inject)', () => {
    const wrapper = mount(CarouselSection, {
      props: { title: 'x', slidesPerView: 3, gap: '2rem', peek: 0.2 },
      slots: { default: () => h(InjectProbe) },
    })
    const probe = wrapper.find('[data-test="probe"]')
    expect(probe.attributes('data-slides-per-view')).toBe('3')
    expect(probe.attributes('data-gap')).toBe('2rem')
    expect(probe.attributes('data-peek')).toBe('0.2')
  })

  it('peek tiene un default de 0.15 aunque no se pase explicito', () => {
    const wrapper = mount(CarouselSection, {
      props: { title: 'x' },
      slots: { default: () => h(InjectProbe) },
    })
    expect(wrapper.find('[data-test="probe"]').attributes('data-peek')).toBe('0.15')
  })
})

describe('sanity: mismo comportamiento ya probado en Carousel', () => {
  it('Carousel solo (sin CarouselSection) sigue funcionando igual', () => {
    const wrapper = mount(Carousel, { slots: { default: () => h(CarouselSlide, () => 'A') } })
    expect(wrapper.findAll('.ui-carousel-slide')).toHaveLength(1)
  })
})
