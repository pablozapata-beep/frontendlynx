<script setup lang="ts">
type Variant = 'elevated' | 'outlined' | 'flat'

withDefaults(
  defineProps<{
    variant?: Variant
  }>(),
  {
    variant: 'elevated',
  },
)
</script>

<template>
  <div class="ui-card" :class="`ui-card--${variant}`">
    <div v-if="$slots.header" class="ui-card__header">
      <slot name="header" />
    </div>
    <div class="ui-card__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="ui-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.ui-card {
  background: var(--color-background);
  border-radius: var(--radius-lg);
  font-family: var(--font-family-body);
  color: var(--color-text);
  overflow: hidden;
}

.ui-card--elevated {
  box-shadow: var(--shadow-md);
}
.ui-card--outlined {
  border: 1px solid var(--color-border);
}
.ui-card--flat {
  background: var(--color-surface);
}

.ui-card__header,
.ui-card__footer {
  padding: var(--spacing-md) var(--spacing-lg);
}
.ui-card__header {
  border-bottom: 1px solid var(--color-border);
  font-family: var(--font-family-heading);
  font-weight: 600;
}
.ui-card__footer {
  border-top: 1px solid var(--color-border);
}

.ui-card__body {
  padding: var(--spacing-lg);
}
</style>
