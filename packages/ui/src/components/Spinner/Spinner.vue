<script setup lang="ts">
type Variant = 'dual-ring' | 'ring' | 'dots'
type Size = 'sm' | 'md' | 'lg'

withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    /** Color: 'primary' usa el token de marca; 'current' hereda el color de texto del contexto (util dentro de un Button). */
    tone?: 'primary' | 'current'
    label?: string
  }>(),
  {
    variant: 'dual-ring',
    size: 'md',
    tone: 'primary',
    label: 'Cargando',
  },
)
</script>

<template>
  <span
    class="ui-spinner"
    :class="[`ui-spinner--${size}`, `ui-spinner--${tone}`]"
    role="status"
    :aria-label="label"
  >
    <span v-if="variant === 'dual-ring'" class="ui-spinner__dual-ring">
      <span class="ui-spinner__ring ui-spinner__ring--outer" />
      <span class="ui-spinner__ring ui-spinner__ring--inner" />
    </span>

    <span v-else-if="variant === 'ring'" class="ui-spinner__single-ring" />

    <span v-else class="ui-spinner__dots">
      <span class="ui-spinner__dot" />
      <span class="ui-spinner__dot" />
      <span class="ui-spinner__dot" />
    </span>
  </span>
</template>

<style scoped>
/*
  Los spinners comunican un proceso activo, no son decorativos: a diferencia
  de StatusIcon/Countdown, la rotacion/pulso sigue igual bajo
  prefers-reduced-motion (pararla haria pensar que la carga se colgo).
*/

.ui-spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ui-spinner--primary {
  color: var(--color-primary);
}
.ui-spinner--current {
  color: currentColor;
}

/* font-size fija la unidad "em" que usan los trazos/puntos de cada variante,
   asi escalan proporcionalmente con el tamaño del spinner. */
.ui-spinner--sm {
  width: 1.25rem;
  height: 1.25rem;
  font-size: 1.25rem;
}
.ui-spinner--md {
  width: 2rem;
  height: 2rem;
  font-size: 2rem;
}
.ui-spinner--lg {
  width: 3rem;
  height: 3rem;
  font-size: 3rem;
}

/* ---- dual-ring: el clasico circulo-dentro-de-circulo, sentidos opuestos ---- */
.ui-spinner__dual-ring {
  position: relative;
  width: 100%;
  height: 100%;
}
.ui-spinner__ring {
  position: absolute;
  border-radius: 50%;
  border: 0.15em solid transparent;
}
.ui-spinner__ring--outer {
  inset: 0;
  border-top-color: currentColor;
  border-right-color: currentColor;
  animation: ui-spinner-spin 1s linear infinite;
}
.ui-spinner__ring--inner {
  inset: 22%;
  border-bottom-color: currentColor;
  border-left-color: currentColor;
  animation: ui-spinner-spin-reverse 0.8s linear infinite;
}

/* ---- ring: spinner simple, un solo arco sobre una pista neutra ---- */
.ui-spinner__single-ring {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 0.1em solid var(--color-border);
  border-top-color: currentColor;
  animation: ui-spinner-spin 0.8s linear infinite;
}

/* ---- dots: tres puntos con bounce escalonado ---- */
.ui-spinner__dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25em;
  width: 100%;
  height: 100%;
}
.ui-spinner__dot {
  width: 0.28em;
  height: 0.28em;
  border-radius: 50%;
  background: currentColor;
  animation: ui-spinner-dot-bounce 1s ease-in-out infinite;
}
.ui-spinner__dot:nth-child(2) {
  animation-delay: 0.15s;
}
.ui-spinner__dot:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes ui-spinner-spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes ui-spinner-spin-reverse {
  to {
    transform: rotate(-360deg);
  }
}
@keyframes ui-spinner-dot-bounce {
  0%,
  80%,
  100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
