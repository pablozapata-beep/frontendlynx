<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useSlots } from 'vue'
import PromoSliderSlide from './PromoSliderSlide.vue'

export interface PromoSliderImage {
  src: string
  alt: string
  href?: string
}

const props = withDefaults(
  defineProps<{
    /** Modo "solo imagenes": si se pasa, reemplaza al slot default. */
    images?: PromoSliderImage[]
    showArrows?: boolean
    showDots?: boolean
    /** Si es false, no da la vuelta: la flecha/autoplay desaparece/se frena en cada extremo. */
    loop?: boolean
    autoplay?: boolean
    autoplayInterval?: number
    pauseOnHover?: boolean
    /** Cualquier valor valido de aspect-ratio, ej. "21 / 9". */
    aspectRatio?: string
    /** Aspect ratio bajo los 640px; si no se pasa, usa el mismo que aspectRatio. */
    mobileAspectRatio?: string
    prevLabel?: string
    nextLabel?: string
    ariaLabel?: string
    dotLabel?: (index: number) => string
  }>(),
  {
    images: undefined,
    showArrows: true,
    showDots: true,
    loop: true,
    autoplay: true,
    autoplayInterval: 6000,
    pauseOnHover: true,
    aspectRatio: '21 / 9',
    mobileAspectRatio: undefined,
    prevLabel: 'Anterior',
    nextLabel: 'Siguiente',
    ariaLabel: 'Promociones',
    dotLabel: (index: number) => `Ir a la promoción ${index + 1}`,
  },
)

const emit = defineEmits<{
  change: [index: number]
}>()

const slots = useSlots()
const current = ref(0)

const slideCount = computed(() => props.images?.length ?? slots.default?.()?.length ?? 0)
const effectiveMobileAspectRatio = computed(() => props.mobileAspectRatio ?? props.aspectRatio)

function goTo(index: number) {
  if (slideCount.value === 0) return
  current.value = props.loop
    ? ((index % slideCount.value) + slideCount.value) % slideCount.value
    : Math.min(slideCount.value - 1, Math.max(0, index))
  emit('change', current.value)
}
function next() {
  goTo(current.value + 1)
}
function prev() {
  goTo(current.value - 1)
}

const canGoPrev = computed(() => props.loop || current.value > 0)
const canGoNext = computed(() => props.loop || current.value < slideCount.value - 1)

let intervalId: ReturnType<typeof setInterval> | undefined

function stopAutoplay() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = undefined
  }
}
function startAutoplay() {
  stopAutoplay()
  if (!props.autoplay || slideCount.value <= 1) return
  intervalId = setInterval(next, props.autoplayInterval)
}

onMounted(startAutoplay)
onBeforeUnmount(stopAutoplay)

function onMouseEnter() {
  if (props.pauseOnHover) stopAutoplay()
}
function onMouseLeave() {
  if (props.pauseOnHover) startAutoplay()
}

// Swipe con Pointer Events (cubre touch, mouse y pen con la misma API).
// setPointerCapture asegura que sigamos recibiendo pointermove/up aunque el
// dedo/cursor salga del viewport durante el arrastre.
const DRAG_THRESHOLD_RATIO = 0.2

const viewportRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const dragDeltaPx = ref(0)
let dragStartX = 0
let dragViewportWidth = 0
let didDrag = false

const trackTransform = computed(() => `translateX(calc(${-current.value * 100}% + ${dragDeltaPx.value}px))`)

function onPointerDown(event: PointerEvent) {
  if (slideCount.value <= 1) return
  isDragging.value = true
  didDrag = false
  dragStartX = event.clientX
  dragDeltaPx.value = 0
  dragViewportWidth = viewportRef.value?.clientWidth ?? 0
  stopAutoplay()
  // No todos los entornos (ej. jsdom, navegadores viejos) implementan esto.
  ;(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId)
}

function onPointerMove(event: PointerEvent) {
  if (!isDragging.value) return
  dragDeltaPx.value = event.clientX - dragStartX
  if (Math.abs(dragDeltaPx.value) > 5) didDrag = true
}

function endDrag() {
  if (!isDragging.value) return
  isDragging.value = false
  const delta = dragDeltaPx.value
  dragDeltaPx.value = 0
  if (dragViewportWidth > 0 && Math.abs(delta) > dragViewportWidth * DRAG_THRESHOLD_RATIO) {
    if (delta < 0) next()
    else prev()
  }
  startAutoplay()
}

// Evita que el "click" sintetico al soltar dispare la navegacion de un <a>
// (o el CTA de una slide libre) cuando en realidad el usuario estaba arrastrando.
function onTrackClickCapture(event: MouseEvent) {
  if (didDrag) {
    event.preventDefault()
    event.stopPropagation()
    didDrag = false
  }
}

defineExpose({ goTo, next, prev, current })
</script>

<template>
  <div class="ui-promo-slider">
    <div
      ref="viewportRef"
      class="ui-promo-slider__viewport"
      role="region"
      aria-roledescription="carousel"
      :aria-label="ariaLabel"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <div
        class="ui-promo-slider__track"
        :class="{ 'ui-promo-slider__track--dragging': isDragging }"
        :style="{ transform: trackTransform }"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="endDrag"
        @pointercancel="endDrag"
        @click.capture="onTrackClickCapture"
      >
        <template v-if="images">
          <PromoSliderSlide v-for="(image, index) in images" :key="index" :label="image.alt">
            <a v-if="image.href" :href="image.href" class="ui-promo-slider__image-link">
              <img :src="image.src" :alt="image.alt" class="ui-promo-slider__image" draggable="false" />
            </a>
            <img v-else :src="image.src" :alt="image.alt" class="ui-promo-slider__image" draggable="false" />
          </PromoSliderSlide>
        </template>
        <slot v-else />
      </div>

      <button
        v-if="showArrows && slideCount > 1 && canGoPrev"
        type="button"
        class="ui-promo-slider__arrow ui-promo-slider__arrow--prev"
        :aria-label="prevLabel"
        @click="prev"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        v-if="showArrows && slideCount > 1 && canGoNext"
        type="button"
        class="ui-promo-slider__arrow ui-promo-slider__arrow--next"
        :aria-label="nextLabel"
        @click="next"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>

    <div v-if="showDots && slideCount > 1" class="ui-promo-slider__dots">
      <button
        v-for="index in slideCount"
        :key="index"
        type="button"
        class="ui-promo-slider__dot"
        :class="{ 'ui-promo-slider__dot--active': index - 1 === current }"
        :aria-label="dotLabel(index - 1)"
        :aria-selected="index - 1 === current"
        @click="goTo(index - 1)"
      />
    </div>
  </div>
</template>

<style scoped>
.ui-promo-slider__viewport {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
  aspect-ratio: v-bind(aspectRatio);
  /* deja que el scroll vertical de la pagina siga andando nativo; el arrastre
     horizontal lo maneja JS via pointer events. */
  touch-action: pan-y;
}
@media (max-width: 640px) {
  .ui-promo-slider__viewport {
    aspect-ratio: v-bind(effectiveMobileAspectRatio);
  }
}

.ui-promo-slider__track {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.45s ease;
}
.ui-promo-slider__track--dragging {
  transition: none;
  user-select: none;
}
@media (prefers-reduced-motion: reduce) {
  .ui-promo-slider__track {
    transition: none;
  }
}

.ui-promo-slider__image-link,
.ui-promo-slider__image {
  display: block;
  width: 100%;
  height: 100%;
}
.ui-promo-slider__image {
  object-fit: cover;
  -webkit-user-drag: none;
}

.ui-promo-slider__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.35);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(3px);
  transition: background-color 0.2s;
}
.ui-promo-slider__arrow:hover {
  background: rgba(0, 0, 0, 0.75);
}
.ui-promo-slider__arrow--prev {
  left: 12px;
}
.ui-promo-slider__arrow--next {
  right: 12px;
}

.ui-promo-slider__dots {
  display: flex;
  justify-content: center;
  gap: 7px;
  margin-top: var(--spacing-sm);
}
.ui-promo-slider__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-border);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s, width 0.2s;
}
.ui-promo-slider__dot--active {
  width:14px;
  background: var(--color-primary);
  transform: scale(1.25);
  border-radius: 50px;
}
</style>
