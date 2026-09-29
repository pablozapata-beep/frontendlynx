import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import Pill from './Pill.vue'

const meta = {
  title: 'Components/Pill',
  component: Pill,
  tags: ['autodocs', 'display'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral', 'gold'],
    },
    size: { control: 'select', options: ['sm', 'md'] },
    removable: { control: 'boolean' },
  },
  args: {
    variant: 'neutral',
    size: 'md',
    removable: false,
    onRemove: fn(),
  },
} satisfies Meta<typeof Pill>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { Pill },
    setup: () => ({ args }),
    template: `<Pill v-bind="args" @remove="args.onRemove">Etiqueta</Pill>`,
  }),
}

export const Removible: Story = {
  args: { removable: true, variant: 'primary' },
  render: (args) => ({
    components: { Pill },
    setup: () => ({ args }),
    template: `<Pill v-bind="args" @remove="args.onRemove">Removible</Pill>`,
  }),
}

export const Variantes: Story = {
  render: () => ({
    components: { Pill },
    template: `
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <Pill variant="primary">Primary</Pill>
        <Pill variant="secondary">Secondary</Pill>
        <Pill variant="success">Success</Pill>
        <Pill variant="warning">Warning</Pill>
        <Pill variant="danger">Danger</Pill>
        <Pill variant="info">Info</Pill>
        <Pill variant="neutral">Neutral</Pill>
        <Pill variant="gold">Gold</Pill>
      </div>
    `,
  }),
}

export const Outline: Story = {
  name: 'Variantes con outline (fondo transparente)',
  render: () => ({
    components: { Pill },
    template: `
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; padding: 1rem; background: var(--color-surface-dark);">
        <Pill variant="gold" outline>Listo para jugar</Pill>
        <Pill variant="info" outline>Faltan 18 para que juegue</Pill>
        <Pill variant="danger" outline>Cierra pronto</Pill>
      </div>
    `,
  }),
}
