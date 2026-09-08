<script setup lang="ts">
import { inject } from 'vue'
import NumberGrid from '../NumberGrid/NumberGrid.vue'
import type { TicketPickerState } from './useTicketPickerState'
import type { TicketPickerCopy } from './types'

const { rangeConfig, mainPicks, bonusPicks, canAddLine, clearCurrentPicks, addLine } =
  inject<TicketPickerState>('ticket-picker-state')!
const copy = inject<TicketPickerCopy>('ticket-picker-copy')!
</script>

<template>
  <div v-if="rangeConfig" class="ui-manual-line-builder">
    <div class="ui-manual-line-builder__preview">
      <div class="ui-manual-line-builder__chips">
        <span
          v-for="i in rangeConfig.mainCount"
          :key="`main-${i}`"
          class="ui-manual-line-builder__chip"
          :class="{ 'ui-manual-line-builder__chip--filled': mainPicks[i - 1] !== undefined }"
        >
          {{ mainPicks[i - 1] ?? '?' }}
        </span>
        <span
          v-for="i in rangeConfig.bonusCount"
          :key="`bonus-${i}`"
          class="ui-manual-line-builder__chip ui-manual-line-builder__chip--bonus"
          :class="{ 'ui-manual-line-builder__chip--filled': bonusPicks[i - 1] !== undefined }"
        >
          {{ bonusPicks[i - 1] ?? '?' }}
        </span>
      </div>
      <button type="button" class="ui-manual-line-builder__clear" @click="clearCurrentPicks">
        {{ copy.clearLabel }}
      </button>
    </div>

    <p class="ui-manual-line-builder__label">
      {{ copy.mainNumbersLabel }} <b>({{ mainPicks.length }}/{{ rangeConfig.mainCount }})</b>
    </p>
    <NumberGrid
      v-model="mainPicks"
      :min="rangeConfig.mainMin"
      :max="rangeConfig.mainMax"
      :max-selected="rangeConfig.mainCount"
      :aria-label="copy.mainNumbersLabel"
    />

    <p class="ui-manual-line-builder__label">
      {{ rangeConfig.bonusLabel ?? copy.bonusNumbersLabel }}
      <b>({{ bonusPicks.length }}/{{ rangeConfig.bonusCount }})</b>
    </p>
    <NumberGrid
      v-model="bonusPicks"
      :min="rangeConfig.bonusMin"
      :max="rangeConfig.bonusMax"
      :max-selected="rangeConfig.bonusCount"
      :aria-label="rangeConfig.bonusLabel ?? copy.bonusNumbersLabel"
    />

    <button
      type="button"
      class="ui-manual-line-builder__add"
      :disabled="!canAddLine"
      @click="addLine"
    >
      {{ copy.addLineLabel }}
    </button>
  </div>
</template>

<style scoped>
.ui-manual-line-builder {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  font-family: var(--font-family-body);
  color: var(--color-text);
}

.ui-manual-line-builder__preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
}

.ui-manual-line-builder__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.ui-manual-line-builder__chip {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  border: 1.5px dashed var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text);
}
.ui-manual-line-builder__chip--filled {
  border-style: solid;
  border-color: transparent;
  background: var(--color-primary);
  color: white;
}
.ui-manual-line-builder__chip--bonus.ui-manual-line-builder__chip--filled {
  background: var(--color-secondary);
}

.ui-manual-line-builder__clear {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
}

.ui-manual-line-builder__label {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text);
  display: flex;
  justify-content: space-between;
  margin: 0;
}

.ui-manual-line-builder__add {
  width: 100%;
  background: transparent;
  border: 1.5px dashed var(--color-border);
  color: var(--color-text);
  font-weight: 700;
  font-size: 13.5px;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  cursor: pointer;
}
.ui-manual-line-builder__add:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.ui-manual-line-builder__add:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
