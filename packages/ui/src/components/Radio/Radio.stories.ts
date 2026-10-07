import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import Radio from './Radio.vue'
import RadioGroup from '../RadioGroup/RadioGroup.vue'

const meta = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs', 'forms'],
  args: { value: 'a', label: 'Opción A' },
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Suelto: Story = {
  name: 'Radio suelto (con v-model y name)',
  render: () => ({
    components: { Radio },
    setup: () => ({ value: ref('b') }),
    template: `
      <div style="display:flex; flex-direction:column; gap:0.75rem;">
        <Radio v-model="value" name="demo" value="a" label="Opción A" />
        <Radio v-model="value" name="demo" value="b" label="Opción B" />
        <Radio v-model="value" name="demo" value="c" label="Opción C (deshabilitada)" disabled />
      </div>`,
  }),
}

export const Grupo: Story = {
  name: 'RadioGroup con opciones',
  render: () => ({
    components: { RadioGroup },
    setup: () => ({
      value: ref('trim'),
      options: [
        { value: 'mes', label: '1 mes', hint: 'Sin permanencia' },
        { value: 'trim', label: '3 meses', hint: 'Ahorrás 10%' },
        { value: 'anio', label: '12 meses', hint: 'Ahorrás 25%' },
        { value: 'vip', label: 'Plan VIP (agotado)', disabled: true },
      ],
    }),
    template: `<RadioGroup v-model="value" :options="options" legend="Duración del plan" />
      <p style="font-family: var(--font-family-body); font-size: 12px;">Elegido: {{ value }}</p>`,
  }),
}

export const GrupoConSlot: Story = {
  name: 'RadioGroup con <Radio> en el slot',
  render: () => ({
    components: { RadioGroup, Radio },
    setup: () => ({ value: ref(2) }),
    template: `
      <RadioGroup v-model="value" legend="Cantidad de líneas" orientation="horizontal">
        <Radio :value="1" label="1" />
        <Radio :value="2" label="2" />
        <Radio :value="5" label="5" />
      </RadioGroup>`,
  }),
}

export const GrupoConError: Story = {
  name: 'RadioGroup con error',
  render: () => ({
    components: { RadioGroup },
    setup: () => ({
      value: ref(undefined),
      options: [
        { value: 'si', label: 'Sí' },
        { value: 'no', label: 'No' },
      ],
    }),
    template: `<RadioGroup v-model="value" :options="options" legend="¿Sos mayor de edad?" error="Seleccioná una opción" />`,
  }),
}
