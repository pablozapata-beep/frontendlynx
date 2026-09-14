<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'success' | 'warning' | 'error'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant: Variant
    size?: Size
    /** Desactiva la animacion de entrada (queda directo en el estado final). */
    animated?: boolean
    /** Agrega un pulso continuo alrededor del icono (util para llamar la atencion, ej. advertencias). */
    pulse?: boolean
    /** Si se pasa, el icono deja de ser decorativo (role="img" + aria-label). */
    label?: string
  }>(),
  {
    size: 'md',
    animated: true,
    pulse: false,
    label: undefined,
  },
)

const isDecorative = computed(() => !props.label)
</script>

<template>
  <span
    class="ui-status-icon"
    :class="[
      `ui-status-icon--${variant}`,
      `ui-status-icon--${size}`,
      { 'ui-status-icon--static': !animated, 'ui-status-icon--pulse': pulse },
    ]"
    :role="isDecorative ? undefined : 'img'"
    :aria-hidden="isDecorative ? 'true' : undefined"
    :aria-label="isDecorative ? undefined : label"
  >
    <svg class="ui-status-icon__svg" viewBox="0 0 52 52" fill="none">
      <circle
        v-if="variant === 'success' || variant === 'error'"
        class="ui-status-icon__ring"
        cx="26"
        cy="26"
        r="23"
        stroke-width="3"
        pathLength="1"
      />
      <path
        v-if="variant === 'warning'"
        class="ui-status-icon__ring"
        d="M26 4 L48.5 46 L3.5 46 Z"
        stroke-width="3"
        stroke-linejoin="round"
        pathLength="1"
      />

      <path
        v-if="variant === 'success'"
        class="ui-status-icon__mark"
        d="M14.5 27.5 L22 35 L38.5 17"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
        pathLength="1"
      />

      <g v-if="variant === 'error'" class="ui-status-icon__marks">
        <path class="ui-status-icon__mark" d="M17.5 17.5 L34.5 34.5" stroke-width="4" stroke-linecap="round" pathLength="1" />
        <path
          class="ui-status-icon__mark ui-status-icon__mark--delayed"
          d="M34.5 17.5 L17.5 34.5"
          stroke-width="4"
          stroke-linecap="round"
          pathLength="1"
        />
      </g>

      <template v-if="variant === 'warning'">
        <path class="ui-status-icon__mark" d="M26 21 L26 33" stroke-width="4" stroke-linecap="round" pathLength="1" />
        <circle class="ui-status-icon__dot" cx="26" cy="40" r="2.2" />
      </template>
    </svg>
  </span>
</template>

<style scoped>
.ui-status-icon {
  display: inline-flex;
  flex-shrink: 0;
}

.ui-status-icon--sm {
  width: 2rem;
  height: 2rem;
}
.ui-status-icon--md {
  width: 3rem;
  height: 3rem;
}
.ui-status-icon--lg {
  width: 4rem;
  height: 4rem;
}

.ui-status-icon__svg {
  width: 100%;
  height: 100%;
}

.ui-status-icon--success {
  color: var(--color-success);
}
.ui-status-icon--warning {
  color: var(--color-warning);
}
.ui-status-icon--error {
  color: var(--color-danger);
}
.ui-status-icon__ring,
.ui-status-icon__mark {
  stroke: currentColor;
}
.ui-status-icon__dot {
  fill: currentColor;
}

/* El truco de pathLength="1" deja que stroke-dasharray/dashoffset "dibujen"
   el trazo sin medir su longitud real en JS: 1 = todo el trazo. */
.ui-status-icon__ring,
.ui-status-icon__mark {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: ui-status-icon-draw 0.45s ease forwards;
}
.ui-status-icon__mark {
  animation-duration: 0.3s;
  animation-delay: 0.45s;
}
.ui-status-icon__mark--delayed {
  animation-delay: 0.65s;
}
.ui-status-icon__dot {
  transform-origin: center;
  transform: scale(0);
  opacity: 0;
  animation: ui-status-icon-pop 0.2s ease forwards;
  animation-delay: 0.75s;
}

.ui-status-icon--error .ui-status-icon__marks {
  animation: ui-status-icon-shake 0.4s ease;
  animation-delay: 0.85s;
}

@keyframes ui-status-icon-draw {
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes ui-status-icon-pop {
  to {
    transform: scale(1);
    opacity: 1;
  }
}
@keyframes ui-status-icon-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-1.5px);
  }
  75% {
    transform: translateX(1.5px);
  }
}

.ui-status-icon--pulse .ui-status-icon__svg {
  animation: ui-status-icon-pulse 1.8s ease-in-out infinite;
  animation-delay: 0.9s;
}
@keyframes ui-status-icon-pulse {
  0%,
  100% {
    filter: drop-shadow(0 0 0 transparent);
  }
  50% {
    filter: drop-shadow(0 0 6px currentColor);
  }
}

/* Estado final estatico: sin animacion de entrada ni pulso continuo. */
.ui-status-icon--static .ui-status-icon__ring,
.ui-status-icon--static .ui-status-icon__mark {
  animation: none;
  stroke-dashoffset: 0;
}
.ui-status-icon--static .ui-status-icon__dot {
  animation: none;
  transform: scale(1);
  opacity: 1;
}
.ui-status-icon--static .ui-status-icon__marks,
.ui-status-icon--static .ui-status-icon__svg {
  animation: none;
}

@media (prefers-reduced-motion: reduce) {
  .ui-status-icon__ring,
  .ui-status-icon__mark,
  .ui-status-icon__marks,
  .ui-status-icon__svg {
    animation: none;
    stroke-dashoffset: 0;
  }
  .ui-status-icon__dot {
    animation: none;
    transform: scale(1);
    opacity: 1;
  }
}
</style>
