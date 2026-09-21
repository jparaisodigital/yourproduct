import mobileHeroImage from '../assets/herosection.png'
import heroImage from '../assets/hero-client.jpg'

function escapeHtml(value = '') {
  const characters = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }

  return String(value).replace(
    /[&<>"']/g,
    (character) => characters[character],
  )
}

export function renderHero(homeConfig, siteConfig) {
  const { hero, trustPoints } = homeConfig

  const heroSlides =
    Array.isArray(hero.slides) && hero.slides.length > 0
      ? hero.slides
      : [
          {
            eyebrow: hero.eyebrow,
            title: hero.title,
            highlightedText: hero.highlightedText,
            description: hero.description,
          },
        ]

  const slideInterval =
    Number(hero.slideInterval) || 5000

  const trustPointItems = trustPoints
    .map(
      (item) => `
        <li
          class="flex shrink-0 items-center gap-3 whitespace-nowrap text-xs uppercase tracking-[0.14em] text-brand-muted"
        >
          <span
            class="size-1.5 shrink-0 rounded-full bg-brand-gold"
            aria-hidden="true"
          ></span>

          ${escapeHtml(item)}
        </li>
      `,
    )
    .join('')

    const heroSlideItems = heroSlides
    .map(
      (slide, index) => `
        <div
          x-cloak
          x-show="activeSlide === ${index}"
          x-transition:enter="transition duration-700 ease-out"
          x-transition:enter-start="translate-x-12 opacity-0"
          x-transition:enter-end="translate-x-0 opacity-100"
          x-transition:leave="transition duration-500 ease-in"
          x-transition:leave-start="translate-x-0 opacity-100"
          x-transition:leave-end="-translate-x-12 opacity-0"
          :aria-hidden="activeSlide !== ${index}"
          class="absolute inset-0 flex flex-col items-center"
        >
          <h1
            class="mx-auto max-w-3xl font-display text-5xl font-semibold leading-[0.92] tracking-[-0.035em] text-brand-cream sm:text-6xl lg:text-[4.4rem] xl:text-[4.8rem]"
          >
            ${escapeHtml(slide.title)}

            <span class="block italic text-brand-gold">
              ${escapeHtml(slide.highlightedText)}
            </span>
          </h1>

          <p
            class="mx-auto mt-6 max-w-xl text-base leading-7 text-brand-muted lg:text-[1.05rem]"
          >
            ${escapeHtml(slide.description)}
          </p>
        </div>
      `,
    )
    .join('')

  const heroSlideIndicators = heroSlides
    .map(
      (_, index) => `
        <button
          type="button"
          class="h-1.5 rounded-full transition-all duration-300"
          :class="
            activeSlide === ${index}
              ? 'w-8 bg-brand-gold'
              : 'w-2 bg-brand-border hover:bg-brand-gold/60'
          "
          aria-label="Show hero slide ${index + 1}"
          :aria-current="
            activeSlide === ${index}
              ? 'true'
              : 'false'
          "
          @click="goToSlide(${index})"
        ></button>
      `,
    )
    .join('')

  return `
    <section
      id="home"
      class="relative isolate overflow-hidden bg-brand-black"
      x-data="{
        activeSlide: 0,
        slideCount: ${heroSlides.length},
        slideInterval: ${slideInterval},
        timer: null,
        isPaused: false,

        init() {
          this.startAutoplay()
        },

        startAutoplay() {
          this.stopAutoplay()

          this.timer = window.setInterval(() => {
            if (!this.isPaused) {
              this.nextSlide()
            }
          }, this.slideInterval)
        },

        stopAutoplay() {
          if (this.timer) {
            window.clearInterval(this.timer)
            this.timer = null
          }
        },

        nextSlide() {
          this.activeSlide =
            (this.activeSlide + 1) % this.slideCount
        },

        previousSlide() {
          this.activeSlide =
            (
              this.activeSlide -
              1 +
              this.slideCount
            ) % this.slideCount
        },

        goToSlide(index) {
          this.activeSlide = index
          this.startAutoplay()
        },

        nextManually() {
          this.nextSlide()
          this.startAutoplay()
        },

        previousManually() {
          this.previousSlide()
          this.startAutoplay()
        },

        destroy() {
          this.stopAutoplay()
        }
      }"
    >
      <img
        src="${mobileHeroImage}"
        alt=""
        aria-hidden="true"
        class="pointer-events-none absolute -right-12 top-12 z-0 h-[440px] w-[340px] max-w-none select-none object-contain opacity-[0.07] sm:hidden"
      >

      <div
        class="pointer-events-none absolute -left-40 top-10 size-96 rounded-full bg-brand-gold/10 blur-3xl"
        aria-hidden="true"
      ></div>

      <div
        class="pointer-events-none absolute -right-40 bottom-0 size-96 rounded-full bg-brand-bronze/10 blur-3xl"
        aria-hidden="true"
      ></div>

      <div
        class="relative mx-auto w-[min(1120px,90%)] py-12 lg:py-12 xl:py-14"
      >
        <div class="relative z-10 mx-auto w-full max-w-4xl text-center">
          <div
            class="flex flex-wrap items-center justify-center gap-3"
            aria-label="Hero categories"
          >
            <p
              class="text-[0.68rem] font-semibold uppercase tracking-[0.25em] text-brand-gold sm:text-xs"
            >
              Premium Fragrance Collection
            </p>

            <span
              class="hidden h-px w-8 bg-brand-border sm:block"
              aria-hidden="true"
            ></span>

            <p
              class="text-[0.68rem] font-semibold uppercase tracking-[0.25em] text-brand-gold sm:text-xs"
            >
              6 Ways to Earn
            </p>
          </div>

          <div
            class="relative mt-6 min-h-[235px] sm:min-h-[230px] lg:min-h-[260px] xl:min-h-[275px]"
            aria-roledescription="carousel"
            aria-label="Your Product highlights"
          >
            ${heroSlideItems}
          </div>

          <div
            class="mt-3 flex flex-wrap items-center justify-center gap-3"
            aria-label="Hero carousel controls"
          >
            <button
              type="button"
              class="grid size-9 place-items-center rounded-full border border-brand-border text-brand-muted transition hover:border-brand-gold hover:text-brand-gold"
              aria-label="Previous hero slide"
              @click="previousManually()"
            >
              <svg
                class="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                aria-hidden="true"
              >
                <path
                  d="m14.5 6-6 6 6 6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>

            <div
              class="flex items-center gap-1.5"
              aria-label="Select hero slide"
            >
              ${heroSlideIndicators}
            </div>

            <button
              type="button"
              class="grid size-9 place-items-center rounded-full border border-brand-border text-brand-muted transition hover:border-brand-gold hover:text-brand-gold"
              aria-label="Next hero slide"
              @click="nextManually()"
            >
              <svg
                class="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                aria-hidden="true"
              >
                <path
                  d="m9.5 6 6 6-6 6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>

            <span
              class="ml-1 text-[0.65rem] font-semibold tracking-[0.15em] text-brand-muted"
              x-text="
                String(activeSlide + 1).padStart(2, '0') +
                ' / ' +
                String(slideCount).padStart(2, '0')
              "
            ></span>
          </div>

          <div class="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="${escapeHtml(hero.primaryAction.href)}"
              class="inline-flex items-center justify-center rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-black transition duration-300 hover:-translate-y-1 hover:bg-brand-gold-light"
            >
              ${escapeHtml(hero.primaryAction.label)}
            </a>

            <a
              href="${escapeHtml(hero.secondaryAction.href)}"
              class="inline-flex items-center justify-center rounded-full border border-brand-border px-6 py-3 text-sm font-semibold text-brand-cream transition duration-300 hover:border-brand-gold hover:text-brand-gold"
            >
              ${escapeHtml(hero.secondaryAction.label)}
            </a>
          </div>

          <div
            class="hero-trust-marquee mt-9 overflow-hidden border-t border-brand-border pt-6"
            aria-label="${escapeHtml(trustPoints.join(', '))}"
          >
            <div class="hero-trust-marquee-track">
              <ul class="hero-trust-marquee-group">
                ${trustPointItems}
              </ul>

              <ul
                class="hero-trust-marquee-group"
                aria-hidden="true"
              >
                        ${trustPointItems}
              </ul>
            </div>
          </div>
        </div>

        <!--
        <figure
          class="relative mx-auto w-full max-w-[430px] lg:mr-0 lg:max-w-[390px] xl:max-w-[420px]"
        >
          <div
            class="absolute -inset-3 border border-brand-gold/20"
            aria-hidden="true"
          ></div>

          <div
            class="relative overflow-hidden border border-brand-border bg-brand-charcoal shadow-panel"
          >
            <span
              class="hero-product-shadow absolute bottom-[8%] left-1/2 h-8 w-[45%] rounded-full bg-brand-gold/20 blur-xl"
              aria-hidden="true"
            ></span>

            <img
              src="${heroImage}"
              alt="${escapeHtml(siteConfig.brand.name)} campaign"
              class="hero-floating-product relative z-10 block h-auto max-h-[610px] w-full object-contain"
              fetchpriority="high"
            >
          </div>
        </figure>
        -->

      </div>
    </section>
  `
}