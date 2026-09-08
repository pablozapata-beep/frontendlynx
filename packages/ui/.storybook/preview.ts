import type { Preview } from '@storybook/vue3-vite'
import '../../tokens/dist/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },

  globalTypes: {
    brand: {
      description: 'Marca activa',
      defaultValue: 'nwt',
      toolbar: {
        title: 'Marca',
        icon: 'paintbrush',
        items: [
          { value: 'nwt', title: 'NWT' },
          { value: 'ltk', title: 'LTK' },
          { value: 'qtz', title: 'QTZ' },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (story, context) => ({
      components: { story },
      setup: () => {
        // data-brand va en <body>, no en un div interno: los componentes con
        // Teleport (ej. Modal) mueven su contenido a ser hijo directo de <body>,
        // fuera de cualquier wrapper. Si el atributo estuviera solo en un div
        // interno, ese contenido teleportado quedaria fuera del scope
        // `[data-brand="..."]` y perderia todas las variables CSS de tokens.
        document.body.dataset.brand = context.globals.brand
      },
      template: `<div style="padding: 1.5rem"><story /></div>`,
    }),
  ],
}

export default preview
