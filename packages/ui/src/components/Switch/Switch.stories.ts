import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import Switch from './Switch.vue'

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs', 'forms'],
  argTypes: { disabled: { control: 'boolean' } },
  args: { label: 'Notificaciones' },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { Switch },
    setup: () => ({ args, value: ref(false) }),
    template: `<Switch v-bind="args" v-model="value" />`,
  }),
}

export const Activo: Story = {
  render: (args) => ({
    components: { Switch },
    setup: () => ({ args, value: ref(true) }),
    template: `<Switch v-bind="args" v-model="value" />`,
  }),
}

export const ConAyuda: Story = {
  name: 'Con texto de ayuda',
  args: { hint: 'Te avisamos cuando se abre un nuevo sorteo' },
  render: (args) => ({
    components: { Switch },
    setup: () => ({ args, value: ref(true) }),
    template: `<Switch v-bind="args" v-model="value" />`,
  }),
}

export const Deshabilitado: Story = {
  render: (args) => ({
    components: { Switch },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; flex-direction:column; gap:0.75rem;">
        <Switch v-bind="args" :model-value="false" disabled />
        <Switch v-bind="args" :model-value="true" disabled />
      </div>`,
  }),
}
