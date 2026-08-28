<script setup lang="ts">
import { computed, inject } from 'vue'

const slidesPerView = inject<number>('carousel-slides-per-view', 1)
const gap = inject<string>('carousel-gap', '1rem')

const desktopBasis = computed(
  () => `calc((100% - (${slidesPerView} - 1) * ${gap}) / ${slidesPerView})`,
)
</script>

<template>
  <div class="ui-carousel-slide">
    <slot />
  </div>
</template>

<style scoped>
.ui-carousel-slide {
  scroll-snap-align: start;
  flex: 0 0 85%;
}

/* En mobile se ve un "peek" del siguiente slide (85%); en desktop respeta slidesPerView */
@media (min-width: 768px) {
  .ui-carousel-slide {
    flex: 0 0 v-bind(desktopBasis);
  }
}
</style>
