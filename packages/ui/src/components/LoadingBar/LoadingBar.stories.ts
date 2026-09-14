import type { Meta, StoryObj } from '@storybook/vue3-vite'
import LoadingBar from './LoadingBar.vue'

const meta = {
  title: 'Components/LoadingBar',
  component: LoadingBar,
  tags: ['autodocs', 'display'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
    striped: { control: 'boolean' },
    value: { control: { type: 'number', min: 0, max: 100 } },
  },
} satisfies Meta<typeof LoadingBar>

export default meta
type Story = StoryObj<typeof meta>

export const Indeterminada: Story = {
  render: (args) => ({
    components: { LoadingBar },
    setup: () => ({ args }),
    template: `<div style="max-width: 22rem;"><LoadingBar v-bind="args" /></div>`,
  }),
}

export const Determinada: Story = {
  args: { value: 62 },
  render: (args) => ({
    components: { LoadingBar },
    setup: () => ({ args }),
    template: `<div style="max-width: 22rem;"><LoadingBar v-bind="args" /></div>`,
  }),
}

export const ConRayas: Story = {
  name: 'Con rayas (striped)',
  args: { value: 45, striped: true },
  render: (args) => ({
    components: { LoadingBar },
    setup: () => ({ args }),
    template: `<div style="max-width: 22rem;"><LoadingBar v-bind="args" /></div>`,
  }),
}

export const Tamanos: Story = {
  name: 'Tamaños',
  render: () => ({
    components: { LoadingBar },
    template: `
      <div style="max-width: 22rem; display: flex; flex-direction: column; gap: 1rem;">
        <LoadingBar size="sm" />
        <LoadingBar size="md" />
      </div>
    `,
  }),
}
