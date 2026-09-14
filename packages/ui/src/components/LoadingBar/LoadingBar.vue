<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Si se pasa (0-100), la barra pasa a modo determinado con ese progreso. Sin ella, es indeterminada (sweep en loop). */
    value?: number
    size?: 'sm' | 'md'
    striped?: boolean
    label?: string
  }>(),
  {
    value: undefined,
    size: 'md',
    striped: false,
    label: 'Cargando',
  },
)

const isIndeterminate = computed(() => props.value === undefined)
const clampedValue = computed(() => Math.min(100, Math.max(0, props.value ?? 0)))
</script>

<template>
  <div
    class="ui-loading-bar"
    :class="`ui-loading-bar--${size}`"
    role="progressbar"
    :aria-label="label"
    :aria-valuemin="0"
    :aria-valuemax="100"
    :aria-valuenow="isIndeterminate ? undefined : clampedValue"
  >
    <div
      class="ui-loading-bar__fill"
      :class="{
        'ui-loading-bar__fill--indeterminate': isIndeterminate,
        'ui-loading-bar__fill--striped': striped,
      }"
      :style="isIndeterminate ? undefined : { width: `${clampedValue}%` }"
    />
  </div>
</template>

<style scoped>
.ui-loading-bar {
  width: 100%;
  border-radius: 999px;
  background: var(--color-surface);
  overflow: hidden;
}
.ui-loading-bar--sm {
  height: 4px;
}
.ui-loading-bar--md {
  height: 8px;
}

.ui-loading-bar__fill {
  height: 100%;
  border-radius: inherit;
  background: var(--color-primary);
  transition: width 0.3s ease;
}

.ui-loading-bar__fill--striped {
  background-image: repeating-linear-gradient(
    115deg,
    rgba(255, 255, 255, 0.3) 0 6px,
    transparent 6px 14px
  );
}

/* Barra corta que recorre la pista en loop; no representa un valor real, asi
   que se mantiene igual bajo prefers-reduced-motion (misma razon que Spinner). */
.ui-loading-bar__fill--indeterminate {
  width: 40%;
  animation: ui-loading-bar-sweep 1.3s ease-in-out infinite;
}

@keyframes ui-loading-bar-sweep {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(250%);
  }
}
</style>
