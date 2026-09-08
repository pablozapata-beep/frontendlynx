import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import Modal from './Modal.vue'

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs', 'overlay'],
  args: {
    open: false,
  },
  // Modal usa Teleport a `body` + position:fixed cubriendo todo el viewport. La
  // pagina de Docs de Storybook monta todas las stories del archivo juntas en el
  // mismo documento, asi que las stories que abren el modal por defecto quedarian
  // superpuestas entre si. `inline: false` renderiza cada story de Docs en su
  // propio iframe (su propio `body`), aislado del resto.
  parameters: {
    docs: { story: { inline: false, iframeHeight: 450 } },
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Modal },
    setup: () => ({ open: ref(false) }),
    template: `
      <div>
        <button @click="open = true">Abrir modal</button>
        <Modal :open="open" @close="open = false">
          <template #header><h3 style="margin:0;">Titulo del modal</h3></template>
          Contenido del modal. Presiona Escape, clickea afuera, o el boton de cerrar.
          <template #footer>
            <button @click="open = false">Cerrar</button>
          </template>
        </Modal>
      </div>
    `,
  }),
}

export const BottomSheetOnMobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    components: { Modal },
    setup: () => ({ open: ref(true) }),
    template: `
      <Modal :open="open" @close="open = false">
        <template #header><h3 style="margin:0;">Titulo</h3></template>
        En mobile este modal se comporta como bottom sheet (se abre desde abajo).
      </Modal>
    `,
  }),
}

export const WithFooterActions: Story = {
  render: () => ({
    components: { Modal },
    setup: () => ({ open: ref(true) }),
    template: `
      <Modal :open="open" @close="open = false">
        <template #header><h3 style="margin:0;">Confirmar accion</h3></template>
        Esto no se puede deshacer.
        <template #footer>
          <div style="display:flex; gap:0.5rem; justify-content:flex-end;">
            <button @click="open = false">Cancelar</button>
            <button @click="open = false">Confirmar</button>
          </div>
        </template>
      </Modal>
    `,
  }),
}
