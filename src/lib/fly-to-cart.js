function bounceCart(target) {
    target.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(1.16)' },
        { transform: 'scale(0.96)' },
        { transform: 'scale(1)' },
      ],
      {
        duration: 300,
        easing: 'ease-out',
      },
    )
  }
  
  export function flyToCart(sourceButton, imageSrc) {
    if (!sourceButton || !imageSrc) {
      return
    }
  
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
  
    if (reduceMotion) {
      return
    }
  
    // Find the cart button visible on the current screen.
    const target = Array.from(
      document.querySelectorAll('[data-cart-target]'),
    ).find((button) => {
      const rect = button.getBoundingClientRect()
  
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.top < window.innerHeight &&
        rect.right > 0 &&
        rect.left < window.innerWidth &&
        window.getComputedStyle(button).visibility !== 'hidden'
      )
    })
  
    if (!target || typeof target.animate !== 'function') {
      return
    }
  
    const sourceRect = sourceButton.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
  
    const size = 56
  
    const startX = sourceRect.left + sourceRect.width / 2
    const startY = sourceRect.top + sourceRect.height / 2
  
    const endX = targetRect.left + targetRect.width / 2
    const endY = targetRect.top + targetRect.height / 2
  
    const distanceX = endX - startX
    const distanceY = endY - startY
  
    const thumbnail = document.createElement('img')
  
    thumbnail.src = imageSrc
    thumbnail.alt = ''
    thumbnail.setAttribute('aria-hidden', 'true')
  
    Object.assign(thumbnail.style, {
      position: 'fixed',
      left: `${startX - size / 2}px`,
      top: `${startY - size / 2}px`,
      width: `${size}px`,
      height: `${size}px`,
      objectFit: 'contain',
      padding: '6px',
      boxSizing: 'border-box',
      borderRadius: '16px',
      border: '1px solid rgba(183, 138, 50, 0.4)',
      background: '#fffaf0',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)',
      pointerEvents: 'none',
      zIndex: '1000',
    })
  
    document.body.appendChild(thumbnail)
  
    const flight = thumbnail.animate(
        [
          {
            transform: 'translate(0, 0) scale(0.95)',
            opacity: 0.9,
            offset: 0,
            easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)',
          },
          {
            // Slowly lift the thumbnail before takeoff.
            transform: 'translate(0, -28px) scale(1.08)',
            opacity: 1,
            offset: 0.4,
            easing: 'cubic-bezier(0.55, 0, 0.8, 0.45)',
          },
          {
            // Accelerate toward the cart.
            transform: `
              translate(
                ${distanceX * 0.4}px,
                ${distanceY * 0.4 - 55}px
              )
              scale(0.8)
            `,
            opacity: 0.95,
            offset: 0.72,
            easing: 'cubic-bezier(0.15, 0.3, 0.3, 1)',
          },
          {
            transform: `
              translate(${distanceX}px, ${distanceY}px)
              scale(0.2)
            `,
            opacity: 0,
            offset: 1,
          },
        ],
        {
          duration: 1050,
          easing: 'linear',
          fill: 'forwards',
        },
      )
  
    flight.onfinish = () => {
      thumbnail.remove()
  
      if (target.isConnected) {
        bounceCart(target)
      }
    }
  
    flight.oncancel = () => {
      thumbnail.remove()
    }
  }