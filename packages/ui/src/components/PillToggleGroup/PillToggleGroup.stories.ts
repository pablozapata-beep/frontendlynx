import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PillToggleGroup from './PillToggleGroup.vue'

const meta = {
  title: 'Components/PillToggleGroup',
  component: PillToggleGroup,
  tags: ['autodocs', 'forms'],
  args: {
    options: [
      { value: '1m', label: '1 mes' },
      { value: '3m', label: '3 meses' },
      { value: '6m', label: '6 meses' },
    ],
    modelValue: '1m',
  },
} satisfies Meta<typeof PillToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PillToggleGroup },
    setup: () => ({ args, selected: ref(args.modelValue) }),
    template: `<PillToggleGroup :options="args.options" v-model="selected" />`,
  }),
}
