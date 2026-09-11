import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ProgressMeter from './ProgressMeter.vue'

const meta = {
  title: 'Components/ProgressMeter',
  component: ProgressMeter,
  tags: ['autodocs', 'display'],
  argTypes: {
    closing: { control: 'boolean' },
  },
  args: {
    value: 46,
    max: 150,
    min: 100,
  },
} satisfies Meta<typeof ProgressMeter>

export default meta
type Story = StoryObj<typeof meta>

export const Waiting: Story = {
  render: (args) => ({
    components: { ProgressMeter },
    setup: () => ({ args }),
    template: `<div style="max-width: 24rem;"><ProgressMeter v-bind="args" /></div>`,
  }),
}

export const Locked: Story = {
  args: { value: 120 },
  render: (args) => ({
    components: { ProgressMeter },
    setup: () => ({ args }),
    template: `<div style="max-width: 24rem;"><ProgressMeter v-bind="args" /></div>`,
  }),
}

export const ClosingSoon: Story = {
  args: { value: 46, closing: true },
  render: (args) => ({
    components: { ProgressMeter },
    setup: () => ({ args }),
    template: `<div style="max-width: 24rem;"><ProgressMeter v-bind="args" /></div>`,
  }),
}

export const SinMinimo: Story = {
  name: 'Sin umbral minimo',
  args: { value: 46, min: undefined },
  render: (args) => ({
    components: { ProgressMeter },
    setup: () => ({ args }),
    template: `<div style="max-width: 24rem;"><ProgressMeter v-bind="args" /></div>`,
  }),
}
