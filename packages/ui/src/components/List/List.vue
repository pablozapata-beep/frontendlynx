<script setup lang="ts">
import ListItem from './ListItem.vue'

withDefaults(
  defineProps<{
    /** 'bullets': ul con vinetas. 'none': ul sin vinetas. 'ordered': ol numerada. */
    variant?: 'bullets' | 'none' | 'ordered'
    size?: 'md' | 'sm' | 'xsm'
    /** Separacion entre items. */
    gap?: 'sm' | 'md' | 'lg'
    /** Atajo para listas simples de texto; para contenido rico usar <ListItem> en el slot. */
    items?: string[]
  }>(),
  {
    variant: 'bullets',
    size: 'md',
    gap: 'md',
    items: undefined,
  },
)
</script>

<template>
  <component
    :is="variant === 'ordered' ? 'ol' : 'ul'"
    class="ui-list"
    :class="[`ui-list--${variant}`, `ui-list--${size}`, `ui-list--gap-${gap}`]"
    :role="variant === 'none' ? 'list' : undefined"
  >
    <slot>
      <ListItem v-for="(item, index) in items" :key="index">{{ item }}</ListItem>
    </slot>
  </component>
</template>

<style scoped>
.ui-list {
  margin: 0 0 1.2rem;
  padding: 0 0 0 1.5rem;
  font-family: var(--font-family-body);
  line-height: 1.4;
  color: var(--color-text);
}

.ui-list--none {
  list-style: none;
  padding-left: 0;
}

.ui-list--md {
  font-size: clamp(1rem, 4vw, 1.2rem);
}
.ui-list--sm {
  font-size: clamp(0.8rem, 5vw, 1rem);
}
.ui-list--xsm {
  font-size: clamp(0.6rem, 4vw, 0.8rem);
}

/* Margen y no flex/gap: un <li> como flex item deja de ser list-item y pierde su marcador. */
.ui-list--gap-sm :deep(.ui-list-item + .ui-list-item) {
  margin-top: 0.4rem;
}
.ui-list--gap-md :deep(.ui-list-item + .ui-list-item) {
  margin-top: 0.8rem;
}
.ui-list--gap-lg :deep(.ui-list-item + .ui-list-item) {
  margin-top: 1.2rem;
}

.ui-list--bullets {
  list-style: disc;
}
.ui-list--ordered {
  list-style: decimal;
}
.ui-list--bullets :deep(.ui-list-item)::marker,
.ui-list--ordered :deep(.ui-list-item)::marker {
  color: var(--color-primary);
}
.ui-list--bullets :deep(.ui-list-item)::marker {
  font-size: 1.15em;
}
.ui-list--ordered :deep(.ui-list-item)::marker {
  font-weight: 700;
}

.ui-list :deep(a) {
  color: var(--color-primary);
  text-decoration: underline;
  transition: 0.35s ease-in-out;
}
.ui-list :deep(a:hover) {
  text-decoration: none;
}
</style>
