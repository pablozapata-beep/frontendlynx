import type { Meta, StoryObj } from '@storybook/vue3-vite'
import StepList from './StepList.vue'
import type { StepItem } from './types'

const STEPS: StepItem[] = [
  { title: 'Elegí tu lotería favorita de Estados Unidos o Europa' },
  {
    title: 'Nuestros agentes autorizados compran y custodian tu boleto físico oficial',
    description: 'Con la misma validez que si lo compraras en persona.',
  },
  { title: 'Consultá tus números en "Mis Juegos" dentro de tu cuenta' },
  { title: 'Si ganás, te avisamos por correo y gestionamos tu cobro' },
]

const meta = {
  title: 'Components/StepList',
  component: StepList,
  tags: ['autodocs', 'display'],
  args: {
    steps: STEPS,
  },
} satisfies Meta<typeof StepList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { StepList },
    setup: () => ({ args }),
    template: `<div style="max-width: 36rem;"><StepList v-bind="args" /></div>`,
  }),
}

export const SinDescripciones: Story = {
  name: 'Solo títulos (sin descripción)',
  args: {
    steps: STEPS.map(({ title }) => ({ title })),
  },
  render: (args) => ({
    components: { StepList },
    setup: () => ({ args }),
    template: `<div style="max-width: 36rem;"><StepList v-bind="args" /></div>`,
  }),
}
