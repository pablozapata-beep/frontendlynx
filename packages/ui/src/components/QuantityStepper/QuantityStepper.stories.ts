import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import QuantityStepper from './QuantityStepper.vue'

const meta = {
  title: 'Components/QuantityStepper',
  component: QuantityStepper,
  tags: ['autodocs', 'forms'],
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
  },
  args: {
    modelValue: 3,
    min: 1,
    max: 10,
    step: 1,
    disabled: false,
  },
} satisfies Meta<typeof QuantityStepper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { QuantityStepper },
    setup: () => ({ args, value: ref(3) }),
    template: `<QuantityStepper v-bind="args" v-model="value" />`,
  }),
}

export const AtMin: Story = {
  render: (args) => ({
    components: { QuantityStepper },
    setup: () => ({ args, value: ref(args.min ?? 1) }),
    template: `<QuantityStepper v-bind="args" v-model="value" />`,
  }),
}

export const AtMax: Story = {
  render: (args) => ({
    components: { QuantityStepper },
    setup: () => ({ args, value: ref(args.max ?? 10) }),
    template: `<QuantityStepper v-bind="args" v-model="value" />`,
  }),
}

export const CustomStep: Story = {
  args: { step: 5, min: 0, max: 50 },
  render: (args) => ({
    components: { QuantityStepper },
    setup: () => ({ args, value: ref(10) }),
    template: `<QuantityStepper v-bind="args" v-model="value" />`,
  }),
}
