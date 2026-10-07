<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'md' | 'sm' | 'xsm'
    align?: 'left' | 'center' | 'right'
  }>(),
  {
    size: 'md',
    align: undefined,
  },
)
</script>

<template>
  <p class="ui-paragraph" :class="[`ui-paragraph--${size}`, { [`ui-paragraph--align-${align}`]: align }]">
    <slot />
  </p>
</template>

<style scoped>
.ui-paragraph {
  margin: 0 0 1.2rem;
  font-family: var(--font-family-body);
  line-height: 1.4;
  color: var(--color-text);
}

.ui-paragraph--md {
  font-size: clamp(1rem, 4vw, 1.2rem);
}
.ui-paragraph--sm {
  font-size: clamp(0.8rem, 5vw, 1rem);
}
.ui-paragraph--xsm {
  font-size: clamp(0.6rem, 4vw, 0.8rem);
}

.ui-paragraph--align-left {
  text-align: left;
}
.ui-paragraph--align-center {
  text-align: center;
}
.ui-paragraph--align-right {
  text-align: right;
}

/* El contenido del slot lo renderiza quien consume el componente: sin :deep, los estilos scoped no lo alcanzan. */
.ui-paragraph :deep(a) {
  color: var(--color-primary);
  text-decoration: underline;
  transition: 0.35s ease-in-out;
}
.ui-paragraph :deep(a:hover) {
  text-decoration: none;
}
</style>
