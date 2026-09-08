import type { Meta, StoryObj } from '@storybook/vue3-vite'
import LotteryBallBadge from './LotteryBallBadge.vue'

const meta = {
  title: 'Components/LotteryBallBadge',
  component: LotteryBallBadge,
  tags: ['autodocs', 'display'],
  argTypes: {
    label: { control: 'text' },
    background: { control: 'color' },
    color: { control: 'color' },
    size: { control: 'select', options: ['sm', 'md'] },
  },
  args: {
    label: 'PB',
    background: '#E4002B',
    color: '#FFFFFF',
    size: 'md',
  },
} satisfies Meta<typeof LotteryBallBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Small: Story = {
  args: { size: 'sm' },
}

export const MultipleBallsRow: Story = {
  render: () => ({
    components: { LotteryBallBadge },
    template: `
      <div style="display: flex; gap: 0.5rem;">
        <LotteryBallBadge label="PB" background="#E4002B" />
        <LotteryBallBadge label="MM" background="#3E7BE8" />
        <LotteryBallBadge label="EM" background="#B788F2" color="#1a0f2e" />
        <LotteryBallBadge label="PR" background="#F2C14E" color="#241C08" />
      </div>
    `,
  }),
}
