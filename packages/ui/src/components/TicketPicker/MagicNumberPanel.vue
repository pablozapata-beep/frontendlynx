<script setup lang="ts">
import { inject } from 'vue'
import NumberGrid from '../NumberGrid/NumberGrid.vue'
import QuantityStepper from '../QuantityStepper/QuantityStepper.vue'
import type { TicketPickerState } from './useTicketPickerState'
import type { TicketPickerCopy } from './types'

const {
  rangeConfig,
  magicPanelOpen,
  magicPicks,
  magicBets,
  toggleMagicPanel,
  addMagicBets,
  updateMagicStake,
  removeMagicBet,
} = inject<TicketPickerState>('ticket-picker-state')!
const copy = inject<TicketPickerCopy>('ticket-picker-copy')!
</script>

<template>
  <div v-if="rangeConfig?.magicNumber" class="ui-magic-number-panel">
    <button type="button" class="ui-magic-number-panel__toggle" @click="toggleMagicPanel">
      <span>{{ rangeConfig.magicNumber.label ?? copy.magicNumberToggleLabel }}</span>
      <span
        class="ui-magic-number-panel__chevron"
        :class="{ 'ui-magic-number-panel__chevron--open': magicPanelOpen }"
      >⌄</span>
    </button>

    <div v-if="magicPanelOpen" class="ui-magic-number-panel__body">
      <NumberGrid v-model="magicPicks" :min="rangeConfig.magicNumber.min" :max="rangeConfig.magicNumber.max" />
      <button
        type="button"
        class="ui-magic-number-panel__add"
        :disabled="magicPicks.length === 0"
        @click="addMagicBets"
      >
        {{ copy.addMagicLabel }}
      </button>

      <div v-for="bet in magicBets" :key="bet.id" class="ui-magic-number-panel__bet">
        <span class="ui-magic-number-panel__bet-number">{{ bet.number }}</span>
        <QuantityStepper
          :model-value="bet.stake"
          :min="rangeConfig.magicNumber.betMin"
          :max="rangeConfig.magicNumber.betMax"
          :aria-label="copy.stakeLabel"
          @update:model-value="(value) => updateMagicStake(bet.id, value)"
        />
        <span class="ui-magic-number-panel__payout">
          {{ copy.payoutPreviewLabel }}: {{ (bet.stake * rangeConfig.magicNumber.payout).toFixed(2) }}
        </span>
        <button type="button" class="ui-magic-number-panel__remove" @click="removeMagicBet(bet.id)">
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ui-magic-number-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-family: var(--font-family-body);
  color: var(--color-text);
  overflow: hidden;
}

.ui-magic-number-panel__toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  border: none;
  padding: var(--spacing-md);
  font-weight: 700;
  font-size: 13px;
  color: var(--color-text);
  cursor: pointer;
}

.ui-magic-number-panel__chevron {
  transition: transform 0.2s;
}
.ui-magic-number-panel__chevron--open {
  transform: rotate(180deg);
}

.ui-magic-number-panel__body {
  padding: 0 var(--spacing-md) var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.ui-magic-number-panel__add {
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}
.ui-magic-number-panel__add:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.ui-magic-number-panel__bet {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 12px;
}

.ui-magic-number-panel__bet-number {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.ui-magic-number-panel__payout {
  flex: 1;
  color: var(--color-text);
  opacity: 0.75;
}

.ui-magic-number-panel__remove {
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  color: var(--color-text);
}
.ui-magic-number-panel__remove:hover {
  color: var(--color-danger);
  border-color: var(--color-danger);
}
</style>
