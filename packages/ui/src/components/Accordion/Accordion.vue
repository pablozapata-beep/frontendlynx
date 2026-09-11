<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import type { AccordionContext } from './types'

const props = withDefaults(
  defineProps<{
    /** Si es false, abrir un item cierra los demas (solo uno abierto a la vez). */
    multiple?: boolean
  }>(),
  {
    multiple: true,
  },
)

const isMultiple = computed(() => props.multiple)
const activeId = ref<symbol | null>(null)

provide<AccordionContext>('ui-accordion', { isMultiple, activeId })
</script>

<template>
  <div class="ui-accordion">
    <slot />
  </div>
</template>

<style scoped>
.ui-accordion {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
</style>
