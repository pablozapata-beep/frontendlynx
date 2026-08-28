import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Card from './Card.vue'

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs', 'display'],
  argTypes: {
    variant: { control: 'select', options: ['elevated', 'outlined', 'flat'] },
  },
  args: {
    variant: 'elevated',
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Simple: Story = {
  render: (args) => ({
    components: { Card },
    setup: () => ({ args }),
    template: `
      <Card v-bind="args" style="max-width: 20rem;">
        Contenido simple de la card, sin header ni footer.
      </Card>
    `,
  }),
}

export const ConHeaderYFooter: Story = {
  render: (args) => ({
    components: { Card },
    setup: () => ({ args }),
    template: `
      <Card v-bind="args" style="max-width: 20rem;">
        <template #header>Titulo de la card</template>
        Contenido principal de la card.
        <template #footer>
          <button style="border:none;background:transparent;color:var(--color-primary);cursor:pointer;">
            Accion
          </button>
        </template>
      </Card>
    `,
  }),
}

export const Variantes: Story = {
  render: () => ({
    components: { Card },
    template: `
      <div style="display:flex; gap:1rem; flex-wrap:wrap;">
        <Card variant="elevated" style="width: 14rem;">Elevated</Card>
        <Card variant="outlined" style="width: 14rem;">Outlined</Card>
        <Card variant="flat" style="width: 14rem;">Flat</Card>
      </div>
    `,
  }),
}
