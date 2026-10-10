import loaderLogo from '../assets/logoyourproduct.webp'

function showPageTransitionLoader() {
  if (document.querySelector('#page-transition-loader')) {
    return
  }

  const loader = document.createElement('div')

  loader.id = 'page-transition-loader'
  loader.className =
    'fixed inset-0 z-[9999] grid place-items-center bg-brand-black opacity-0 transition-opacity duration-200'

  loader.setAttribute('role', 'status')
  loader.setAttribute('aria-label', 'Loading page')

  loader.innerHTML = `
    <div class="flex flex-col items-center">
      <div class="site-loader-logo relative grid size-32 place-items-center sm:size-36">
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

      <p class="mt-6 text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-brand-gold">
        Loading
      </p>
    </div>
  `

  document.body.appendChild(loader)

  window.requestAnimationFrame(() => {
    loader.classList.remove('opacity-0')
    loader.classList.add('opacity-100')
  })
}

export function navigateWithFade(url) {
  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    window.location.assign(url)
    return
  }

  showPageTransitionLoader()

  window.setTimeout(() => {
    window.location.assign(url)
  }, 900)
}

export function bindFadeLinks(
  selector = [
    'a[href="/university/"]',
    'a[href="/videos/"]',
    'a[href="/login/"]',
    'a[href="/register/"]',
    'a[href="/checkout/"]',
    'a[href="/dashboard/"]',
  ].join(', '),
) {
  document.querySelectorAll(selector).forEach((link) => {
    link.addEventListener('click', (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      event.preventDefault()
      navigateWithFade(link.href)
    })
  })
}