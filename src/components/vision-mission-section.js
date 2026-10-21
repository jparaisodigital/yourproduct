import mindsetImage from '../assets/mindset.webp'
import modernImage from '../assets/modern.webp'
import productBlackImage from '../assets/product-black.webp'
import productGoldImage from '../assets/product-gold.webp'

export function renderVisionMissionSection() {
  return `
    <div
      x-data="{ previewImage: null, previewAlt: '' }"
      x-effect="document.body.style.overflow = previewImage ? 'hidden' : ''"
      @keydown.escape.window="previewImage = null"
    >
      <section
        id="vision-mission"
        class="relative overflow-hidden border-t border-brand-border bg-brand-charcoal py-14 sm:py-16 lg:py-16"
      >
        <div
          class="pointer-events-none absolute left-1/2 top-0 size-80 -translate-x-1/2 rounded-full bg-brand-gold/10 blur-3xl"
          aria-hidden="true"
        ></div>

        <div class="relative mx-auto w-[min(1120px,90%)]">
          <div class="mx-auto max-w-3xl text-center">
            <p class="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-brand-gold">
              Purpose and Direction
            </p>

            <h2 class="mt-3 font-display text-4xl leading-[1.05] text-brand-cream sm:text-5xl lg:text-[3.35rem]">
              Our Vision.
              <span class="italic text-brand-gold">Our Mission.</span>
            </h2>

            <p class="mx-auto mt-4 max-w-2xl text-sm leading-6 text-brand-muted sm:text-base">
              Building a fragrance experience around personal choice,
              community, and opportunities for growth.
            </p>
          </div>

          <div class="mt-8 grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
            <div class="grid gap-4">
              <article class="relative overflow-hidden rounded-[1.4rem] border border-brand-gold/30 bg-brand-black p-5 shadow-gold-soft sm:p-6">
                <span class="absolute right-5 top-3 font-display text-5xl leading-none text-brand-gold/10" aria-hidden="true">V</span>

                <div class="relative">
                  <p class="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-brand-gold">Our Vision</p>
                  <h3 class="mt-3 max-w-md font-display text-2xl leading-tight text-brand-cream">
                    Confidence through personal choice.
                  </h3>
                  <p class="mt-3 text-sm leading-6 text-brand-muted">
                    To create a community where people can discover
                    fragrances that reflect who they are while exploring
                    paths toward their personal goals.
                  </p>
                </div>
              </article>

              <article class="relative overflow-hidden rounded-[1.4rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6">
                <span class="absolute right-5 top-3 font-display text-5xl leading-none text-brand-gold/10" aria-hidden="true">M</span>

                <div class="relative">
                  <p class="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-brand-gold">Our Mission</p>
                  <h3 class="mt-3 max-w-md font-display text-2xl leading-tight text-brand-cream">
                    Fragrance and community together.
                  </h3>
                  <p class="mt-3 text-sm leading-6 text-brand-muted">
                    To provide distinctive perfume choices, accessible
                    packages, and a supportive experience for every
                    member.
                  </p>
                </div>
              </article>
            </div>

            <!-- Gallery -->
            <div class="grid h-[460px] grid-cols-2 grid-rows-[1fr_1fr_0.72fr] gap-3 sm:h-[500px] lg:h-[520px]">
              <figure
                class="group relative row-span-2 cursor-zoom-in overflow-hidden rounded-[1.4rem] border border-brand-border"
                role="button"
                tabindex="0"
                aria-label="Enlarge Your Product community mindset image"
                @click="
                  previewImage = '${mindsetImage}'
                  previewAlt = 'Your Product community mindset'
                "
                @keydown.enter.prevent="
                  previewImage = '${mindsetImage}'
                  previewAlt = 'Your Product community mindset'
                "
              >
                <img
                  src="${mindsetImage}"
                  alt="Your Product community mindset"
                  class="absolute inset-0 size-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" aria-hidden="true"></div>
              </figure>

              <figure
                class="group relative cursor-zoom-in overflow-hidden rounded-[1.4rem] border border-brand-border"
                role="button"
                tabindex="0"
                aria-label="Enlarge Modern Your Product experience image"
                @click="
                  previewImage = '${modernImage}'
                  previewAlt = 'Modern Your Product experience'
                "
                @keydown.enter.prevent="
                  previewImage = '${modernImage}'
                  previewAlt = 'Modern Your Product experience'
                "
              >
                <img
                  src="${modernImage}"
                  alt="Modern Your Product experience"
                  class="absolute inset-0 size-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" aria-hidden="true"></div>
              </figure>

              <figure
                class="group relative cursor-zoom-in overflow-hidden rounded-[1.4rem] border border-brand-border"
                role="button"
                tabindex="0"
                aria-label="Enlarge Your Product black fragrance presentation"
                @click="
                  previewImage = '${productBlackImage}'
                  previewAlt = 'Your Product black fragrance presentation'
                "
                @keydown.enter.prevent="
                  previewImage = '${productBlackImage}'
                  previewAlt = 'Your Product black fragrance presentation'
                "
              >
                <img
                  src="${productBlackImage}"
                  alt="Your Product black fragrance presentation"
                  class="absolute inset-0 size-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" aria-hidden="true"></div>
              </figure>

              <figure
                class="group relative col-span-2 cursor-zoom-in overflow-hidden rounded-[1.4rem] border border-brand-gold/30"
                role="button"
                tabindex="0"
                aria-label="Enlarge Your Product gold fragrance presentation"
                @click="
                  previewImage = '${productGoldImage}'
                  previewAlt = 'Your Product gold fragrance presentation'
                "
                @keydown.enter.prevent="
                  previewImage = '${productGoldImage}'
                  previewAlt = 'Your Product gold fragrance presentation'
                "
              >
                <img
                  src="${productGoldImage}"
                  alt="Your Product gold fragrance presentation"
                  class="absolute inset-0 size-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                >
                <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" aria-hidden="true"></div>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <!-- Full-screen image lightbox (labas na ng section) -->
      <div
        x-cloak
        x-show="previewImage"
        x-transition.opacity
        class="fixed inset-0 z-[9999] flex h-dvh w-screen items-center justify-center bg-black/90 p-4 sm:p-8"
        role="dialog"
        aria-modal="true"
        :aria-label="'Enlarged image: ' + previewAlt"
        @click.self="previewImage = null"
      >
        <div
          class="relative flex max-h-[90dvh] max-w-[92vw] items-center justify-center"
          @click.stop
        >
          <img
            :src="previewImage"
            :alt="previewAlt"
            class="block max-h-[90dvh] max-w-[92vw] rounded-2xl object-contain shadow-2xl"
          >

          <button
            type="button"
            class="absolute right-3 top-3 z-20 grid size-10 place-items-center rounded-full border border-white/25 bg-black/70 text-white backdrop-blur-sm transition hover:border-brand-gold hover:text-brand-gold"
            aria-label="Close image preview"
            @click="previewImage = null"
          >
            <svg
              class="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6 6 18" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `
}