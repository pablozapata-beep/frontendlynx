<script setup lang="ts">
import Modal from '../Modal/Modal.vue'
import Button from '../Button/Button.vue'
import type { BalanceOption } from './types'

withDefaults(
  defineProps<{
    open: boolean
    balances: BalanceOption[]
    modelValue: string
    /** Ej. "Saldo insuficiente BCD, cambia a otro activo o deposita para seguir jugando." */
    message?: string
    /** Ej. "🎁 Bono de depósito +180%" */
    bonusLabel?: string
    selectLabel?: string
    depositLabel?: string
    freePlayLabel?: string
    closeLabel?: string
  }>(),
  {
    message: undefined,
    bonusLabel: undefined,
    selectLabel: 'Juega con el saldo en',
    depositLabel: 'Depositar ahora',
    freePlayLabel: 'Juego Gratis',
    closeLabel: 'Cerrar',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  close: []
  deposit: []
  freePlay: []
}>()
</script>

<template>
  <Modal :open="open" :close-label="closeLabel" @close="emit('close')">
    <div class="ui-game-balance-modal">
      <label class="ui-game-balance-modal__select-row">
        <span class="ui-game-balance-modal__select-label">{{ selectLabel }}</span>
        <select
          class="ui-game-balance-modal__select"
          :value="modelValue"
          @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="balance in balances" :key="balance.value" :value="balance.value">
            {{ balance.label }}
          </option>
        </select>
      </label>

      <p v-if="message" class="ui-game-balance-modal__message">{{ message }}</p>
      <p v-if="bonusLabel" class="ui-game-balance-modal__bonus">{{ bonusLabel }}</p>

      <div class="ui-game-balance-modal__actions">
        <Button variant="primary" @click="emit('deposit')">{{ depositLabel }}</Button>
        <Button variant="secondary" @click="emit('freePlay')">{{ freePlayLabel }}</Button>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.ui-game-balance-modal {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  font-family: var(--font-family-body);
  color: var(--color-text);
  text-align: center;
}

.ui-game-balance-modal__select-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
}
.ui-game-balance-modal__select-label {
  font-size: 13px;
  font-weight: 600;
}
.ui-game-balance-modal__select {
  font-family: inherit;
  font-size: 14px;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
}

.ui-game-balance-modal__message {
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
}

.ui-game-balance-modal__bonus {
  margin: 0;
  font-weight: 700;
  color: var(--color-warning);
}

.ui-game-balance-modal__actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
</style>
