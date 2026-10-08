import loaderLogo from '../assets/logoyourproduct.webp'

export function renderSiteLoader() {
  return `
    <div
      id="site-loader"
      class="fixed inset-0 z-[9999] grid place-items-center bg-brand-black"
      role="status"
      aria-label="Loading website"
    >
      <div class="flex flex-col items-center">
        <div
          class="site-loader-logo relative grid size-32 place-items-center sm:size-36"
        >
          <span
            class="absolute inset-0 rounded-full border border-brand-gold/25"
            aria-hidden="true"
          ></span>

          <span
            class="site-loader-ring absolute inset-[-8px] rounded-full border border-transparent border-t-brand-gold"
            aria-hidden="true"
          ></span>

          <img
            src="${loaderLogo}"
            alt=""
            class="relative z-10 size-full rounded-full object-contain"
          >
        </div>

        <p
          class="mt-6 text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-brand-gold"
        >
          Loading
        </p>
      </div>
    </div>
  `
}

export function dismissSiteLoader() {
  const loader = document.querySelector('#site-loader')

  if (!loader) {
    return
  }

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches

  window.setTimeout(() => {
    if (
      reduceMotion ||
      typeof loader.animate !== 'function'
    ) {
      loader.remove()
      return
    }

    const fadeOut = loader.animate(
      [
        {
          opacity: 1,
          transform: 'scale(1)',
        },
        {
          opacity: 0,
          transform: 'scale(1.02)',
        },
      ],
      {
        duration: 450,
        easing: 'ease-out',
        fill: 'forwards',
      },
    )

    fadeOut.onfinish = () => {
      loader.remove()
    }

    fadeOut.oncancel = () => {
      loader.remove()
    }
  }, 900)
}
