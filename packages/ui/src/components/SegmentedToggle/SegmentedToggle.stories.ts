import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import SegmentedToggle from './SegmentedToggle.vue'

const meta = {
  title: 'Components/SegmentedToggle',
  component: SegmentedToggle,
  tags: ['autodocs', 'forms'],
  args: {
    options: [
      { value: 'demo', label: 'Demo' },
      { value: 'real', label: 'Juego Real' },
    ],
    modelValue: 'real',
  },
} satisfies Meta<typeof SegmentedToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { SegmentedToggle },
    setup: () => ({ args, selected: ref(args.modelValue) }),
    template: `
      <div style="padding: var(--spacing-md); background: var(--color-surface-dark);">
        <SegmentedToggle :options="args.options" v-model="selected" />
      </div>
    `,
  }),
}
