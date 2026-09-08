<script setup lang="ts">
import { computed, inject } from 'vue'
import QuantityStepper from '../QuantityStepper/QuantityStepper.vue'
import type { TicketPickerState } from './useTicketPickerState'
import type { FixedFlowOptionId, TicketPickerCopy } from './types'

const { game, fixedConfig, fixedQuantities, selectedFixedOption, setFixedOption, setFixedQuantity } =
  inject<TicketPickerState>('ticket-picker-state')!
const copy = inject<TicketPickerCopy>('ticket-picker-copy')!

const options = computed(() => {
  const config = fixedConfig.value
  if (!config) return []
  return [
    {
      id: 'different' as FixedFlowOptionId,
      title: copy.fixedDifferentTitle,
      description: copy.fixedDifferentDescription,
    },
    {
      id: 'same' as FixedFlowOptionId,
      title: copy.fixedSameTitle,
      description: copy.fixedSameDescription,
    },
    {
      id: 'entero' as FixedFlowOptionId,
      title: copy.fixedEnteroTitle,
      description: `${copy.fixedEnteroDescription} (${config.enteroDecimos})`,
    },
  ]
})

const volumeDiscountNote = computed(() => {
  const config = fixedConfig.value
  if (!config) return ''
  const currency = game.value.currency ?? '$'
  return copy.volumeDiscountNote({
    amount: `${currency}${config.volumeDiscount.toFixed(2)}`,
    threshold: config.volumeThreshold,
    max: config.volumeMax,
  })
})
</script>

<template>
  <div v-if="fixedConfig" class="ui-fixed-flow">
    <div
      v-for="option in options"
      :key="option.id"
      class="ui-fixed-flow__row"
      :class="{ 'ui-fixed-flow__row--selected': selectedFixedOption === option.id }"
    >
      <button
        type="button"
        class="ui-fixed-flow__radio"
        role="radio"
        :aria-checked="selectedFixedOption === option.id"
        @click="setFixedOption(option.id)"
      />
      <div class="ui-fixed-flow__body">
        <p class="ui-fixed-flow__title">{{ option.title }}</p>
        <p class="ui-fixed-flow__description">{{ option.description }}</p>
      </div>
      <QuantityStepper
        :model-value="fixedQuantities[option.id]"
        :min="1"
        :max="10"
        @update:model-value="(value) => setFixedQuantity(option.id, value)"
      />
    </div>

    <div class="ui-fixed-flow__banner">{{ volumeDiscountNote }}</div>
  </div>
</template>

<style scoped>
.ui-fixed-flow {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  font-family: var(--font-family-body);
  color: var(--color-text);
}

.ui-fixed-flow__row {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}
.ui-fixed-flow__row--selected {
  border-color: var(--color-primary);
}

.ui-fixed-flow__radio {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background: transparent;
  flex-shrink: 0;
  cursor: pointer;
}
.ui-fixed-flow__row--selected .ui-fixed-flow__radio {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.ui-fixed-flow__body {
  flex: 1;
  min-width: 0;
}

.ui-fixed-flow__title {
  font-weight: 700;
  font-size: 13px;
  margin: 0 0 2px;
}

.ui-fixed-flow__description {
  font-size: 12px;
  opacity: 0.7;
  margin: 0;
}

.ui-fixed-flow__banner {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  font-size: 12.5px;
  text-align: center;
}
</style>
