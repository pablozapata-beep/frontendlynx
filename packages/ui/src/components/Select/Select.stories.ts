import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import Select from './Select.vue'

const options = [
  { value: 'ar', label: 'Argentina' },
  { value: 'es', label: 'España' },
  { value: 'us', label: 'Estados Unidos' },
  { value: 'uy', label: 'Uruguay (no disponible)', disabled: true },
]

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs', 'forms'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
  args: { label: 'País', options, placeholder: 'Elegí un país' },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const render: Story['render'] = (args) => ({
  components: { Select },
  setup: () => ({ args, value: ref(args.modelValue ?? '') }),
  template: `<div style="max-width: 22rem;"><Select v-bind="args" v-model="value" /></div>`,
})

export const Default: Story = { render }

export const ConValor: Story = { name: 'Con valor elegido', args: { modelValue: 'es' }, render }

export const ConError: Story = { name: 'Con error', args: { error: 'Elegí un país' }, render }

export const Deshabilitado: Story = { args: { disabled: true, modelValue: 'ar' }, render }
