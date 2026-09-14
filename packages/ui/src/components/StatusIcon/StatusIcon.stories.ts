import type { Meta, StoryObj } from '@storybook/vue3-vite'
import StatusIcon from './StatusIcon.vue'

const meta = {
  title: 'Components/StatusIcon',
  component: StatusIcon,
  tags: ['autodocs', 'display'],
  argTypes: {
    variant: { control: 'select', options: ['success', 'warning', 'error'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    animated: { control: 'boolean' },
    pulse: { control: 'boolean' },
  },
  args: {
    variant: 'success',
    size: 'lg',
    animated: true,
    pulse: false,
  },
} satisfies Meta<typeof StatusIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Success: Story = {
  args: { variant: 'success' },
}

export const Warning: Story = {
  args: { variant: 'warning' },
}

export const Error: Story = {
  args: { variant: 'error' },
}

export const LosTres: Story = {
  name: 'Los tres juntos',
  render: () => ({
    components: { StatusIcon },
    template: `
      <div style="display: flex; gap: 2rem; align-items: center;">
        <StatusIcon variant="success" size="lg" />
        <StatusIcon variant="warning" size="lg" />
        <StatusIcon variant="error" size="lg" />
      </div>
    `,
  }),
}

export const ConPulso: Story = {
  name: 'Con pulso continuo (advertencia)',
  args: { variant: 'warning', pulse: true },
}

export const SinAnimacion: Story = {
  name: 'Sin animacion (estatico)',
  args: { variant: 'error', animated: false },
}

export const Tamanos: Story = {
  name: 'Tamaños',
  render: () => ({
    components: { StatusIcon },
    template: `
      <div style="display: flex; gap: 1.5rem; align-items: center;">
        <StatusIcon variant="success" size="sm" />
        <StatusIcon variant="success" size="md" />
        <StatusIcon variant="success" size="lg" />
      </div>
    `,
  }),
}

export const ConLabelAccesible: Story = {
  name: 'Standalone con label accesible',
  args: { variant: 'success', label: 'Pago realizado con éxito' },
}
