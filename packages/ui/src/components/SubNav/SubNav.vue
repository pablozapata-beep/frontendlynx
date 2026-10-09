<script setup lang="ts">
export interface SubNavItem {
  id: string
  label: string
  /** Muestra una flecha, para pills que abren un menu (ej. "Categorias"). El menu en si lo resuelve quien consume. */
  hasMenu?: boolean
  /** Solo con hasMenu: refleja si el menu esta abierto (aria-expanded). */
  expanded?: boolean
  disabled?: boolean
}

withDefaults(
  defineProps<{
    items: SubNavItem[]
    /** Id del item activo (v-model). */
    modelValue?: string
    ariaLabel?: string
  }>(),
  {
    modelValue: undefined,
    ariaLabel: 'Secciones',
  },
)

const emit = defineEmits<{
  'update:modelValue': [id: string]
  /** Cada click, incluido el de pills con menu (que no cambian el activo). */
  select: [item: SubNavItem, event: MouseEvent]
}>()

function onClick(item: SubNavItem, event: MouseEvent) {
  emit('select', item, event)
  if (!item.hasMenu) emit('update:modelValue', item.id)
}
</script>

<template>
  <nav class="ui-sub-nav" :aria-label="ariaLabel">
    <ul class="ui-sub-nav__list">
      <li v-for="item in items" :key="item.id" class="ui-sub-nav__item">
        <button
          type="button"
          class="ui-sub-nav__pill"
          :class="{ 'ui-sub-nav__pill--active': !item.hasMenu && item.id === modelValue }"
          :disabled="item.disabled"
          :aria-current="!item.hasMenu && item.id === modelValue ? 'true' : undefined"
          :aria-haspopup="item.hasMenu ? 'true' : undefined"
          :aria-expanded="item.hasMenu ? !!item.expanded : undefined"
          @click="onClick(item, $event)"
        >
          {{ item.label }}
          <svg
            v-if="item.hasMenu"
            class="ui-sub-nav__chevron"
            :class="{ 'ui-sub-nav__chevron--open': item.expanded }"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
/* Hereda el color del contenedor: sobre el header oscuro se ve claro, sobre uno claro se ve oscuro. */
.ui-sub-nav {
  font-family: var(--font-family-body);
  color: inherit;
}

.ui-sub-nav__list {
  display: flex;
  gap: 10px;
  margin: 0;
  padding: 2px;
  list-style: none;
  overflow-x: auto;
  scrollbar-width: none;
}
.ui-sub-nav__list::-webkit-scrollbar {
  display: none;
}

.ui-sub-nav__item {
  flex: 0 0 auto;
}

.ui-sub-nav__pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 2.25rem;
  padding: 0 1.1rem;
  border: 1px solid color-mix(in srgb, currentColor 55%, transparent);
  border-radius: 999px;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
.ui-sub-nav__pill:hover:not(:disabled) {
  border-color: currentColor;
  background: color-mix(in srgb, currentColor 10%, transparent);
}
.ui-sub-nav__pill:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
.ui-sub-nav__pill:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.ui-sub-nav__pill--active {
  background: var(--color-secondary-active-surface);
  border-color: var(--color-secondary-active-surface);
  color: white;
}

.ui-sub-nav__chevron {
  transition: transform 0.2s ease;
}
.ui-sub-nav__chevron--open {
  transform: rotate(180deg);
}

@media (prefers-reduced-motion: reduce) {
  .ui-sub-nav__pill,
  .ui-sub-nav__chevron {
    transition: none;
  }
}
</style>
