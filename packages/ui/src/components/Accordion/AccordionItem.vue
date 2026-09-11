<script setup lang="ts">
import { inject, ref, watch } from 'vue'
import type { AccordionContext } from './types'

const props = withDefaults(
  defineProps<{
    title: string
    defaultOpen?: boolean
  }>(),
  {
    defaultOpen: false,
  },
)

const accordion = inject<AccordionContext | undefined>('ui-accordion', undefined)
const instanceId = Symbol('ui-accordion-item')
const isOpen = ref(props.defaultOpen)

if (isOpen.value && accordion && !accordion.isMultiple.value) {
  accordion.activeId.value = instanceId
}

if (accordion) {
  watch(accordion.activeId, (activeId) => {
    if (!accordion.isMultiple.value && activeId !== instanceId) isOpen.value = false
  })
}

function onToggle(event: Event) {
  const open = (event.target as HTMLDetailsElement).open
  isOpen.value = open
  if (open && accordion && !accordion.isMultiple.value) accordion.activeId.value = instanceId
}
</script>

<template>
  <details class="ui-accordion-item" :open="isOpen" @toggle="onToggle">
    <summary class="ui-accordion-item__summary">
      <h3 class="ui-accordion-item__title">{{ title }}</h3>
      <svg
        class="ui-accordion-item__chevron"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </summary>
    <div class="ui-accordion-item__content">
      <slot />
    </div>
  </details>
</template>

<style scoped>
.ui-accordion-item {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.ui-accordion-item__summary {
  list-style: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--color-text);
}
.ui-accordion-item__summary::-webkit-details-marker {
  display: none;
}

.ui-accordion-item[open] .ui-accordion-item__summary {
  border-bottom: 1px solid var(--color-border);
}

.ui-accordion-item__chevron {
  flex-shrink: 0;
  color: var(--color-text);
  opacity: 0.5;
  transition: transform 0.2s ease;
}
.ui-accordion-item[open] .ui-accordion-item__chevron {
  transform: rotate(180deg);
}

.ui-accordion-item__title,
.ui-accordion-item__content {
  font-family: var(--font-family-body);
}

.ui-accordion-item__title {
  margin:0;
  font-size:clamp(.9rem, 5vw, 1.2rem);
  font-weight: 600;
}

.ui-accordion-item__content {
  padding: var(--spacing-md) var(--spacing-lg) var(--spacing-md) var(--spacing-lg);
  color: var(--color-text);
  font-size:clamp(.85rem, 4vw, 1rem);
  opacity: 0.85;
}

/*
  El contenido del slot se compila con el scope del componente padre, no el de
  AccordionItem, asi que estos selectores necesitan :deep() para llegar a el
  (ver el mismo patron en JackpotCard.vue).
*/
.ui-accordion-item__content :deep(h4) {
  font-size: clamp(.9rem, 4vw, 1.1rem);
}
.ui-accordion-item__content :deep(p) {
  font-size: clamp(.85rem, 4vw, 1rem);
}
.ui-accordion-item__content :deep(a) {
  text-decoration: underline;
  transition: .35s ease-in-out;
}
.ui-accordion-item__content :deep(a:hover) {
  text-decoration: none;
}


</style>
