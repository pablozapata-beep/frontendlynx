<script setup lang="ts">
import { provide, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    slidesPerView?: number
    gap?: string
    showArrows?: boolean
  }>(),
  {
    slidesPerView: 1,
    gap: '1rem',
    showArrows: true,
  },
)

provide('carousel-slides-per-view', props.slidesPerView)
provide('carousel-gap', props.gap)

const trackRef = ref<HTMLElement | null>(null)

function scroll(direction: -1 | 1) {
  const track = trackRef.value
  if (!track) return
  track.scrollBy({ left: (direction * track.clientWidth) / props.slidesPerView, behavior: 'smooth' })
}

defineExpose({ scroll })
</script>

<template>
  <div class="ui-carousel">
    <button
      v-if="showArrows"
      type="button"
      class="ui-carousel__arrow ui-carousel__arrow--prev"
      aria-label="Anterior"
      @click="scroll(-1)"
    >
      ‹
    </button>

    <div ref="trackRef" class="ui-carousel__track">
      <slot />
    </div>

    <button
      v-if="showArrows"
      type="button"
      class="ui-carousel__arrow ui-carousel__arrow--next"
      aria-label="Siguiente"
      @click="scroll(1)"
    >
      ›
    </button>
  </div>
</template>

<style scoped>
.ui-carousel {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.ui-carousel__track {
  display: flex;
  gap: v-bind(gap);
  flex: 1;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.ui-carousel__track::-webkit-scrollbar {
  display: none;
}

.ui-carousel__arrow {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-primary);
  background: var(--color-background);
  color: var(--color-primary);
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ui-carousel__arrow:hover {
  background: var(--color-primary);
  color: white;
}

/* En mobile el swipe touch nativo reemplaza a las flechas */
@media (max-width: 640px) {
  .ui-carousel__arrow {
    display: none;
  }
}
</style>
