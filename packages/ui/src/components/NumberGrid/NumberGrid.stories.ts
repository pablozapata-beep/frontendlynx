import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import NumberGrid from './NumberGrid.vue'

const meta = {
  title: 'Components/NumberGrid',
  component: NumberGrid,
  tags: ['autodocs', 'forms'],
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    maxSelected: { control: 'number' },
    columns: { control: 'number' },
  },
  args: {
    min: 1,
    max: 30,
    columns: 10,
    modelValue: [],
  },
} satisfies Meta<typeof NumberGrid>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { NumberGrid },
    setup: () => ({ args, selected: ref<number[]>([]) }),
    template: `<NumberGrid v-bind="args" v-model="selected" />`,
  }),
}

export const WithSelection: Story = {
  render: (args) => ({
    components: { NumberGrid },
    setup: () => ({ args, selected: ref<number[]>([3, 7, 12]) }),
    template: `<NumberGrid v-bind="args" v-model="selected" />`,
  }),
}

export const AtCapacity: Story = {
  args: { maxSelected: 5 },
  render: (args) => ({
    components: { NumberGrid },
    setup: () => ({ args, selected: ref<number[]>([1, 2, 3, 4, 5]) }),
    template: `<NumberGrid v-bind="args" v-model="selected" />`,
  }),
}

export const WithDisabledNumbers: Story = {
  render: (args) => ({
    components: { NumberGrid },
    setup: () => ({ args, selected: ref<number[]>([]) }),
    template: `<NumberGrid v-bind="args" :disabled-numbers="[4, 5, 6]" v-model="selected" />`,
  }),
}
