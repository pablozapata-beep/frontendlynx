<script setup lang="ts">
import { computed, provide, toRef, watch } from 'vue'
import Modal from '../Modal/Modal.vue'
import Button from '../Button/Button.vue'
import LotteryBallBadge from '../LotteryBallBadge/LotteryBallBadge.vue'
import RangeFlow from './RangeFlow.vue'
import FixedFlow from './FixedFlow.vue'
import { createTicketPickerState } from './useTicketPickerState'
import { DEFAULT_DRAW_DURATION_OPTIONS, DEFAULT_TICKET_PICKER_COPY } from './types'
import type { DrawDurationOption, Ticket, TicketPickerCopy } from './types'
import type { JackpotGame } from '../JackpotCard/types'

const props = withDefaults(
  defineProps<{
    game: JackpotGame
    open: boolean
    copy?: Partial<TicketPickerCopy>
    drawDurationOptions?: DrawDurationOption[]
  }>(),
  {
    copy: undefined,
    drawDurationOptions: undefined,
  },
)

const emit = defineEmits<{
  close: []
  submit: [ticket: Ticket]
}>()

const gameRef = toRef(props, 'game')
const drawOptionsRef = computed(() => props.drawDurationOptions ?? DEFAULT_DRAW_DURATION_OPTIONS)
const resolvedCopy = computed<TicketPickerCopy>(() => ({ ...DEFAULT_TICKET_PICKER_COPY, ...props.copy }))

const state = createTicketPickerState(gameRef, drawOptionsRef)
const { grandTotal, canSubmit, buildTicket, reset } = state

provide('ticket-picker-state', state)
provide('ticket-picker-copy', resolvedCopy.value)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) reset()
  },
)

function handleSubmit() {
  if (!canSubmit.value) return
  emit('submit', buildTicket())
}
</script>

<template>
  <Modal :open="open" :close-label="resolvedCopy.closeLabel" @close="emit('close')">
    <template #header>
      <div class="ui-ticket-picker__header">
        <div class="ui-ticket-picker__balls">
          <LotteryBallBadge v-for="ball in game.balls" :key="ball.id" v-bind="ball" />
        </div>
        <h3 class="ui-ticket-picker__title">{{ resolvedCopy.titlePrefix }} {{ game.name }}</h3>
      </div>
    </template>

    <RangeFlow v-if="game.config.kind === 'range'" />
    <FixedFlow v-else />

    <template #footer>
      <div class="ui-ticket-picker__total-row">
        <span>{{ resolvedCopy.totalLabel }}</span>
        <span class="ui-ticket-picker__total-amount">
          {{ game.currency ?? '$' }}{{ grandTotal.toFixed(2) }}
        </span>
      </div>
      <Button :disabled="!canSubmit" @click="handleSubmit">
        {{ resolvedCopy.submitLabel }}
      </Button>
    </template>
  </Modal>
</template>

<style scoped>
.ui-ticket-picker__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.ui-ticket-picker__balls {
  display: flex;
  gap: 4px;
}

.ui-ticket-picker__title {
  font-family: var(--font-family-heading);
  font-weight: 700;
  font-size: 18px;
  margin: 0;
  color: var(--color-text);
}

.ui-ticket-picker__total-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--spacing-md);
  font-family: var(--font-family-body);
  color: var(--color-text);
}

.ui-ticket-picker__total-amount {
  font-family: var(--font-family-heading);
  font-weight: 800;
  font-size: 22px;
}
</style>
