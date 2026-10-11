import sixWaysOneImage from '../assets/6ways/1.jpg'
import sixWaysTwoImage from '../assets/6ways/2.jpg'
import sixWaysThreeImage from '../assets/6ways/3.jpg'

const sixWaysImages = [
  {
    id: 'six-ways-one',
    label: 'YOUR PRODUCT six ways opportunity guide',
    image: sixWaysOneImage,
    className: '',
  },
  {
    id: 'six-ways-three',
    label: 'YOUR PRODUCT mobile incentives guide',
    image: sixWaysThreeImage,
    className: 'lg:hidden',
  },
  {
    id: 'six-ways-two',
    label: 'YOUR PRODUCT incentives guide',
    image: sixWaysTwoImage,
    className: '',
  },
]

export function renderSixWaysSection() {
  const imageCardsMarkup = sixWaysImages
    .map(
      (item) => `
        <button
          type="button"
          class="${item.className} group overflow-hidden border border-brand-border bg-brand-panel shadow-panel transition hover:border-brand-gold/60"
          @click="selectedSixWaysImage = {
            src: '${item.image}',
            alt: '${item.label}',
          }"
          aria-label="View ${item.label}"
        >
          <img
            src="${item.image}"
            alt="${item.label}"
            class="h-auto w-full object-contain transition duration-300 group-hover:scale-[1.01]"
            loading="lazy"
          >
        </button>
      `,
    )
    .join('')

  return `
    <section
      id="six-ways"
      class="bg-brand-dark px-0 py-10 sm:py-12"
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

      <div
        x-show="selectedSixWaysImage"
        x-transition.opacity
        class="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4"
        @click.self="closeSixWaysImage()"
        aria-modal="true"
        role="dialog"
        aria-label="Six ways image preview"
      >
        <div class="relative max-h-[92vh] w-full max-w-5xl">
          <button
            type="button"
            class="absolute right-3 top-3 z-10 inline-flex size-10 items-center justify-center rounded-full border border-brand-gold/50 bg-brand-black/90 text-xl text-brand-gold transition hover:bg-brand-gold hover:text-[#17130d]"
            @click="closeSixWaysImage()"
            aria-label="Close image preview"
          >
            ×
          </button>

          <img
            :src="selectedSixWaysImage?.src"
            :alt="selectedSixWaysImage?.alt"
            class="mx-auto max-h-[90vh] w-auto rounded-[1.5rem] border border-brand-border bg-brand-panel object-contain shadow-panel"
          >
        </div>
      </div>
    </section>
  `
}