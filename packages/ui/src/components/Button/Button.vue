<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'danger'
type Size = 'sm' | 'md' | 'lg'

withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
)
</script>

<template>
  <button
    class="ui-button"
    :class="[`ui-button--${variant}`, `ui-button--${size}`]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.ui-button {
  display:inline-flex;
  justify-content: center;
  align-items: center;
  font-family: var(--font-family-body);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.ui-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ui-button--primary {
  background: var(--color-primary);
  color: white;
}
.ui-button--primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.ui-button--secondary {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}
.ui-button--secondary:hover:not(:disabled) {
  background: var(--color-primary);
  color: white;
}

.ui-button--danger {
  background: var(--color-danger);
  color: white;
}

.ui-button--sm {
  height:35px;
  padding:0 var(--spacing-md);
  font-size: 14px;
}
.ui-button--md {
  height:42px;
  padding: 0 var(--spacing-lg);
  font-size: 16px;
}
.ui-button--lg {
  height:45px;
  padding: 0 calc(var(--spacing-lg) * 1.5);
  font-size: 18px;
}
</style>
