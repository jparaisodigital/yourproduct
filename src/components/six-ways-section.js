import sixWaysOneImage from '../assets/6ways/1.jpg'
import sixWaysTwoImage from '../assets/6ways/2.jpg'
import sixWaysThreeImage from '../assets/6ways/3.jpg'

const sixWaysImages = [
  {
    id: 'six-ways-one',
    label: 'YOUR PRODUCT six ways opportunity guide',
    image: sixWaysOneImage,
    width: 2048,
    height: 762,
    className: '',
  },
  {
    id: 'six-ways-three',
    label: 'YOUR PRODUCT mobile incentives guide',
    image: sixWaysThreeImage,
    width: 1024,
    height: 1536,
    className: 'lg:hidden',
  },
  {
    id: 'six-ways-two',
    label: 'YOUR PRODUCT incentives guide',
    image: sixWaysTwoImage,
    width: 1536,
    height: 1024,
    className: '',
  },
]

export function renderSixWaysSection() {
  const imageCardsMarkup = sixWaysImages
    .map(
      (item) => `
        <button
          type="button"
          class="${item.className} group overflow-hidden border border-brand-border bg-brand-panel transition hover:border-brand-gold/45 hover:bg-brand-charcoal"
          @click="selectedSixWaysImage = {
            src: '${item.image}',
            alt: '${item.label}',
          }"
          aria-label="View ${item.label}"
        >
          <img
  src="${item.image}"
  alt="${item.label}"
  width="${item.width}"
  height="${item.height}"
  class="h-auto w-full object-contain transition duration-300"
  loading="lazy"
>
        </button>
      `,
    )
    .join('')

  return `
    <section
      id="six-ways"
      class="bg-brand-black px-0 py-10 sm:py-12"
      x-data="{
        selectedSixWaysImage: null,
        closeSixWaysImage() {
          this.selectedSixWaysImage = null
        },
      }"
      @keydown.escape.window="closeSixWaysImage()"
    >
      <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div class="grid gap-0 overflow-hidden rounded-[1.5rem] border border-brand-border bg-brand-panel">
          ${imageCardsMarkup}
        </div>
      </div>

      <!-- Image Preview Modal -->
      <div
        x-show="selectedSixWaysImage"
        x-transition.opacity
        class="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4"
        @click.self="closeSixWaysImage()"
        aria-modal="true"
        role="dialog"
        aria-label="Six ways image preview"
      >
        <div class="relative inline-block max-h-[92vh] max-w-[92vw]">
          <button
            type="button"
            class="absolute right-3 top-3 z-10 inline-flex size-10 items-center justify-center rounded-full border border-brand-border bg-brand-black/90 text-xl text-brand-gold transition hover:border-brand-gold hover:text-brand-gold"
            @click="closeSixWaysImage()"
            aria-label="Close image preview"
          >
            ×
          </button>

          <img
            :src="selectedSixWaysImage?.src"
            :alt="selectedSixWaysImage?.alt"
            class="max-h-[90vh] max-w-[92vw] rounded-[1.5rem] border border-brand-border bg-brand-panel object-contain"
          >
        </div>
      </div>
    </section>
  `
}