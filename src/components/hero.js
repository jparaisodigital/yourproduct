import heroBackgroundImage from '../assets/herosection.webp'

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
    (character) =>
      characters[character],
  )
}

export function renderHero(
  homeConfig,
  siteConfig,
) {
  const { hero, trustPoints } =
    homeConfig

  const heroSlides =
    Array.isArray(hero.slides) &&
    hero.slides.length > 0
      ? hero.slides
      : [
          {
            eyebrow: hero.eyebrow,
            title: hero.title,
            highlightedText:
              hero.highlightedText,
            description:
              hero.description,
          },
        ]

  const slideInterval =
    Number(hero.slideInterval) ||
    5000

  const trustPointItems =
    trustPoints
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

  const heroSlideItems =
    heroSlides
      .map(
        (slide, index) => `
          <div
            x-cloak
            x-show="activeSlide === ${index}"
            x-transition:enter="transition duration-700 ease-out"
            x-transition:enter-start="translate-x-8 opacity-0"
            x-transition:enter-end="translate-x-0 opacity-100"
            x-transition:leave="transition duration-500 ease-in"
            x-transition:leave-start="translate-x-0 opacity-100"
            x-transition:leave-end="-translate-x-8 opacity-0"
            :aria-hidden="
              activeSlide !== ${index}
            "
            class="absolute inset-0 flex flex-col items-start justify-center text-left"
          >
            <h1
              class="max-w-2xl font-display text-5xl font-semibold leading-[0.92] tracking-[-0.035em] text-brand-cream sm:text-6xl lg:text-[4rem] xl:text-[4.5rem]"
            >
              ${escapeHtml(
                slide.title,
              )}

              <span
                class="block italic text-brand-gold"
              >
                ${escapeHtml(
                  slide.highlightedText,
                )}
              </span>
            </h1>

            <p
              class="mt-5 max-w-xl text-sm leading-7 text-brand-muted sm:text-base lg:text-[1.02rem]"
            >
              ${escapeHtml(
                slide.description,
              )}
            </p>
          </div>
        `,
      )
      .join('')

  const heroSlideIndicators =
    heroSlides
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
      class="relative isolate min-h-[680px] overflow-hidden bg-brand-black lg:min-h-[calc(100svh-5.75rem)]"
      x-data="{
        activeSlide: 0,
        slideCount: ${heroSlides.length},
        slideInterval: ${slideInterval},
        timer: null,

        init() {
          this.startAutoplay()
        },

        startAutoplay() {
          this.stopAutoplay()

          if (this.slideCount <= 1) {
            return
          }

          this.timer =
            window.setInterval(() => {
              this.nextSlide()
            }, this.slideInterval)
        },

        stopAutoplay() {
          if (!this.timer) {
            return
          }

          window.clearInterval(
            this.timer,
          )

          this.timer = null
        },

        nextSlide() {
          if (this.slideCount <= 1) {
            return
          }

          this.activeSlide =
            (
              this.activeSlide + 1
            ) % this.slideCount
        },

        previousSlide() {
          if (this.slideCount <= 1) {
            return
          }

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
        src="${heroBackgroundImage}"
        alt=""
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 z-0 size-full max-w-none select-none object-cover object-[86%_center] opacity-45 sm:object-[84%_center] sm:opacity-60 lg:object-center lg:opacity-100"
        fetchpriority="high"
      >

      <div
        class="pointer-events-none absolute inset-0 z-[1] bg-black/50 sm:bg-black/40 lg:hidden"
        aria-hidden="true"
      ></div>

      <div
        class="pointer-events-none absolute inset-0 z-[1] hidden bg-gradient-to-r from-[#080603] via-[#080603]/90 via-45% to-transparent lg:block"
        aria-hidden="true"
      ></div>

      <div
        class="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/10 via-transparent to-black/45"
        aria-hidden="true"
      ></div>

      <div
        class="relative z-10 mx-auto flex min-h-[680px] w-[min(1120px,90%)] items-center py-10 sm:py-12 lg:min-h-[calc(100svh-5.75rem)] lg:py-8"
      >
        <div
          class="w-full max-w-[650px]"
        >
          <div
            class="flex flex-wrap items-center justify-start gap-3"
            aria-label="Hero categories"
          >
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-brand-gold sm:text-xs"
            >
              Premium Fragrance Collection
            </p>

            <span
              class="hidden h-px w-8 bg-brand-border sm:block"
              aria-hidden="true"
            ></span>

            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-brand-gold sm:text-xs"
            >
              6 Ways to Earn
            </p>
          </div>

          <div
            class="relative mt-5 min-h-[240px] sm:min-h-[250px] lg:min-h-[235px] xl:min-h-[250px]"
            aria-roledescription="carousel"
            aria-label="Your Product highlights"
          >
            ${heroSlideItems}
          </div>

          <div
            class="mt-2 flex flex-wrap items-center justify-start gap-3"
            aria-label="Hero carousel controls"
          >
            <button
              type="button"
              class="grid size-9 place-items-center rounded-full border border-brand-border bg-brand-black/30 text-brand-muted backdrop-blur-sm transition hover:border-brand-gold hover:text-brand-gold"
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
              class="grid size-9 place-items-center rounded-full border border-brand-border bg-brand-black/30 text-brand-muted backdrop-blur-sm transition hover:border-brand-gold hover:text-brand-gold"
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
                String(
                  activeSlide + 1
                ).padStart(2, '0') +
                ' / ' +
                String(
                  slideCount
                ).padStart(2, '0')
              "
            ></span>
          </div>

          <div
            class="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          >
            <a
              href="${escapeHtml(
                hero.primaryAction.href,
              )}"
              class="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-black shadow-[0_12px_32px_rgb(183_138_50_/_0.22)] transition duration-300 hover:-translate-y-1 hover:bg-brand-gold-light"
            >
              ${escapeHtml(
                hero.primaryAction.label,
              )}
            </a>

            <a
              href="#packages"
              class="inline-flex min-h-12 items-center justify-center rounded-full border border-brand-border bg-brand-black/25 px-6 py-3 text-sm font-semibold text-brand-cream backdrop-blur-sm transition duration-300 hover:border-brand-gold hover:text-brand-gold"
            >
              View Membership Packages
            </a>
          </div>

          <div
            class="hero-trust-marquee mt-6 max-w-2xl overflow-hidden border-t border-brand-border pt-5"
            aria-label="${escapeHtml(
              trustPoints.join(', '),
            )}"
          >
            <div
              class="hero-trust-marquee-track"
            >
              <ul
                class="hero-trust-marquee-group"
              >
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
      </div>
    </section>
  `
}
