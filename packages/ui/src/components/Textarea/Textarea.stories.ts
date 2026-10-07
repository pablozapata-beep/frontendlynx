import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import Textarea from './Textarea.vue'

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs', 'forms'],
  argTypes: {
    rows: { control: 'number' },
    maxlength: { control: 'number' },
    resize: { control: 'select', options: ['none', 'vertical'] },
    disabled: { control: 'boolean' },
    showCount: { control: 'boolean' },
  },
  args: { label: 'Mensaje', placeholder: 'Escribí tu mensaje', rows: 4 },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

const render: Story['render'] = (args) => ({
  components: { Textarea },
  setup: () => ({ args, value: ref('') }),
  template: `<div style="max-width: 24rem;"><Textarea v-bind="args" v-model="value" /></div>`,
})

export const Default: Story = { render }

export const ConContador: Story = {
  name: 'Con contador y límite',
  args: { showCount: true, maxlength: 140, hint: 'Máximo 140 caracteres' },
  render,
}

export const ConError: Story = {
  name: 'Con error',
  args: { error: 'El mensaje es obligatorio' },
  render,
}

export const Deshabilitado: Story = { args: { disabled: true }, render }
