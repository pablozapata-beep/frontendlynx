import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import BalancePill from './BalancePill.vue'

const meta = {
  title: 'Components/BalancePill',
  component: BalancePill,
  tags: ['autodocs', 'display'],
  argTypes: {
    balance: { control: 'number' },
    lowThreshold: { control: 'number' },
    currency: { control: 'text' },
  },
  args: {
    balance: 1250,
    currency: '$',
    lowThreshold: 200,
  },
} satisfies Meta<typeof BalancePill>

export default meta
type Story = StoryObj<typeof meta>

const DARK_BG = 'padding: 1rem; background: var(--color-surface-dark); display: inline-block;'

export const Default: Story = {
  render: (args) => ({
    components: { BalancePill },
    setup: () => {
      const balance = ref(args.balance)
      const add = () => {
        balance.value += 500
      }
      return { args, balance, add }
    },
    template: `
      <div style="${DARK_BG}">
        <BalancePill v-bind="args" :balance="balance" @add="add" />
      </div>
      <div style="padding: 1rem; font-family: var(--font-family-body);">
        <label>Saldo: {{ balance }}
          <input type="range" min="0" max="2000" step="10" v-model.number="balance" />
        </label>
      </div>
    `,
  }),
}

export const SaldoBajo: Story = {
  name: 'Saldo bajo',
  args: { balance: 120 },
  render: (args) => ({
    components: { BalancePill },
    setup: () => ({ args }),
    template: `<div style="${DARK_BG}"><BalancePill v-bind="args" /></div>`,
  }),
}

export const SinSaldo: Story = {
  name: 'Sin saldo',
  args: { balance: 0 },
  render: (args) => ({
    components: { BalancePill },
    setup: () => ({ args }),
    template: `<div style="${DARK_BG}"><BalancePill v-bind="args" /></div>`,
  }),
}
