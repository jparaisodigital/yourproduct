const pesoFormatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  })

  function renderPackageCard(packageItem, index) {
    const priceMarkup =
      packageItem.price !== null
        ? `
            <div class="mt-4 sm:mt-5">
              <span
                class="text-[0.6rem] font-medium uppercase tracking-[0.12em] text-brand-muted sm:text-[0.65rem] sm:tracking-[0.16em]"
              >
                Package price
              </span>
  
              <p
                class="mt-1 font-display text-2xl leading-tight text-brand-gold sm:text-3xl"
              >
                ${pesoFormatter.format(packageItem.price)}
              </p>
            </div>
          `
        : `
            <div class="mt-4 sm:mt-5">
              <span
                class="text-[0.6rem] font-medium uppercase tracking-[0.12em] text-brand-muted sm:text-[0.65rem] sm:tracking-[0.16em]"
              >
                Package price
              </span>
  
              <p
                class="mt-1 font-display text-lg leading-tight text-brand-gold sm:text-xl"
              >
                Details coming soon
              </p>
            </div>
          `
  
    const inclusionsMarkup =
      packageItem.inclusions.length > 0
        ? `
            <ul class="mt-3 space-y-1.5 sm:mt-4 sm:space-y-2">
              ${packageItem.inclusions
                .map(
                  (inclusion) => `
                    <li
                      class="flex gap-2 text-xs leading-5 text-brand-muted sm:gap-2.5 sm:text-sm"
                    >
                      <span
                        class="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-gold"
                        aria-hidden="true"
                      ></span>
  
                      <span>
                        ${inclusion}
                      </span>
                    </li>
                  `,
                )
                .join('')}
            </ul>
          `
        : `
            <div
              class="mt-3 rounded-xl border border-brand-border bg-brand-black/40 p-3 sm:mt-4 sm:p-3.5"
            >
              <p class="text-xs leading-5 text-brand-muted">
                Official inclusions will be added after final client
                confirmation.
              </p>
            </div>
          `
  
    const featuredLabel = packageItem.isFeatured
      ? `
          <span
            class="absolute right-5 top-5 inline-flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-brand-gold"
          >
            <span
              class="size-1.5 rounded-full bg-brand-gold"
              aria-hidden="true"
            ></span>
  
            Featured
          </span>
        `
      : ''
  
    const cardClass = packageItem.isFeatured
      ? 'border-brand-gold/60 bg-brand-panel shadow-gold-soft'
      : 'border-brand-border bg-brand-panel shadow-panel'
  
    const buttonClass = packageItem.isFeatured
      ? 'bg-brand-gold text-[#17130d] hover:bg-brand-gold-light'
      : 'border border-brand-border text-brand-cream hover:border-brand-gold hover:bg-brand-gold/5 hover:text-brand-gold'
  
    return `
      <article
        class="${cardClass} package-scroll-card group relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border p-5 transition duration-300 hover:-translate-y-1 hover:border-brand-gold/60 sm:p-6"
        data-package-card
        data-package-index="${index}"
      >
        <div
          class="pointer-events-none absolute -right-16 -top-16 size-36 rounded-full bg-brand-gold/10 blur-3xl"
          aria-hidden="true"
        ></div>
  
        ${featuredLabel}
  
        <div class="relative flex h-full flex-col">
          <span
            class="font-display text-4xl leading-none text-brand-gold/15"
            aria-hidden="true"
          >
            ${String(index + 1).padStart(2, '0')}
          </span>
  
          <p
            class="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-gold sm:mt-4 sm:text-[0.68rem] sm:tracking-[0.22em]"
          >
            ${packageItem.shortLabel}
          </p>
  
          <h3
            class="mt-1.5 font-display text-2xl leading-tight text-brand-cream sm:mt-2"
          >
            ${packageItem.name}
          </h3>
  
          <p
            class="mt-2 text-xs leading-5 text-brand-muted sm:mt-3 sm:text-sm sm:leading-6 xl:min-h-[4.5rem]"
          >
            ${packageItem.description}
          </p>
  
          ${priceMarkup}
          ${inclusionsMarkup}
  
          <div class="mt-auto pt-4 sm:pt-5">
            <a
              href="#signup"
              class="${buttonClass} inline-flex h-10 w-full items-center justify-center rounded-xl px-4 text-[0.68rem] font-semibold uppercase tracking-[0.07em] transition duration-200 active:scale-[0.98] sm:h-11 sm:text-xs sm:tracking-[0.08em]"
            >
              Explore ${packageItem.shortLabel}
            </a>
          </div>
        </div>
      </article>
    `
  }
  
  export function renderPackagesSection(packages) {
    const activePackages = packages.filter(
      (packageItem) => packageItem.isActive,
    )
  
    const packageCards = activePackages
      .map((packageItem, index) =>
        renderPackageCard(packageItem, index),
      )
      .join('')
  
    const progressDots = activePackages
      .map(
        (_, index) => `
          <span
            class="package-scroll-dot ${
              index === 0 ? 'is-active' : ''
            }"
            data-package-dot="${index}"
            aria-hidden="true"
          ></span>
        `,
      )
      .join('')
  
    const stageHeight =
      100 + Math.max(activePackages.length - 1, 0) * 38
  
    return `
      <section
        id="packages"
        class="relative overflow-clip border-t border-brand-border bg-brand-black py-14 sm:py-16 lg:py-16"
      >
        <div
          class="pointer-events-none absolute -left-40 top-1/3 size-80 rounded-full bg-brand-gold/10 blur-3xl"
          aria-hidden="true"
        ></div>
  
        <div
          class="pointer-events-none absolute -right-40 bottom-0 size-80 rounded-full bg-brand-bronze/10 blur-3xl"
          aria-hidden="true"
        ></div>
  
        <div class="relative mx-auto w-[min(1240px,90%)]">
          <div
            class="grid gap-4 lg:grid-cols-[1fr_0.7fr] lg:items-end"
          >
            <div>
              <p
                class="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-brand-gold"
              >
                Explore Packages
              </p>
  
              <h2
                class="mt-3 max-w-2xl font-display text-4xl leading-[1.05] text-brand-cream sm:text-5xl lg:text-[3.35rem]"
              >
                Choose your
                <span class="italic text-brand-gold">
                  package.
                </span>
              </h2>
            </div>
  
            <p
              class="max-w-lg text-sm leading-6 text-brand-muted sm:text-base lg:justify-self-end"
            >
              Explore the four membership options and choose the package
              that best matches your goals.
            </p>
          </div>
  
          <div
            class="packages-scroll-stage mt-8"
            data-packages-scroll
            style="--package-stage-height: ${stageHeight}svh;"
          >
            <div class="packages-scroll-sticky">
              <div
                class="packages-scroll-viewport"
                data-packages-viewport
              >
                <div
                  class="packages-scroll-track"
                  data-packages-track
                >
                  ${packageCards}
                </div>
              </div>
  
              <div class="packages-scroll-controls">
                <p class="packages-scroll-instruction">
                  Scroll to explore packages
                </p>
  
                <div
                  class="packages-scroll-progress"
                  aria-hidden="true"
                >
                  ${progressDots}
                </div>
  
                <p
                  class="packages-scroll-counter"
                  data-package-counter
                  aria-live="polite"
                >
                  01 / ${String(activePackages.length).padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>
  
          <p
            class="mt-5 text-center text-xs leading-5 text-brand-muted"
          >
            Membership package details remain subject to final client
            confirmation.
          </p>
        </div>
      </section>
    `
  }
  
  function initializePackageScroll() {
    const stage = document.querySelector(
      '[data-packages-scroll]',
    )
  
    if (!stage || stage.dataset.scrollReady === 'true') {
      return
    }
  
    const viewport = stage.querySelector(
      '[data-packages-viewport]',
    )
  
    const track = stage.querySelector(
      '[data-packages-track]',
    )
  
    const cards = [
      ...stage.querySelectorAll('[data-package-card]'),
    ]
  
    const dots = [
      ...stage.querySelectorAll('[data-package-dot]'),
    ]
  
    const counter = stage.querySelector(
      '[data-package-counter]',
    )
  
    if (!viewport || !track || cards.length === 0) {
      return
    }
  
    stage.dataset.scrollReady = 'true'
  
    const mobileQuery = window.matchMedia(
      '(max-width: 639px)',
    )
  
    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )
  
    let frameRequested = false
    let currentIndex = -1
  
    function setActivePackage(index) {
      if (index === currentIndex) {
        return
      }
  
      currentIndex = index
  
      cards.forEach((card, cardIndex) => {
        card.classList.toggle(
          'is-active',
          cardIndex === currentIndex,
        )
      })
  
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle(
          'is-active',
          dotIndex === currentIndex,
        )
      })
  
      if (counter) {
        counter.textContent =
          `${String(currentIndex + 1).padStart(2, '0')} / ` +
          `${String(cards.length).padStart(2, '0')}`
      }
    }
  
    function updatePackageScroll() {
      frameRequested = false
  
      if (
        !mobileQuery.matches ||
        reducedMotionQuery.matches
      ) {
        track.style.removeProperty('transform')
        setActivePackage(0)
        return
      }
  
      const stageRect = stage.getBoundingClientRect()
  
      const scrollDistance = Math.max(
        stage.offsetHeight - window.innerHeight,
        1,
      )
  
      const progress = Math.min(
        Math.max(-stageRect.top / scrollDistance, 0),
        1,
      )
  
      const maximumTranslation = Math.max(
        track.scrollWidth - viewport.clientWidth,
        0,
      )
  
      track.style.transform = `translate3d(${
        -progress * maximumTranslation
      }px, 0, 0)`
  
      const activeIndex = Math.min(
        cards.length - 1,
        Math.round(progress * (cards.length - 1)),
      )
  
      setActivePackage(activeIndex)
    }
  
    function requestPackageUpdate() {
      if (frameRequested) {
        return
      }
  
      frameRequested = true
  
      window.requestAnimationFrame(
        updatePackageScroll,
      )
    }
  
    window.addEventListener(
      'scroll',
      requestPackageUpdate,
      { passive: true },
    )
  
    window.addEventListener(
      'resize',
      requestPackageUpdate,
      { passive: true },
    )
  
    mobileQuery.addEventListener(
      'change',
      requestPackageUpdate,
    )
  
    reducedMotionQuery.addEventListener(
      'change',
      requestPackageUpdate,
    )
  
    setActivePackage(0)
    requestPackageUpdate()
  }
  
  function schedulePackageScrollInitialization() {
    if (typeof document === 'undefined') {
      return
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener(
        'DOMContentLoaded',
        initializePackageScroll,
        { once: true },
      )
  
      return
    }
  
    window.requestAnimationFrame(
      initializePackageScroll,
    )
  }
  
  schedulePackageScrollInitialization()