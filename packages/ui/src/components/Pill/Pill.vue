<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
type Size = 'sm' | 'md'

withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    removable?: boolean
  }>(),
  {
    variant: 'neutral',
    size: 'md',
    removable: false,
  },
)

const emit = defineEmits<{
  remove: []
}>()
</script>

<template>
  <span class="ui-pill" :class="[`ui-pill--${variant}`, `ui-pill--${size}`]">
    <slot />
    <button
      v-if="removable"
      type="button"
      class="ui-pill__remove"
      aria-label="Quitar"
      @click="emit('remove')"
    >
      ×
    </button>
  </span>
</template>

<style scoped>
.ui-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  font-family: var(--font-family-body);
  border-radius: 999px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}

.ui-pill--sm {
  padding: 0.25rem 0.6rem;
  font-size: 12px;
}
.ui-pill--md {
  padding: 0.4rem 0.85rem;
  font-size: 14px;
}

.ui-pill--primary {
  background: var(--color-primary);
  color: white;
}
.ui-pill--secondary {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}
.ui-pill--success {
  background: var(--color-success);
  color: white;
}
.ui-pill--warning {
  background: var(--color-warning);
  color: white;
}
.ui-pill--danger {
  background: var(--color-danger);
  color: white;
}
.ui-pill--info {
  background: var(--color-info);
  color: white;
}
.ui-pill--neutral {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.ui-pill__remove {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 1.1em;
  line-height: 1;
  padding: 0;
  opacity: 0.7;
}
.ui-pill__remove:hover {
  opacity: 1;
}
</style>
