import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import Carousel from './Carousel.vue'
import CarouselSlide from './CarouselSlide.vue'

// jsdom no implementa scroll real
Element.prototype.scrollBy = vi.fn()

describe('Carousel', () => {
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

  it('muestra las flechas por defecto', () => {
    const wrapper = mount(Carousel)
    expect(wrapper.find('.ui-carousel__arrow--prev').exists()).toBe(true)
    expect(wrapper.find('.ui-carousel__arrow--next').exists()).toBe(true)
  })

  it('oculta las flechas cuando showArrows es false', () => {
    const wrapper = mount(Carousel, { props: { showArrows: false } })
    expect(wrapper.find('.ui-carousel__arrow--prev').exists()).toBe(false)
    expect(wrapper.find('.ui-carousel__arrow--next').exists()).toBe(false)
  })

  it('llama a scrollBy en el track al clickear las flechas', async () => {
    const wrapper = mount(Carousel)
    const track = wrapper.find('.ui-carousel__track').element
    const scrollBySpy = vi.spyOn(track, 'scrollBy')

    await wrapper.find('.ui-carousel__arrow--next').trigger('click')
    expect(scrollBySpy).toHaveBeenCalledTimes(1)

    await wrapper.find('.ui-carousel__arrow--prev').trigger('click')
    expect(scrollBySpy).toHaveBeenCalledTimes(2)
  })
})
