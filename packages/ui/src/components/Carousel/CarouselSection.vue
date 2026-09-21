<script setup lang="ts">
import { ref } from 'vue'
import Carousel from './Carousel.vue'

withDefaults(
  defineProps<{
    title: string
    slidesPerView?: number
    gap?: string
    peek?: number
    showViewAll?: boolean
    viewAllLabel?: string
    prevLabel?: string
    nextLabel?: string
  }>(),
  {
    slidesPerView: 1,
    gap: '1rem',
    peek: 0.15,
    showViewAll: true,
    viewAllLabel: 'Ver todo',
    prevLabel: 'Anterior',
    nextLabel: 'Siguiente',
  },
)

const emit = defineEmits<{
  viewAll: []
}>()

const carouselRef = ref<InstanceType<typeof Carousel> | null>(null)
</script>

<template>
  <section class="ui-carousel-section">
    <div class="ui-carousel-section__header">
      <h2 class="ui-carousel-section__title">{{ title }}</h2>
      <div class="ui-carousel-section__controls">
        <button
          v-if="showViewAll"
          type="button"
          class="ui-carousel-section__view-all"
          @click="emit('viewAll')"
        >
          {{ viewAllLabel }}
        </button>
        <div class="ui-carousel-section__arrows">
          <button
            type="button"
            class="ui-carousel-section__arrow"
            :aria-label="prevLabel"
            @click="carouselRef?.scroll(-1)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            class="ui-carousel-section__arrow"
            :aria-label="nextLabel"
            @click="carouselRef?.scroll(1)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <Carousel ref="carouselRef" :slides-per-view="slidesPerView" :gap="gap" :peek="peek" :show-arrows="false">
      <slot />
    </Carousel>
  </section>
</template>

<style scoped>
.ui-carousel-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.ui-carousel-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.ui-carousel-section__title {
  margin: 0;
  font-family: var(--font-family-heading);
  font-weight: 700;
  font-size: 20px;
  color: var(--color-text);
}

.ui-carousel-section__controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

.ui-carousel-section__view-all {
  font-family: var(--font-family-body);
  font-size: 13px;
  font-weight: 700;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  white-space: nowrap;
}
.ui-carousel-section__view-all:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.ui-carousel-section__arrows {
  display: flex;
  gap: var(--spacing-sm);
}

.ui-carousel-section__arrow {
  width: 2.25rem;
  height: 2.25rem;
  flex-shrink: 0;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s ease, color 0.15s ease;
}
.ui-carousel-section__arrow:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* En mobile el swipe touch nativo del Carousel reemplaza a las flechas;
   "Ver todo" se mantiene visible (mismo criterio pedido para el bloque). */
@media (max-width: 640px) {
  .ui-carousel-section__arrows {
    display: none;
  }
}
</style>
