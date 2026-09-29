<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'gold'
type Size = 'sm' | 'md'

withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    removable?: boolean
    /** Fondo transparente con borde y texto del color de la variante, en vez del relleno solido. */
    outline?: boolean
  }>(),
  {
    variant: 'neutral',
    size: 'md',
    removable: false,
    outline: false,
  },
)

const emit = defineEmits<{
  remove: []
}>()
</script>

<template>
  <span
    class="ui-pill"
    :class="[`ui-pill--${variant}`, `ui-pill--${size}`, { 'ui-pill--outline': outline }]"
  >
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

.ui-pill--primary,
.ui-pill--success,
.ui-pill--warning,
.ui-pill--info,
.ui-pill--danger,
.ui-pill--info  {
  color: white;
}

.ui-pill--primary {
  background: var(--color-primary);
  
}
.ui-pill--secondary {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}
.ui-pill--success {
  background: var(--color-success);
}
.ui-pill--warning {
  background: var(--color-warning);
}
.ui-pill--danger {
  background: var(--color-danger);
}

.ui-pill--info {
  background: var(--color-info);
}

.ui-pill--neutral {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
.ui-pill--gold {
  background: var(--color-gold);
  color: var(--color-text);
}

.ui-pill--outline {
  background: transparent;
  border: 1px solid currentColor;
}
.ui-pill--outline.ui-pill--primary {
  color: var(--color-primary);
}
.ui-pill--outline.ui-pill--success {
  color: var(--color-success);
}
.ui-pill--outline.ui-pill--warning {
  color: var(--color-warning);
}
.ui-pill--outline.ui-pill--danger {
  color: var(--color-danger);
}
.ui-pill--outline.ui-pill--info {
  color: var(--color-info);
}
.ui-pill--outline.ui-pill--neutral {
  color: var(--color-text);
  border-color: var(--color-border);
}
.ui-pill--outline.ui-pill--gold {
  color: var(--color-gold);
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
