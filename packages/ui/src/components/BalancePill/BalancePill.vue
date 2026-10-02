<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    balance: number
    currency?: string
    /** Con saldo menor o igual a este valor el pill pasa a estado "bajo" (rojo). */
    lowThreshold?: number
    label?: string
    lowLabel?: string
    emptyLabel?: string
    addLabel?: string
  }>(),
  {
    currency: '$',
    lowThreshold: 200,
    label: 'Saldo disponible',
    lowLabel: 'Saldo bajo',
    emptyLabel: 'Sin saldo',
    addLabel: 'Agregar saldo',
  },
)

const emit = defineEmits<{
  add: []
}>()

const isLow = computed(() => props.balance <= props.lowThreshold)
const formattedBalance = computed(
  () => `${props.currency}${props.balance.toLocaleString('es-ES', { maximumFractionDigits: 2 })}`,
)
const statusLabel = computed(() => {
  if (props.balance === 0) return props.emptyLabel
  return isLow.value ? props.lowLabel : props.label
})
</script>

<template>
  <div class="ui-balance-pill" :class="{ 'ui-balance-pill--low': isLow }" role="status" aria-live="polite">
    <span class="ui-balance-pill__dot" aria-hidden="true" />
    <span class="ui-balance-pill__meta">
      <span class="ui-balance-pill__label">{{ statusLabel }}</span>
      <span class="ui-balance-pill__amount">{{ formattedBalance }}</span>
    </span>
    <button
      type="button"
      class="ui-balance-pill__add"
      :aria-label="addLabel"
      :data-tooltip="addLabel"
      @click="emit('add')"
    >
      <svg
        class="ui-balance-pill__add-icon"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
      <span class="ui-balance-pill__add-text">{{ addLabel }}</span>
    </button>
  </div>
</template>

<style scoped>
.ui-balance-pill {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  height: 2.5rem;
  padding: 0 var(--spacing-sm) 0 0.875rem;
  border-radius: 999px;
  font-family: var(--font-family-body);
  background: var(--color-surface-dark-light);
  color: var(--color-surface-dark-text-secondary);
  transition: background-color 0.25s ease, color 0.25s ease;
}

.ui-balance-pill__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-success);
  transition: background-color 0.25s ease;
}

.ui-balance-pill__meta {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
}
.ui-balance-pill__label {
  font-size: 10px;
  color: var(--color-surface-dark-text-primary);
  transition: color 0.25s ease;
}
.ui-balance-pill__amount {
  font-size: 15px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: white;
}

.ui-balance-pill__add {
  position: relative;
  height: 1.75rem;
  margin-left: 4px;
  padding: 0 0.75rem;
  border: 0;
  border-radius: 999px;
  background: var(--color-primary);
  color: white;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: filter 0.2s ease, transform 0.1s ease, background-color 0.2s ease, color 0.2s ease;
}
.ui-balance-pill__add-icon {
  display: none;
}
.ui-balance-pill__add:hover {
  background:var(--color-primary-hover)
}
.ui-balance-pill__add:active {
  transform: scale(0.97);
  filter: brightness(1.15);
}

.ui-balance-pill--low {
  background: var(--color-danger);
  color: white;
  animation: ui-balance-pill-ring 1.6s ease-out 2;
}
.ui-balance-pill--low .ui-balance-pill__dot {
  background: white;
}
.ui-balance-pill--low .ui-balance-pill__label {
  color: rgba(255, 255, 255, 0.88);
}
.ui-balance-pill--low .ui-balance-pill__add {
  background: white;
  color: var(--color-danger);
}

@keyframes ui-balance-pill-ring {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-danger) 65%, transparent);
  }
  100% {
    box-shadow: 0 0 0 14px color-mix(in srgb, var(--color-danger) 0%, transparent);
  }
}

/* Mobile: "Agregar saldo" pasa a ser solo un icono "+" (con tooltip; el texto sigue
   disponible para lectores de pantalla). En desktop el texto ya es visible. */
@media (max-width: 640px) {
  .ui-balance-pill__add {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    padding: 0;
    border-radius: 50%;
  }
  .ui-balance-pill__add-icon {
    display: block;
  }
  .ui-balance-pill__add-text {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .ui-balance-pill__add[data-tooltip]::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: calc(100% + 8px);
    right: 0;
    transform: translateY(4px);
    padding: 4px 8px;
    border-radius: var(--radius-sm);
    background: var(--color-surface-dark-light);
    border: 1px solid var(--color-surface-dark-text-primary);
    color: var(--color-surface-dark-text-secondary);
    font-size: 11px;
    font-weight: 600;
    line-height: 1.2;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s ease, transform 0.15s ease;
    z-index: 10;
  }
  .ui-balance-pill__add[data-tooltip]:hover::after,
  .ui-balance-pill__add[data-tooltip]:focus-visible::after {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ui-balance-pill--low {
    animation: none;
  }
}
</style>
