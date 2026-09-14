import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PromoSlider from './PromoSlider.vue'
import PromoSliderSlide from './PromoSliderSlide.vue'

const IMAGES = [
  { src: 'https://picsum.photos/seed/promo1/1200/400', alt: 'Promoción de casino 1', href: '/casino/' },
  { src: 'https://picsum.photos/seed/promo2/1200/400', alt: 'Promoción de casino 2', href: '/casino/' },
  { src: 'https://picsum.photos/seed/promo3/1200/400', alt: 'Promoción de casino 3' },
]

const meta = {
  title: 'Components/PromoSlider',
  component: PromoSlider,
  tags: ['autodocs', 'media'],
  argTypes: {
    showArrows: { control: 'boolean' },
    showDots: { control: 'boolean' },
    autoplay: { control: 'boolean' },
    autoplayInterval: { control: 'number' },
  },
  args: {
    showArrows: true,
    showDots: true,
    autoplay: true,
    autoplayInterval: 6000,
  },
} satisfies Meta<typeof PromoSlider>

export default meta
type Story = StoryObj<typeof meta>

export const SoloImagenes: Story = {
  name: '1) Solo imágenes',
  args: { images: IMAGES },
  render: (args) => ({
    components: { PromoSlider },
    setup: () => ({ args }),
    template: `<div style="max-width: 48rem;"><PromoSlider v-bind="args" /></div>`,
  }),
}

const SLIDE_OVERLAY_STYLE =
  'position:absolute; inset:0; display:flex; align-items:center; padding-left:7%; ' +
  'background:linear-gradient(90deg, rgba(5,6,15,.9) 0%, rgba(5,6,15,.55) 45%, rgba(5,6,15,0) 75%); color:#fff;'

export const Libre: Story = {
  name: '2) Contenido libre',
  render: (args) => ({
    components: { PromoSlider, PromoSliderSlide },
    setup: () => ({ args, images: IMAGES }),
    template: `
      <div style="max-width: 48rem;">
        <PromoSlider v-bind="args">
          <PromoSliderSlide v-for="(img, i) in images" :key="i" :label="'Promoción ' + (i + 1)">
            <img :src="img.src" :alt="img.alt" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:-1;" />
            <div style="${SLIDE_OVERLAY_STYLE}">
              <div style="max-width: 60%;">
                <p style="margin:0 0 6px; font-size:11px; letter-spacing:.08em; text-transform:uppercase; opacity:.8;">Casino</p>
                <p style="margin:0 0 14px; font-size:20px; font-weight:700;">Título de la promo {{ i + 1 }}</p>
                <a href="/casino/" style="display:inline-flex; padding:9px 14px; border-radius:7px; background:var(--color-primary); color:#fff; text-decoration:none; font-weight:700; font-size:13px;">Jugar ahora →</a>
              </div>
            </div>
          </PromoSliderSlide>
        </PromoSlider>
      </div>
    `,
  }),
}

export const SinFlechasNiDots: Story = {
  name: 'Sin flechas ni dots (solo autoplay)',
  args: { images: IMAGES, showArrows: false, showDots: false },
  render: (args) => ({
    components: { PromoSlider },
    setup: () => ({ args }),
    template: `<div style="max-width: 48rem;"><PromoSlider v-bind="args" /></div>`,
  }),
}

export const SinAutoplay: Story = {
  args: { images: IMAGES, autoplay: false },
  render: (args) => ({
    components: { PromoSlider },
    setup: () => ({ args }),
    template: `<div style="max-width: 48rem;"><PromoSlider v-bind="args" /></div>`,
  }),
}
