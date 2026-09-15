import type { Meta, StoryObj } from '@storybook/vue3-vite'
import StatCard from './StatCard.vue'

const meta = {
  title: 'Components/StatCard',
  component: StatCard,
  tags: ['autodocs', 'display'],
  args: {
    icon: '💰',
    value: '$847M+',
    label: 'En premios pagados',
    valueLabel: '847 millones de dólares en premios',
  },
} satisfies Meta<typeof StatCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { StatCard },
    setup: () => ({ args }),
    template: `<div style="max-width: 14rem;"><StatCard v-bind="args" /></div>`,
  }),
}

export const SinIcono: Story = {
  name: 'Sin ícono',
  args: { icon: undefined, value: '4.8', label: 'Rating promedio', valueLabel: '4.8 de 5 estrellas' },
  render: (args) => ({
    components: { StatCard },
    setup: () => ({ args }),
    template: `<div style="max-width: 14rem;"><StatCard v-bind="args" /></div>`,
  }),
}

export const GrillaDeEstadisticas: Story = {
  name: 'Grilla (como en "social proof")',
  render: () => ({
    components: { StatCard },
    template: `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; max-width: 48rem;">
        <StatCard icon="💰" value="$847M+" value-label="847 millones de dólares en premios" label="En premios pagados" />
        <StatCard icon="🏆" value="2.4M+" value-label="2.4 millones de ganadores" label="Ganadores certificados" />
        <StatCard icon="🌍" value="180+" value-label="180 países" label="Países con jugadores" />
        <StatCard icon="⭐" value="4.8" value-label="4.8 de 5 estrellas" label="Rating promedio" />
      </div>
    `,
  }),
}

export const ConIconoCustom: Story = {
  name: 'Con ícono custom (slot)',
  render: () => ({
    components: { StatCard },
    template: `
      <div style="max-width: 14rem;">
        <StatCard value="99.9%" label="Uptime">
          <template #icon>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
            </svg>
          </template>
        </StatCard>
      </div>
    `,
  }),
}
