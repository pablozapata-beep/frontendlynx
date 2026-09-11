<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    value: number
    max: number
    /** Umbral a partir del cual se considera "asegurado" (ej. minimo de participaciones vendidas). */
    min?: number
    /** Fuerza el estado visual de urgencia (ej. queda poco tiempo para el cierre). Es una senal externa, no se deriva de value/max. */
    closing?: boolean
    minLabel?: string
  }>(),
  {
    min: undefined,
    closing: false,
    minLabel: 'Mínimo',
  },
)

const percentage = computed(() => Math.min(100, Math.max(0, (props.value / props.max) * 100)))
const isLocked = computed(() => props.min !== undefined && props.value >= props.min)
const minPercentage = computed(() =>
  props.min === undefined ? 0 : Math.min(96, Math.max(0, (props.min / props.max) * 100)),
)
</script>

<template>
  <div
    class="ui-progress-meter"
    :class="{ 'ui-progress-meter--locked': isLocked, 'ui-progress-meter--closing': closing }"
    role="progressbar"
    :aria-valuenow="value"
    :aria-valuemin="0"
    :aria-valuemax="max"
  >
    <div class="ui-progress-meter__fill" :style="{ width: `${percentage}%` }" />
    <div
      v-if="min !== undefined && !isLocked"
      class="ui-progress-meter__min-marker"
      :style="{ left: `${minPercentage}%` }"
    >
      <span class="ui-progress-meter__notch ui-progress-meter__notch--top" />
      <span class="ui-progress-meter__notch ui-progress-meter__notch--bottom" />
      <span class="ui-progress-meter__min-label">{{ minLabel }}</span>
    </div>
  </div>
</template>

<style scoped>
.ui-progress-meter {
  position: relative;
  height: 2rem;
  border-radius: 999px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.ui-progress-meter__fill {
  position: absolute;
  inset: 0;
  width: 0%;
  background: var(--color-primary);
  transition: width 0.6s cubic-bezier(0.16, 0.85, 0.24, 1);
}
.ui-progress-meter__fill::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    115deg,
    rgba(255, 255, 255, 0.16) 0 2px,
    transparent 2px 10px
  );
}

.ui-progress-meter--locked .ui-progress-meter__fill {
  background: var(--color-success);
}
.ui-progress-meter--closing .ui-progress-meter__fill {
  background: var(--color-danger);
}

.ui-progress-meter__min-marker {
  position: absolute;
  top: -1px;
  bottom: -1px;
  border-left: 2px dashed var(--color-text);
  opacity: 0.55;
  z-index: 1;
}

.ui-progress-meter__notch {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}
.ui-progress-meter__notch--top {
  top: -7px;
}
.ui-progress-meter__notch--bottom {
  bottom: -7px;
}

.ui-progress-meter__min-label {
  position: absolute;
  top: 50%;
  left: 8px;
  transform: translateY(-50%);
  font-family: var(--font-family-body);
  font-size: 10px;
  font-weight: 700;
  color: var(--color-text);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  white-space: nowrap;
  opacity: 1;
}
</style>
