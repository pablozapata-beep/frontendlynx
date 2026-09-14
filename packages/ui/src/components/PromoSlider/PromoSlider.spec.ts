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

function trackOf(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('.ui-promo-slider__track').element as HTMLElement
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
    mockViewportWidth(wrapper, 300)
    const trackEl = trackOf(wrapper)

    await firePointer(trackEl, 'pointerdown', 200)
    await firePointer(trackEl, 'pointermove', 50) // delta -150, umbral 60
    await firePointer(trackEl, 'pointerup', 50)

    expect(wrapper.vm.current).toBe(1)
  })

  it('arrastrar mas del umbral hacia la derecha retrocede (da la vuelta)', async () => {
    const wrapper = mount(PromoSlider, { props: { images, autoplay: false } })
    mockViewportWidth(wrapper, 300)
    const trackEl = trackOf(wrapper)

    await firePointer(trackEl, 'pointerdown', 50)
    await firePointer(trackEl, 'pointermove', 200) // delta +150
    await firePointer(trackEl, 'pointerup', 200)

    expect(wrapper.vm.current).toBe(2)
  })

  it('arrastrar menos del umbral no cambia de slide', async () => {
    const wrapper = mount(PromoSlider, { props: { images, autoplay: false } })
    mockViewportWidth(wrapper, 300)
    const trackEl = trackOf(wrapper)

    await firePointer(trackEl, 'pointerdown', 100)
    await firePointer(trackEl, 'pointermove', 90) // delta -10, bajo el umbral de 60
    await firePointer(trackEl, 'pointerup', 90)

    expect(wrapper.vm.current).toBe(0)
  })

  it('con una sola slide, arrastrar no hace nada', async () => {
    const wrapper = mount(PromoSlider, { props: { images: [images[0]], autoplay: false } })
    mockViewportWidth(wrapper, 300)
    const trackEl = trackOf(wrapper)

    await firePointer(trackEl, 'pointerdown', 200)
    await firePointer(trackEl, 'pointermove', 0)
    await firePointer(trackEl, 'pointerup', 0)

    expect(wrapper.vm.current).toBe(0)
  })

  it('pausa el autoplay durante el arrastre y lo retoma al soltar', async () => {
    const wrapper = mount(PromoSlider, { props: { images, autoplay: true, autoplayInterval: 1000 } })
    mockViewportWidth(wrapper, 300)
    const trackEl = trackOf(wrapper)

    await firePointer(trackEl, 'pointerdown', 100)
    await vi.advanceTimersByTimeAsync(2000)
    expect(wrapper.vm.current).toBe(0)

    await firePointer(trackEl, 'pointerup', 100)
    await vi.advanceTimersByTimeAsync(1000)
    expect(wrapper.vm.current).toBe(1)
  })

  it('un arrastre real evita que el click posterior navegue el link de la imagen', async () => {
    const wrapper = mount(PromoSlider, { props: { images, autoplay: false } })
    mockViewportWidth(wrapper, 300)
    const trackEl = trackOf(wrapper)

    await firePointer(trackEl, 'pointerdown', 100)
    await firePointer(trackEl, 'pointermove', 80) // > 5px, cuenta como drag real
    await firePointer(trackEl, 'pointerup', 80)

    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
    trackEl.dispatchEvent(clickEvent)
    expect(clickEvent.defaultPrevented).toBe(true)
  })

  it('un tap sin desplazamiento no bloquea el click', async () => {
    const wrapper = mount(PromoSlider, { props: { images, autoplay: false } })
    mockViewportWidth(wrapper, 300)
    const trackEl = trackOf(wrapper)

    await firePointer(trackEl, 'pointerdown', 100)
    await firePointer(trackEl, 'pointerup', 100)

    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
    trackEl.dispatchEvent(clickEvent)
    expect(clickEvent.defaultPrevented).toBe(false)
  })

  it('regresion: un gesto de pointer sobre una flecha no dispara el mecanismo de arrastre', async () => {
    // Antes del fix, los listeners de pointer vivian en el viewport (que
    // envuelve tanto al track como a las flechas), asi que un pointerdown en
    // una flecha activaba igual el estado de "arrastre" — y de paso rompia el
    // click nativo posterior de esa flecha en un navegador real. Verificamos
    // la causa estructural (que el gesto de drag no se dispare desde la
    // flecha) en vez del sintoma exacto del click, porque jsdom no implementa
    // Pointer Capture y reproducir ese sintoma puntual requiere disparar un
    // evento "click" nativo tras pointerdown/up — algo que en este proyecto
    // resulta poco confiable bajo vi.useFakeTimers() por una razon ajena a
    // este componente (Vue descarta eventos cuyo timestamp quede por debajo
    // del momento en que registro el listener, y los timers falsos desalinean
    // ese timestamp).
    const wrapper = mount(PromoSlider, { props: { images, autoplay: false } })
    mockViewportWidth(wrapper, 300)
    const nextArrow = wrapper.find('.ui-promo-slider__arrow--next').element as HTMLElement

    await firePointer(nextArrow, 'pointerdown', 280)
    await firePointer(nextArrow, 'pointermove', 50) // arrastre grande, de estar mal ubicado el listener
    await firePointer(nextArrow, 'pointerup', 50)

    expect(wrapper.vm.current).toBe(0)
  })
})

describe('PromoSlider — loop', () => {
  it('con loop=true (default), las dos flechas siempre estan, en cualquier extremo', async () => {
    const wrapper = mount(PromoSlider, { props: { images, autoplay: false } })
    expect(wrapper.find('.ui-promo-slider__arrow--prev').exists()).toBe(true)

    await wrapper.findAll('.ui-promo-slider__dot')[2].trigger('click') // ultima slide
    expect(wrapper.find('.ui-promo-slider__arrow--next').exists()).toBe(true)
  })

  it('con loop=false, oculta prev en la primera slide y next en la ultima', async () => {
    const wrapper = mount(PromoSlider, { props: { images, autoplay: false, loop: false } })
    expect(wrapper.find('.ui-promo-slider__arrow--prev').exists()).toBe(false)
    expect(wrapper.find('.ui-promo-slider__arrow--next').exists()).toBe(true)

    await wrapper.findAll('.ui-promo-slider__dot')[2].trigger('click') // ultima slide
    expect(wrapper.find('.ui-promo-slider__arrow--next').exists()).toBe(false)
    expect(wrapper.find('.ui-promo-slider__arrow--prev').exists()).toBe(true)
  })

  it('con loop=false, next se frena en la ultima slide en vez de dar la vuelta', async () => {
    const wrapper = mount(PromoSlider, { props: { images, autoplay: false, loop: false } })
    await wrapper.find('.ui-promo-slider__arrow--next').trigger('click')
    await wrapper.find('.ui-promo-slider__arrow--next').trigger('click')
    expect(wrapper.vm.current).toBe(2)

    // ya no deberia quedar boton next para seguir clickeando, pero por las
    // dudas confirmamos que goTo() tambien clampea en vez de dar la vuelta.
    wrapper.vm.next()
    await nextTick()
    expect(wrapper.vm.current).toBe(2)
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
