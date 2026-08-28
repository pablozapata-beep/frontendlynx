import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Countdown from './Countdown.vue'

function inMs(ms: number) {
  return new Date(Date.now() + ms)
}

const meta = {
  title: 'Components/Countdown',
  component: Countdown,
  tags: ['autodocs', 'display'],
  argTypes: {
    target: { control: 'date' },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Countdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    target: inMs(2 * 86_400_000 + 14 * 3_600_000 + 33 * 60_000),
    label: 'Cierre de ventas en',
  },
}

export const SinLabel: Story = {
  args: {
    target: inMs(3 * 3_600_000),
  },
}

export const PorExpirar: Story = {
  args: {
    target: inMs(65_000),
    label: 'Termina en',
  },
}
