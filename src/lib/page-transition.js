export function navigateWithFade(url) {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      window.location.assign(url)
      return
    }
  
    document.documentElement.classList.add('is-page-exiting')
  
    window.setTimeout(() => {
      window.location.assign(url)
    }, 280)
  }
  
  export function bindFadeLinks(selector = 'a[href="/university/"]') {
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