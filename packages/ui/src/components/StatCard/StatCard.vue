<script setup lang="ts">
withDefaults(
  defineProps<{
    /** El numero/dato destacado. String para permitir formatos como "$847M+" o "4.8". */
    value: string | number
    label: string
    /** Emoji o simbolo corto, decorativo. Para un icono custom (SVG, StatusIcon, etc.) usa el slot #icon. */
    icon?: string
    /** aria-label alternativo para el valor, util cuando esta abreviado (ej. "847 millones de dolares" para "$847M+"). */
    valueLabel?: string
  }>(),
  {
    icon: undefined,
    valueLabel: undefined,
  },
)
</script>

<template>
  <div class="ui-stat-card">
    <div v-if="icon || $slots.icon" class="ui-stat-card__icon" aria-hidden="true">
      <slot name="icon">{{ icon }}</slot>
    </div>
    <p class="ui-stat-card__value" :aria-label="valueLabel">{{ value }}</p>
    <p class="ui-stat-card__label">{{ label }}</p>
  </div>
</template>

<style scoped>
.ui-stat-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg) var(--spacing-md);
  text-align: center;
  transition: border-color 0.2s ease, transform 0.2s ease;
}
.ui-stat-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-4px);
}

.ui-stat-card__icon {
  font-size: 40px;
  line-height: 1;
  margin-bottom: var(--spacing-sm);
}

.ui-stat-card__value {
  font-family: var(--font-family-heading);
  font-weight: 800;
  font-size: 32px;
  color: var(--color-primary);
  font-variant-numeric: tabular-nums;
  line-height: 1;
  margin: 0 0 4px;
}

.ui-stat-card__label {
  font-size: 14px;
  color: var(--color-text);
  opacity: 0.7;
  margin: 0;
}
</style>
