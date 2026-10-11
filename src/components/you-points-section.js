import androidPhoneImage from '../assets/rewards/android-phone.webp'
import carImage from '../assets/rewards/car.webp'
import iphoneImage from '../assets/rewards/iphone.webp'
import laptopImage from '../assets/rewards/laptop.webp'
import motorcyleImage from '../assets/rewards/motorcyle.webp'
import rewardJourneyImage from '../assets/rewards/reward-journey.webp'

const rewardImages = [
  {
    id: 'reward-journey',
    label: 'YOUR PRODUCT points reward journey',
    image: rewardJourneyImage,
  },
  {
    id: 'android-phone',
    label: 'Android phone reward',
    image: androidPhoneImage,
  },
  {
    id: 'laptop',
    label: 'Laptop reward',
    image: laptopImage,
  },
  {
    id: 'iphone',
    label: 'iPhone reward',
    image: iphoneImage,
  },
  {
    id: 'motorcyle',
    label: 'Motorcycle reward',
    image: motorcyleImage,
  },
  {
    id: 'car',
    label: 'Car reward',
    image: carImage,
  },
]

export function renderYouPointsSection() {
  const rewardCardsMarkup = rewardImages
    .map(
      (reward) => `
        <button
          type="button"
          class="group overflow-hidden rounded-2xl border border-brand-border bg-brand-panel p-1.5 shadow-panel transition hover:-translate-y-0.5 hover:border-brand-gold/60"
          @click="selectedYouPointsImage = {
            src: '${reward.image}',
            alt: '${reward.label}',
          }"
          aria-label="View ${reward.label}"
        >
          <img
            src="${reward.image}"
            alt="${reward.label}"
            class="mx-auto h-full max-h-[17rem] w-full rounded-xl object-contain transition duration-300 group-hover:scale-[1.015]"
            loading="lazy"
          >
        </button>
      `,
    )
    .join('')

  return `
    <section
      id="you-points"
      class="border-y border-brand-border bg-brand-dark px-5 py-14 sm:px-8 lg:px-12"
      x-data="{
        selectedYouPointsImage: null,
        closeYouPointsImage() {
          this.selectedYouPointsImage = null
        },
      }"
      @keydown.escape.window="closeYouPointsImage()"
    >
      <div class="mx-auto max-w-7xl">
        <div class="mx-auto max-w-3xl text-center">
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
            YOU POINTS
          </p>

          <h2 class="mt-4 font-display text-4xl text-brand-cream sm:text-5xl">
            Unlock Rewards Through Incentives
          </h2>

          <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-brand-muted sm:text-base">
            Earn points from qualified activities and use them toward premium reward incentives.
          </p>
        </div>

        <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          ${rewardCardsMarkup}
        </div>
      </div>

      <div
        x-show="selectedYouPointsImage"
        x-transition.opacity
        class="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4"
        @click.self="closeYouPointsImage()"
        aria-modal="true"
        role="dialog"
        aria-label="YOU POINTS reward preview"
      >
        <div class="relative max-h-[92vh] w-full max-w-4xl">
          <button
            type="button"
            class="absolute right-3 top-3 z-10 inline-flex size-10 items-center justify-center rounded-full border border-brand-gold/50 bg-brand-black/90 text-xl text-brand-gold transition hover:bg-brand-gold hover:text-[#17130d]"
            @click="closeYouPointsImage()"
            aria-label="Close reward preview"
          >
            ×
          </button>

          <img
            :src="selectedYouPointsImage?.src"
            :alt="selectedYouPointsImage?.alt"
            class="mx-auto max-h-[90vh] w-auto rounded-[1.5rem] border border-brand-border bg-brand-panel object-contain shadow-panel"
          >
        </div>
      </div>
    </section>
  `
}