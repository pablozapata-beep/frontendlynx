import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import PromoSlider from './PromoSlider.vue'
import PromoSliderSlide from './PromoSliderSlide.vue'

const images = [
  { src: '/a.jpg', alt: 'A' },
  { src: '/b.jpg', alt: 'B', href: '/b' },
  { src: '/c.jpg', alt: 'C' },
]

function mockViewportWidth(wrapper: ReturnType<typeof mount>, width: number) {
  const el = wrapper.find('.ui-promo-slider__viewport').element as HTMLElement
  Object.defineProperty(el, 'clientWidth', { value: width, configurable: true })
  return el
}

// @vue/test-utils no sabe construir PointerEvent (intenta setear clientX sobre
// un MouseEvent generico, que es de solo lectura) — se disparan a mano.
async function firePointer(el: HTMLElement, type: string, clientX: number, pointerId = 1) {
  el.dispatchEvent(new PointerEvent(type, { clientX, pointerId, bubbles: true, cancelable: true }))
  await nextTick()
}

describe('PromoSlider — modo imagenes', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renderiza una slide por imagen', () => {
    const wrapper = mount(PromoSlider, { props: { images, autoplay: false } })
    expect(wrapper.findAll('.ui-promo-slider-slide')).toHaveLength(3)
    expect(wrapper.findAll('img.ui-promo-slider__image')).toHaveLength(3)
  })

  it('envuelve en <a> solo las imagenes con href', () => {
    const wrapper = mount(PromoSlider, { props: { images, autoplay: false } })
    expect(wrapper.findAll('.ui-promo-slider__image-link')).toHaveLength(1)
  })

  it('los botones next/prev avanzan y retroceden, dando la vuelta', async () => {
    const wrapper = mount(PromoSlider, { props: { images, autoplay: false } })
    expect(wrapper.vm.current).toBe(0)

    await wrapper.find('.ui-promo-slider__arrow--next').trigger('click')
    expect(wrapper.vm.current).toBe(1)

    await wrapper.find('.ui-promo-slider__arrow--prev').trigger('click')
    await wrapper.find('.ui-promo-slider__arrow--prev').trigger('click')
    expect(wrapper.vm.current).toBe(2)
  })

  it('clickear un dot va directo a esa slide', async () => {
    const wrapper = mount(PromoSlider, { props: { images, autoplay: false } })
    await wrapper.findAll('.ui-promo-slider__dot')[2].trigger('click')
    expect(wrapper.vm.current).toBe(2)
    expect(wrapper.findAll('.ui-promo-slider__dot')[2].classes()).toContain('ui-promo-slider__dot--active')
  })

  it('emite change al navegar', async () => {
    const wrapper = mount(PromoSlider, { props: { images, autoplay: false } })
    await wrapper.find('.ui-promo-slider__arrow--next').trigger('click')
    expect(wrapper.emitted('change')?.[0]).toEqual([1])
  })

  it('oculta flechas y dots segun las props', () => {
    const wrapper = mount(PromoSlider, {
      props: { images, autoplay: false, showArrows: false, showDots: false },
    })
    expect(wrapper.find('.ui-promo-slider__arrow--next').exists()).toBe(false)
    expect(wrapper.find('.ui-promo-slider__dots').exists()).toBe(false)
  })

  it('no muestra flechas ni dots con una sola imagen', () => {
    const wrapper = mount(PromoSlider, { props: { images: [images[0]], autoplay: false } })
    expect(wrapper.find('.ui-promo-slider__arrow--next').exists()).toBe(false)
    expect(wrapper.find('.ui-promo-slider__dots').exists()).toBe(false)
  })

  it('avanza sola con autoplay', async () => {
    const wrapper = mount(PromoSlider, { props: { images, autoplay: true, autoplayInterval: 1000 } })
    expect(wrapper.vm.current).toBe(0)
    await vi.advanceTimersByTimeAsync(1000)
    expect(wrapper.vm.current).toBe(1)
  })

  it('pausa el autoplay en mouseenter y lo retoma en mouseleave', async () => {
    const wrapper = mount(PromoSlider, { props: { images, autoplay: true, autoplayInterval: 1000 } })
    await wrapper.find('.ui-promo-slider__viewport').trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(2000)
    expect(wrapper.vm.current).toBe(0)

    await wrapper.find('.ui-promo-slider__viewport').trigger('mouseleave')
    await vi.advanceTimersByTimeAsync(1000)
    expect(wrapper.vm.current).toBe(1)
  })
})

describe('PromoSlider — swipe (pointer events)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('arrastrar mas del umbral hacia la izquierda avanza a la siguiente slide', async () => {
    const wrapper = mount(PromoSlider, { props: { images, autoplay: false } })
    const viewportEl = mockViewportWidth(wrapper, 300)

    await firePointer(viewportEl, 'pointerdown', 200)
    await firePointer(viewportEl, 'pointermove', 50) // delta -150, umbral 60
    await firePointer(viewportEl, 'pointerup', 50)

    expect(wrapper.vm.current).toBe(1)
  })

  it('arrastrar mas del umbral hacia la derecha retrocede (da la vuelta)', async () => {
    const wrapper = mount(PromoSlider, { props: { images, autoplay: false } })
    const viewportEl = mockViewportWidth(wrapper, 300)

    await firePointer(viewportEl, 'pointerdown', 50)
    await firePointer(viewportEl, 'pointermove', 200) // delta +150
    await firePointer(viewportEl, 'pointerup', 200)

    expect(wrapper.vm.current).toBe(2)
  })

  it('arrastrar menos del umbral no cambia de slide', async () => {
    const wrapper = mount(PromoSlider, { props: { images, autoplay: false } })
    const viewportEl = mockViewportWidth(wrapper, 300)

    await firePointer(viewportEl, 'pointerdown', 100)
    await firePointer(viewportEl, 'pointermove', 90) // delta -10, bajo el umbral de 60
    await firePointer(viewportEl, 'pointerup', 90)

    expect(wrapper.vm.current).toBe(0)
  })

  it('con una sola slide, arrastrar no hace nada', async () => {
    const wrapper = mount(PromoSlider, { props: { images: [images[0]], autoplay: false } })
    const viewportEl = mockViewportWidth(wrapper, 300)

    await firePointer(viewportEl, 'pointerdown', 200)
    await firePointer(viewportEl, 'pointermove', 0)
    await firePointer(viewportEl, 'pointerup', 0)

    expect(wrapper.vm.current).toBe(0)
  })

  it('pausa el autoplay durante el arrastre y lo retoma al soltar', async () => {
    const wrapper = mount(PromoSlider, { props: { images, autoplay: true, autoplayInterval: 1000 } })
    const viewportEl = mockViewportWidth(wrapper, 300)

    await firePointer(viewportEl, 'pointerdown', 100)
    await vi.advanceTimersByTimeAsync(2000)
    expect(wrapper.vm.current).toBe(0)

    await firePointer(viewportEl, 'pointerup', 100)
    await vi.advanceTimersByTimeAsync(1000)
    expect(wrapper.vm.current).toBe(1)
  })

  it('un arrastre real evita que el click posterior navegue el link de la imagen', async () => {
    const wrapper = mount(PromoSlider, { props: { images, autoplay: false } })
    const viewportEl = mockViewportWidth(wrapper, 300)

    await firePointer(viewportEl, 'pointerdown', 100)
    await firePointer(viewportEl, 'pointermove', 80) // > 5px, cuenta como drag real
    await firePointer(viewportEl, 'pointerup', 80)

    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
    viewportEl.dispatchEvent(clickEvent)
    expect(clickEvent.defaultPrevented).toBe(true)
  })

  it('un tap sin desplazamiento no bloquea el click', async () => {
    const wrapper = mount(PromoSlider, { props: { images, autoplay: false } })
    const viewportEl = mockViewportWidth(wrapper, 300)

    await firePointer(viewportEl, 'pointerdown', 100)
    await firePointer(viewportEl, 'pointerup', 100)

    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
    viewportEl.dispatchEvent(clickEvent)
    expect(clickEvent.defaultPrevented).toBe(false)
  })
})

describe('PromoSlider — modo libre (slot)', () => {
  it('cuenta las slides pasadas por slot para los dots', () => {
    const wrapper = mount(PromoSlider, {
      props: { autoplay: false },
      slots: {
        default: () => [
          h(PromoSliderSlide, () => 'Uno'),
          h(PromoSliderSlide, () => 'Dos'),
        ],
      },
    })
    expect(wrapper.findAll('.ui-promo-slider-slide')).toHaveLength(2)
    expect(wrapper.findAll('.ui-promo-slider__dot')).toHaveLength(2)
  })

  it('renderiza contenido arbitrario dentro de cada slide', () => {
    const wrapper = mount(PromoSlider, {
      props: { autoplay: false },
      slots: {
        default: () => [h(PromoSliderSlide, () => h('button', 'CTA custom'))],
      },
    })
    expect(wrapper.find('button').text()).toBe('CTA custom')
  })
})
