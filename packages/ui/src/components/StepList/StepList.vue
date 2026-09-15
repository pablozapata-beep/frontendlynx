<script setup lang="ts">
import Card from '../Card/Card.vue'
import type { StepItem } from './types'

withDefaults(
  defineProps<{
    steps: StepItem[]
    ariaLabel?: string
  }>(),
  {
    ariaLabel: 'Pasos',
  },
)
</script>

<template>
  <ol class="ui-step-list" :aria-label="ariaLabel">
    <li v-for="(step, index) in steps" :key="index">
      <Card variant="outlined">
        <span class="ui-step-list__number" aria-hidden="true">{{ index + 1 }}</span>
        <div class="ui-step-list__content">
          <h3 class="ui-step-list__title">{{ step.title }}</h3>
          <p v-if="step.description" class="ui-step-list__description">{{ step.description }}</p>
        </div>
      </Card>
    </li>
  </ol>
</template>

<style scoped>
.ui-step-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  list-style: none;
  margin: 0;
  padding: 0;
}

.ui-step-list :deep(.ui-card__body) {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.ui-step-list__number {
  flex: 0 0 auto;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  font-family: var(--font-family-body);
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ui-step-list__title {
  margin: 0;
  font-family: var(--font-family-heading);
  font-weight: 700;
  font-size: 17px;
  line-height: 1.25;
  color: var(--color-text);
}

.ui-step-list__description {
  margin: 6px 0 0;
  font-size: 14px;
  opacity: 0.7;
  color: var(--color-text);
}
</style>
