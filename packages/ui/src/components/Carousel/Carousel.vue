<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    slidesPerView?: number
    gap?: string
    showArrows?: boolean
    /** Fraccion del ancho de una slide que asoma de la siguiente (0 = sin asomar). Solo aplica con slidesPerView > 1. */
    peek?: number
  }>(),
  {
    slidesPerView: 1,
    gap: '1rem',
    showArrows: true,
    peek: 0.15,
  },
)

provide('carousel-slides-per-view', props.slidesPerView)
provide('carousel-gap', props.gap)
provide('carousel-peek', props.peek)

const trackRef = ref<HTMLElement | null>(null)

function scroll(direction: -1 | 1) {
  const track = trackRef.value
  if (!track) return
  track.scrollBy({ left: (direction * track.clientWidth) / props.slidesPerView, behavior: 'smooth' })
}

// Arranca en false/true (en vez de calcular recien en onMounted) para evitar
// que la flecha "siguiente" parpadee oculta-y-luego-visible en el caso mas
// comun (hay mas contenido que scrollear); "anterior" arranca oculta porque
// a scrollLeft=0 siempre es correcto, sea cual sea el contenido.
const canScrollPrev = ref(false)
const canScrollNext = ref(true)

// Un poco de margen para el redondeo de subpixeles del scroll nativo.
const EDGE_THRESHOLD = 2

function updateScrollState() {
  const track = trackRef.value
  if (!track) return
  const maxScrollLeft = track.scrollWidth - track.clientWidth
  canScrollPrev.value = track.scrollLeft > EDGE_THRESHOLD
  canScrollNext.value = track.scrollLeft < maxScrollLeft - EDGE_THRESHOLD
}

onMounted(() => {
  updateScrollState()
  trackRef.value?.addEventListener('scroll', updateScrollState, { passive: true })
  window.addEventListener('resize', updateScrollState)
})

onBeforeUnmount(() => {
  trackRef.value?.removeEventListener('scroll', updateScrollState)
  window.removeEventListener('resize', updateScrollState)
})

defineExpose({ scroll })
</script>

<template>
  <div class="ui-carousel">
    <button
      v-if="showArrows && canScrollPrev"
      type="button"
      class="ui-carousel__arrow ui-carousel__arrow--prev"
      aria-label="Anterior"
      @click="scroll(-1)"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="m15 18-6-6 6-6" />
      </svg>
    </button>

    <div ref="trackRef" class="ui-carousel__track">
      <slot />
    </div>

    <button
      v-if="showArrows && canScrollNext"
      type="button"
      class="ui-carousel__arrow ui-carousel__arrow--next"
      aria-label="Siguiente"
      @click="scroll(1)"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="m9 18 6-6-6-6" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.ui-carousel {
  position: relative;
}

.ui-carousel__track {
  display: flex;
  gap: v-bind(gap);
  width: 100%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.ui-carousel__track::-webkit-scrollbar {
  display: none;
}

/* Flotan encima del slide, centradas sobre el borde del track: mitad del
   circulo afuera, mitad superpuesta al contenido (ver left/right abajo,
   que son -50% del propio ancho/alto de la flecha). */
.ui-carousel__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-gray);
  background: var(--color-background-dark);
  color: var(--color-gray);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: .8;
  transition: .35s ease-in-out;
}
.ui-carousel__arrow--prev {
  left: -0.75rem;
}
.ui-carousel__arrow--next {
  right: -0.75rem;
}
.ui-carousel__arrow:hover {
  color:var(--color-white);
  opacity: 1;
}

/* En mobile el swipe touch nativo reemplaza a las flechas */
@media (max-width: 640px) {
  .ui-carousel__arrow {
    display: none;
  }
}
</style>
