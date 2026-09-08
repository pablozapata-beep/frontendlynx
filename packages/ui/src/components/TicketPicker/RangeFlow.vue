<script setup lang="ts">
import { computed, inject } from 'vue'
import QuantityStepper from '../QuantityStepper/QuantityStepper.vue'
import PillToggleGroup from './PillToggleGroup.vue'
import ManualLineBuilder from './ManualLineBuilder.vue'
import TicketLinesList from './TicketLinesList.vue'
import MagicNumberPanel from './MagicNumberPanel.vue'
import type { TicketPickerState } from './useTicketPickerState'
import type { PickerMode, TicketPickerCopy } from './types'

const {
  mode,
  numPlays,
  drawDurationOptions,
  drawDurationIndex,
  setMode,
  generateRandomLines,
  setDrawDurationIndex,
} = inject<TicketPickerState>('ticket-picker-state')!
const copy = inject<TicketPickerCopy>('ticket-picker-copy')!

const modeOptions = computed(() => [
  { value: 'manual', label: copy.manualModeLabel },
  { value: 'surprise', label: copy.surpriseModeLabel },
  { value: 'auto', label: copy.autoModeLabel },
])

const drawOptions = computed(() =>
  drawDurationOptions.value.map((option, index) => ({
    value: String(index),
    label: option.label ?? `${option.draws} sorteo${option.draws === 1 ? '' : 's'}`,
  })),
)

function onModeChange(value: string) {
  setMode(value as PickerMode)
}

function onDrawDurationChange(value: string) {
  setDrawDurationIndex(Number(value))
}

function onGenerateRandomLines() {
  generateRandomLines(numPlays.value)
}
</script>

<template>
  <div class="ui-range-flow">
    <div class="ui-range-flow__plays">
      <span>{{ copy.numPlaysLabel }}</span>
      <QuantityStepper v-model="numPlays" :min="1" :max="10" :aria-label="copy.numPlaysLabel" />
    </div>

    <PillToggleGroup :options="modeOptions" :model-value="mode" @update:model-value="onModeChange" />

    <ManualLineBuilder v-if="mode === 'manual'" />

    <div v-else-if="mode === 'surprise'" class="ui-range-flow__auto-panel">
      <p>{{ copy.surpriseDescription(numPlays) }}</p>
      <button type="button" class="ui-range-flow__auto-btn" @click="onGenerateRandomLines">
        {{ copy.surpriseButtonLabel }}
      </button>
    </div>

    <div v-else class="ui-range-flow__auto-panel">
      <p>{{ copy.autoDescription(numPlays) }}</p>
      <button type="button" class="ui-range-flow__auto-btn" @click="onGenerateRandomLines">
        {{ copy.autoButtonLabel }}
      </button>
    </div>

    <TicketLinesList />

    <div class="ui-range-flow__draws">
      <span class="ui-range-flow__draws-label">{{ copy.drawDurationLabel }}</span>
      <PillToggleGroup
        :options="drawOptions"
        :model-value="String(drawDurationIndex)"
        @update:model-value="onDrawDurationChange"
      />
    </div>

    <MagicNumberPanel />
  </div>
</template>

<style scoped>
.ui-range-flow {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  font-family: var(--font-family-body);
  color: var(--color-text);
}

.ui-range-flow__plays {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 13px;
  font-weight: 600;
}

.ui-range-flow__auto-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  text-align: center;
}
.ui-range-flow__auto-panel p {
  font-size: 13px;
  margin: 0 0 var(--spacing-md);
  opacity: 0.8;
}

.ui-range-flow__auto-btn {
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
}

.ui-range-flow__draws-label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
}
</style>
