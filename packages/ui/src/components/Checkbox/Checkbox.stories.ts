import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import Checkbox from './Checkbox.vue'
import CheckboxGroup from '../CheckboxGroup/CheckboxGroup.vue'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs', 'forms'],
  argTypes: {
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
  args: { label: 'Acepto los términos y condiciones' },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args, value: ref(false) }),
    template: `<Checkbox v-bind="args" v-model="value" />`,
  }),
}

export const Marcado: Story = {
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args, value: ref(true) }),
    template: `<Checkbox v-bind="args" v-model="value" />`,
  }),
}

export const ConAyuda: Story = {
  name: 'Con texto de ayuda',
  args: { label: 'Recibir novedades', hint: 'Máximo una vez por semana' },
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args, value: ref(true) }),
    template: `<Checkbox v-bind="args" v-model="value" />`,
  }),
}

export const Deshabilitado: Story = {
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; flex-direction:column; gap:0.75rem;">
        <Checkbox v-bind="args" :model-value="false" disabled />
        <Checkbox v-bind="args" :model-value="true" disabled />
      </div>`,
  }),
}

export const SeleccionarTodo: Story = {
  name: 'Estado mixto (seleccionar todo)',
  render: () => ({
    components: { Checkbox, CheckboxGroup },
    setup: () => {
      const all = ['pb', 'mm', 'em']
      const selected = ref<string[]>(['pb'])
      const options = [
        { value: 'pb', label: 'Powerball' },
        { value: 'mm', label: 'Mega Millions' },
        { value: 'em', label: 'EuroMillions' },
      ]
      const toggleAll = (checked: boolean | unknown[]) => {
        selected.value = checked ? [...all] : []
      }
      return { selected, options, all, toggleAll }
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:0.75rem;">
        <Checkbox
          label="Todas las loterías"
          :model-value="selected.length === all.length"
          :indeterminate="selected.length > 0 && selected.length < all.length"
          @update:model-value="toggleAll"
        />
        <div style="padding-left: 1.75rem;">
          <CheckboxGroup v-model="selected" :options="options" />
        </div>
      </div>`,
  }),
}

export const Grupo: Story = {
  name: 'CheckboxGroup',
  render: () => ({
    components: { CheckboxGroup },
    setup: () => ({
      selected: ref(['mm']),
      options: [
        { value: 'pb', label: 'Powerball', hint: 'Miércoles y sábado' },
        { value: 'mm', label: 'Mega Millions', hint: 'Martes y viernes' },
        { value: 'em', label: 'EuroMillions (próximamente)', disabled: true },
      ],
    }),
    template: `<CheckboxGroup v-model="selected" :options="options" legend="Loterías" hint="Elegí las que quieras seguir" />`,
  }),
}

export const GrupoHorizontal: Story = {
  name: 'CheckboxGroup horizontal con error',
  render: () => ({
    components: { CheckboxGroup },
    setup: () => ({
      selected: ref<string[]>([]),
      options: [
        { value: 'a', label: 'Lunes' },
        { value: 'b', label: 'Martes' },
        { value: 'c', label: 'Miércoles' },
      ],
    }),
    template: `<CheckboxGroup v-model="selected" :options="options" legend="Días" orientation="horizontal" error="Elegí al menos un día" />`,
  }),
}
