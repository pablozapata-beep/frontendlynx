<script setup lang="ts">
import { inject } from 'vue'
import Pill from '../Pill/Pill.vue'
import type { TicketPickerState } from './useTicketPickerState'
import type { TicketPickerCopy } from './types'

const { lines, removeLine } = inject<TicketPickerState>('ticket-picker-state')!
const copy = inject<TicketPickerCopy>('ticket-picker-copy')!
</script>

<template>
  <div class="ui-ticket-lines-list">
    <p class="ui-ticket-lines-list__title">
      {{ copy.linesTitle }} <b>{{ lines.length }}</b>
    </p>
    <p v-if="lines.length === 0" class="ui-ticket-lines-list__empty">{{ copy.emptyLinesLabel }}</p>
    <div v-else class="ui-ticket-lines-list__items">
      <div v-for="line in lines" :key="line.id" class="ui-ticket-lines-list__row">
        <span class="ui-ticket-lines-list__numbers">
          {{ [...line.main, ...line.bonus].join(' - ') }}
        </span>
        <Pill removable size="sm" @remove="removeLine(line.id)">Línea</Pill>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ui-ticket-lines-list {
  font-family: var(--font-family-body);
  color: var(--color-text);
}

.ui-ticket-lines-list__title {
  font-size: 12px;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  margin: 0 0 var(--spacing-sm);
}

.ui-ticket-lines-list__empty {
  font-size: 12px;
  color: var(--color-text);
  opacity: 0.6;
  text-align: center;
  padding: var(--spacing-md) 0;
  margin: 0;
}

.ui-ticket-lines-list__items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.ui-ticket-lines-list__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
}

.ui-ticket-lines-list__numbers {
  font-size: 13px;
  font-weight: 600;
}
</style>
