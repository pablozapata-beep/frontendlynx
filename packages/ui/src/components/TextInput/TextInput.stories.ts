import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import TextInput from './TextInput.vue'
import SearchInput from '../SearchInput/SearchInput.vue'
import Textarea from '../Textarea/Textarea.vue'
import Select from '../Select/Select.vue'
import Checkbox from '../Checkbox/Checkbox.vue'
import RadioGroup from '../RadioGroup/RadioGroup.vue'
import Switch from '../Switch/Switch.vue'
import Button from '../Button/Button.vue'

const meta = {
  title: 'Components/TextInput',
  component: TextInput,
  tags: ['autodocs', 'forms'],
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password', 'search', 'tel', 'url', 'number'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    clearable: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Nombre completo',
    placeholder: 'Ej. Ana Pérez',
    size: 'md',
  },
} satisfies Meta<typeof TextInput>

export default meta
type Story = StoryObj<typeof meta>

const wrap = (inner: string) => `<div style="max-width: 22rem;">${inner}</div>`

export const Default: Story = {
  render: (args) => ({
    components: { TextInput },
    setup: () => ({ args, value: ref('') }),
    template: wrap(`<TextInput v-bind="args" v-model="value" />`),
  }),
}

export const ConAyuda: Story = {
  name: 'Con texto de ayuda y obligatorio',
  args: { label: 'Email', hint: 'Te enviaremos el comprobante a esta dirección', required: true, type: 'email' },
  render: (args) => ({
    components: { TextInput },
    setup: () => ({ args, value: ref('') }),
    template: wrap(`<TextInput v-bind="args" v-model="value" />`),
  }),
}

export const ConError: Story = {
  name: 'Con error',
  args: { label: 'Email', error: 'Ingresá un email válido' },
  render: (args) => ({
    components: { TextInput },
    setup: () => ({ args, value: ref('ana@') }),
    template: wrap(`<TextInput v-bind="args" v-model="value" />`),
  }),
}

export const Deshabilitado: Story = {
  args: { disabled: true },
  render: (args) => ({
    components: { TextInput },
    setup: () => ({ args, value: ref('No editable') }),
    template: wrap(`<TextInput v-bind="args" v-model="value" />`),
  }),
}

export const Limpiable: Story = {
  name: 'Con botón de limpiar',
  args: { clearable: true },
  render: (args) => ({
    components: { TextInput },
    setup: () => ({ args, value: ref('Texto para borrar') }),
    template: wrap(`<TextInput v-bind="args" v-model="value" />`),
  }),
}

export const Password: Story = {
  name: 'Contraseña (mostrar / ocultar)',
  args: { label: 'Contraseña', type: 'password' },
  render: (args) => ({
    components: { TextInput },
    setup: () => ({ args, value: ref('secreto123') }),
    template: wrap(`<TextInput v-bind="args" v-model="value" />`),
  }),
}

export const ConPrefijoYSufijo: Story = {
  name: 'Con prefijo y sufijo',
  args: { label: 'Monto', type: 'number' },
  render: (args) => ({
    components: { TextInput },
    setup: () => ({ args, value: ref(100) }),
    template: wrap(`
      <TextInput v-bind="args" v-model="value">
        <template #prefix>$</template>
        <template #suffix>USD</template>
      </TextInput>`),
  }),
}

export const Tamanos: Story = {
  name: 'Tamaños',
  render: () => ({
    components: { TextInput },
    setup: () => ({ a: ref(''), b: ref(''), c: ref('') }),
    template: wrap(`
      <div style="display:flex; flex-direction:column; gap:1rem;">
        <TextInput v-model="a" size="sm" label="Pequeño" placeholder="sm" />
        <TextInput v-model="b" size="md" label="Mediano" placeholder="md" />
        <TextInput v-model="c" size="lg" label="Grande" placeholder="lg" />
      </div>`),
  }),
}

export const Buscador: Story = {
  name: 'SearchInput',
  render: () => ({
    components: { SearchInput },
    setup: () => ({ q: ref('') }),
    template: wrap(`
      <SearchInput v-model="q" placeholder="Buscar juego o lotería" />
      <p style="font-family: var(--font-family-body); font-size: 12px;">Valor: {{ q }}</p>`),
  }),
}

export const FormularioCompleto: Story = {
  name: 'Formulario completo (todos los campos)',
  render: () => ({
    components: { TextInput, Textarea, Select, Checkbox, RadioGroup, Switch, Button },
    setup: () => ({
      form: ref({
        name: '',
        email: '',
        country: '',
        plan: 'mes',
        message: '',
        terms: false,
        news: true,
      }),
      countries: [
        { value: 'ar', label: 'Argentina' },
        { value: 'es', label: 'España' },
        { value: 'us', label: 'Estados Unidos' },
      ],
      plans: [
        { value: 'mes', label: '1 mes', hint: 'Sin permanencia' },
        { value: 'trim', label: '3 meses', hint: 'Ahorrás 10%' },
        { value: 'anio', label: '12 meses', hint: 'Ahorrás 25%' },
      ],
    }),
    template: `
      <form style="max-width: 26rem; display:flex; flex-direction:column; gap:1.1rem;" @submit.prevent>
        <TextInput v-model="form.name" label="Nombre completo" required />
        <TextInput v-model="form.email" label="Email" type="email" hint="No compartimos tu email" />
        <Select v-model="form.country" label="País" :options="countries" placeholder="Elegí un país" />
        <RadioGroup v-model="form.plan" legend="Plan" :options="plans" />
        <Textarea v-model="form.message" label="Mensaje" :maxlength="200" show-count />
        <Checkbox v-model="form.terms" label="Acepto los términos y condiciones" />
        <Switch v-model="form.news" label="Recibir novedades" hint="Máximo una vez por semana" />
        <Button variant="primary">Enviar</Button>
      </form>`,
  }),
}
