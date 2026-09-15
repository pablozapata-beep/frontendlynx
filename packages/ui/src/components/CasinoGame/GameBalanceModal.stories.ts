import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import GameBalanceModal from './GameBalanceModal.vue'
import type { BalanceOption } from './types'

const BALANCES: BalanceOption[] = [
  { value: 'bcd', label: 'BCD (Balance de depósito)' },
  { value: 'usdt', label: 'USDT (Balance de depósito)' },
  { value: 'btc', label: 'BTC (Balance de depósito)' },
]

const meta = {
  title: 'Components/GameBalanceModal',
  component: GameBalanceModal,
  tags: ['autodocs', 'overlay'],
  args: {
    open: true,
    balances: BALANCES,
    modelValue: 'bcd',
    message: 'Saldo insuficiente BCD, cambia a otro activo o deposita para seguir jugando.',
    bonusLabel: '🎁 Bono de depósito +180%',
  },
  parameters: {
    docs: { story: { inline: false, iframeHeight: 480 } },
  },
} satisfies Meta<typeof GameBalanceModal>

export default meta
type Story = StoryObj<typeof meta>

export const SaldoInsuficiente: Story = {
  name: 'Saldo insuficiente',
  render: (args) => ({
    components: { GameBalanceModal },
    setup: () => ({ args, open: ref(true), selected: ref('bcd') }),
    template: `
      <GameBalanceModal
        v-bind="args"
        :open="open"
        v-model="selected"
        @close="open = false"
      />
    `,
  }),
}

export const SinBono: Story = {
  name: 'Sin bono de depósito',
  args: { bonusLabel: undefined },
  render: (args) => ({
    components: { GameBalanceModal },
    setup: () => ({ args, open: ref(true), selected: ref('bcd') }),
    template: `<GameBalanceModal v-bind="args" :open="open" v-model="selected" @close="open = false" />`,
  }),
}
