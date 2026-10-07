<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Tamano del texto base (p, li). Los encabezados siguen su propia escala. */
    size?: 'md' | 'sm' | 'xsm'
  }>(),
  {
    size: 'md',
  },
)
</script>

<template>
  <div class="ui-prose" :class="`ui-prose--${size}`">
    <slot />
  </div>
</template>

<style scoped>
/*
  Estilos por descendencia para HTML que llega ya armado (CMS, paginas legales): ahi no se pueden
  reemplazar las etiquetas por <Heading>, <Paragraph> o <List>. Misma escala que esos componentes.
*/
.ui-prose {
  font-family: var(--font-family-body);
  line-height: 1.4;
  color: var(--color-text);
}
.ui-prose--md {
  font-size: clamp(1rem, 4vw, 1.2rem);
}
.ui-prose--sm {
  font-size: clamp(0.8rem, 5vw, 1rem);
}
.ui-prose--xsm {
  font-size: clamp(0.6rem, 4vw, 0.8rem);
}

.ui-prose :deep(h1),
.ui-prose :deep(h2),
.ui-prose :deep(h3),
.ui-prose :deep(h4),
.ui-prose :deep(h5),
.ui-prose :deep(h6) {
  margin: 0 0 1.2rem;
  font-family: var(--font-family-heading);
  font-weight: 700;
  line-height: 1.1;
}
.ui-prose :deep(h1) {
  font-size: clamp(1.8rem, 5vw, 3rem);
  margin-bottom: 1.8rem;
}
.ui-prose :deep(h2) {
  font-size: clamp(1.4rem, 5vw, 2.1rem);
  margin-bottom: 1rem;
}
.ui-prose :deep(h3) {
  font-size: clamp(1.2rem, 5vw, 1.8rem);
}
.ui-prose :deep(h4) {
  font-size: clamp(0.8rem, 5vw, 1.5rem);
}
.ui-prose :deep(h5),
.ui-prose :deep(h6) {
  font-size: clamp(0.8rem, 5vw, 1.2rem);
  margin-bottom: 0.8rem;
}

.ui-prose :deep(p) {
  margin: 0 0 1.2rem;
}

.ui-prose :deep(ul),
.ui-prose :deep(ol) {
  margin: 0 0 1.2rem;
  padding: 0 0 0 1.5rem;
}
.ui-prose :deep(ul) {
  list-style: disc;
}
.ui-prose :deep(ol) {
  list-style: decimal;
}
.ui-prose :deep(li + li) {
  margin-top: 0.8rem;
}
.ui-prose :deep(li)::marker {
  color: var(--color-primary);
}
.ui-prose :deep(ul > li)::marker {
  font-size: 1.15em;
}
.ui-prose :deep(ol > li)::marker {
  font-weight: 700;
}

.ui-prose :deep(a) {
  color: var(--color-primary);
  text-decoration: underline;
  transition: 0.35s ease-in-out;
}
.ui-prose :deep(a:hover) {
  text-decoration: none;
}

.ui-prose :deep(strong),
.ui-prose :deep(b) {
  font-weight: 700;
}

.ui-prose > :deep(:first-child) {
  margin-top: 0;
}
.ui-prose > :deep(:last-child) {
  margin-bottom: 0;
}
</style>
