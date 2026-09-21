import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, inject, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import Carousel from './Carousel.vue'
import CarouselSlide from './CarouselSlide.vue'

// Sonda que expone lo que realmente recibe via inject(), sin pasar por CSS
// (v-bind() en <style> no se refleja en el DOM bajo jsdom/vitest).
const InjectProbe = defineComponent({
  setup() {
    return { peek: inject('carousel-peek', 0) }
  },
  template: '<div data-test="probe" :data-peek="peek" />',
})

// jsdom no implementa scroll real ni layout: scrollWidth/clientWidth son
// siempre 0 (de solo lectura, no se pueden asignar directo). Se mockean por
// instancia via defineProperty y se dispara un evento "scroll" para que el
// componente vuelva a leerlos.
Element.prototype.scrollBy = vi.fn()

async function mockTrackScroll(
  wrapper: ReturnType<typeof mount>,
  { scrollWidth, clientWidth, scrollLeft }: { scrollWidth: number; clientWidth: number; scrollLeft: number },
) {
  const track = wrapper.find('.ui-carousel__track').element as HTMLElement
  Object.defineProperty(track, 'scrollWidth', { value: scrollWidth, configurable: true })
  Object.defineProperty(track, 'clientWidth', { value: clientWidth, configurable: true })
  Object.defineProperty(track, 'scrollLeft', { value: scrollLeft, configurable: true })
  track.dispatchEvent(new Event('scroll'))
  await nextTick()
  return track
}

describe('Carousel', () => {
  it('provee peek con default 0.15, y respeta el valor pasado por prop', () => {
    const withDefault = mount(Carousel, { slots: { default: () => h(InjectProbe) } })
    expect(withDefault.find('[data-test="probe"]').attributes('data-peek')).toBe('0.15')

    const withCustom = mount(Carousel, {
      props: { peek: 0.3 },
      slots: { default: () => h(InjectProbe) },
    })
    expect(withCustom.find('[data-test="probe"]').attributes('data-peek')).toBe('0.3')
  })

  it('renderiza los slides pasados por slot', () => {
    const wrapper = mount(Carousel, {
      slots: {
        default: () => [
          h(CarouselSlide, () => 'A'),
          h(CarouselSlide, () => 'B'),
        ],
      },
    })
    expect(wrapper.findAll('.ui-carousel-slide')).toHaveLength(2)
  })

  it('oculta las flechas cuando showArrows es false, sin importar el scroll', () => {
    const wrapper = mount(Carousel, { props: { showArrows: false } })
    expect(wrapper.find('.ui-carousel__arrow--prev').exists()).toBe(false)
    expect(wrapper.find('.ui-carousel__arrow--next').exists()).toBe(false)
  })

  it('con contenido que desborda y scroll a la mitad, muestra las dos flechas', async () => {
    const wrapper = mount(Carousel)
    await mockTrackScroll(wrapper, { scrollWidth: 1000, clientWidth: 300, scrollLeft: 350 })
    expect(wrapper.find('.ui-carousel__arrow--prev').exists()).toBe(true)
    expect(wrapper.find('.ui-carousel__arrow--next').exists()).toBe(true)
  })

  it('al principio del scroll, oculta "anterior" y deja "siguiente"', async () => {
    const wrapper = mount(Carousel)
    await mockTrackScroll(wrapper, { scrollWidth: 1000, clientWidth: 300, scrollLeft: 0 })
    expect(wrapper.find('.ui-carousel__arrow--prev').exists()).toBe(false)
    expect(wrapper.find('.ui-carousel__arrow--next').exists()).toBe(true)
  })

  it('al final del scroll, oculta "siguiente" y deja "anterior"', async () => {
    const wrapper = mount(Carousel)
    await mockTrackScroll(wrapper, { scrollWidth: 1000, clientWidth: 300, scrollLeft: 700 })
    expect(wrapper.find('.ui-carousel__arrow--prev').exists()).toBe(true)
    expect(wrapper.find('.ui-carousel__arrow--next').exists()).toBe(false)
  })

  it('si el contenido no desborda, oculta las dos flechas aunque showArrows sea true', async () => {
    const wrapper = mount(Carousel)
    await mockTrackScroll(wrapper, { scrollWidth: 300, clientWidth: 300, scrollLeft: 0 })
    expect(wrapper.find('.ui-carousel__arrow--prev').exists()).toBe(false)
    expect(wrapper.find('.ui-carousel__arrow--next').exists()).toBe(false)
  })

  it('recalcula la visibilidad al scrollear de un extremo al otro', async () => {
    const wrapper = mount(Carousel)
    await mockTrackScroll(wrapper, { scrollWidth: 1000, clientWidth: 300, scrollLeft: 0 })
    expect(wrapper.find('.ui-carousel__arrow--prev').exists()).toBe(false)

    await mockTrackScroll(wrapper, { scrollWidth: 1000, clientWidth: 300, scrollLeft: 700 })
    expect(wrapper.find('.ui-carousel__arrow--prev').exists()).toBe(true)
    expect(wrapper.find('.ui-carousel__arrow--next').exists()).toBe(false)
  })

  it('llama a scrollBy en el track al clickear las flechas', async () => {
    const wrapper = mount(Carousel)
    const track = await mockTrackScroll(wrapper, { scrollWidth: 1000, clientWidth: 300, scrollLeft: 350 })
    const scrollBySpy = vi.spyOn(track, 'scrollBy')

    await wrapper.find('.ui-carousel__arrow--next').trigger('click')
    expect(scrollBySpy).toHaveBeenCalledTimes(1)

    await wrapper.find('.ui-carousel__arrow--prev').trigger('click')
    expect(scrollBySpy).toHaveBeenCalledTimes(2)
  })
})
