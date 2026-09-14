import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Spinner from './Spinner.vue'

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs', 'display'],
  argTypes: {
    variant: { control: 'select', options: ['dual-ring', 'ring', 'dots'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    tone: { control: 'select', options: ['primary', 'current'] },
  },
  args: {
    variant: 'dual-ring',
    size: 'lg',
    tone: 'primary',
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const DualRing: Story = {
  name: 'Dual ring (circulo dentro de circulo)',
  args: { variant: 'dual-ring' },
}

export const Ring: Story = {
  args: { variant: 'ring' },
}

export const Dots: Story = {
  args: { variant: 'dots' },
}

export const LasTresVariantes: Story = {
  name: 'Las tres variantes juntas',
  render: () => ({
    components: { Spinner },
    template: `
      <div style="display: flex; gap: 2.5rem; align-items: center;">
        <Spinner variant="dual-ring" size="lg" />
        <Spinner variant="ring" size="lg" />
        <Spinner variant="dots" size="lg" />
      </div>
    `,
  }),
}

export const Tamanos: Story = {
  name: 'Tamaños',
  render: () => ({
    components: { Spinner },
    template: `
      <div style="display: flex; gap: 1.5rem; align-items: center;">
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
      </div>
    `,
  }),
}

export const DentroDeUnBoton: Story = {
  name: 'Dentro de un botón (tone=current)',
  render: () => ({
    components: { Spinner },
    template: `
      <button style="display:inline-flex; align-items:center; gap:8px; padding:10px 18px; border-radius:8px; border:none; background:var(--color-primary); color:white; font-weight:700; cursor:pointer;">
        <Spinner variant="ring" size="sm" tone="current" />
        Procesando...
      </button>
    `,
  }),
}
