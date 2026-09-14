<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
  }>(),
  {
    label: undefined,
  },
)
</script>

<template>
  <div class="ui-promo-slider-slide" role="group" aria-roledescription="slide" :aria-label="label">
    <slot />
  </div>
</template>

<style scoped>
.ui-promo-slider-slide {
  position: relative;
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
}
</style>
