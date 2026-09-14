export function initScrollReveal() {
    const sections = document.querySelectorAll(
      'main > section:not(#home)',
    )
  
    const revealTargets = []
  
    sections.forEach((section) => {
      const sectionContent =
        section.querySelector(
          ':scope > div[class*="mx-auto"]',
        ) || section
  
      sectionContent.classList.add('scroll-reveal')
      revealTargets.push(sectionContent)
  
      const sectionItems =
        sectionContent.querySelectorAll('article, figure')
  
      sectionItems.forEach((item, index) => {
        item.classList.add('scroll-reveal-item')
  
        const delay = 80 + (index % 4) * 70
  
        item.style.setProperty(
          '--reveal-delay',
          `${delay}ms`,
        )
  
        revealTargets.push(item)
      })
    })
  
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
  
    if (
      prefersReducedMotion ||
      !('IntersectionObserver' in window)
    ) {
      revealTargets.forEach((target) => {
        target.classList.add('is-visible')
      })
  
      return
    }
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }
  
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      },
    )
  
    revealTargets.forEach((target) => {
      observer.observe(target)
    })
  }