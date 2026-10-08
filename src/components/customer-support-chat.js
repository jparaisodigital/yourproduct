import logoImage from '../assets/logoyourproduct.webp'

const SUPPORT_URL =
  'https://web.facebook.com/YourProduct2026'

const POSITION_STORAGE_KEY =
  'yp-customer-support-position'

const EDGE_GAP = 12
const DRAG_THRESHOLD = 6

function clamp(value, minimum, maximum) {
  return Math.min(
    Math.max(value, minimum),
    maximum,
  )
}

export function registerCustomerSupportChat(
  Alpine,
) {
  Alpine.data('customerSupportChat', () => ({
    x: null,
    y: null,

    dragging: false,
    dismissVisible: false,
    dismissTimer: null,
    hidden: false,
    moved: false,

    pointerId: null,

    startPointerX: 0,
    startPointerY: 0,

    startElementX: 0,
    startElementY: 0,

    init() {
      this.$nextTick(() => {
        const element = this.$refs.chatHead

        if (!element) {
          return
        }

        const defaultPosition =
          element.getBoundingClientRect()

        let savedPosition = null

        try {
          savedPosition = JSON.parse(
            localStorage.getItem(
              POSITION_STORAGE_KEY,
            ),
          )
        } catch {
          savedPosition = null
        }

        const savedX = Number(
          savedPosition?.x,
        )

        const savedY = Number(
          savedPosition?.y,
        )

        this.setPosition(
          Number.isFinite(savedX)
            ? savedX
            : defaultPosition.left,

          Number.isFinite(savedY)
            ? savedY
            : defaultPosition.top,
        )
      })
    },

    get positionStyle() {
      if (
        this.x === null ||
        this.y === null
      ) {
        return ''
      }

      return `
        left: ${this.x}px;
        top: ${this.y}px;
        right: auto;
        bottom: auto;
      `
    },

    setPosition(nextX, nextY) {
      const element = this.$refs.chatHead

      if (!element) {
        return
      }

      const elementBounds =
        element.getBoundingClientRect()

      const maximumX = Math.max(
        EDGE_GAP,
        window.innerWidth -
          elementBounds.width -
          EDGE_GAP,
      )

      const maximumY = Math.max(
        EDGE_GAP,
        window.innerHeight -
          elementBounds.height -
          EDGE_GAP,
      )

      this.x = clamp(
        Number(nextX) || EDGE_GAP,
        EDGE_GAP,
        maximumX,
      )

      this.y = clamp(
        Number(nextY) || EDGE_GAP,
        EDGE_GAP,
        maximumY,
      )
    },

    startDrag(event) {
      if (
        event.pointerType === 'mouse' &&
        event.button !== 0
      ) {
        return
      }

      const element = this.$refs.chatHead

      if (!element) {
        return
      }

      const elementBounds =
        element.getBoundingClientRect()

      this.dragging = true
      this.moved = false

      this.pointerId = event.pointerId

      this.startPointerX = event.clientX
      this.startPointerY = event.clientY

      this.startElementX =
        elementBounds.left

      this.startElementY =
        elementBounds.top

      element.setPointerCapture?.(
        event.pointerId,
      )
    },

    drag(event) {
      if (
        !this.dragging ||
        event.pointerId !== this.pointerId
      ) {
        return
      }

      const movementX =
        event.clientX -
        this.startPointerX

      const movementY =
        event.clientY -
        this.startPointerY

      const movementDistance = Math.hypot(
        movementX,
        movementY,
      )

      if (
        movementDistance >
        DRAG_THRESHOLD
      ) {
        this.moved = true
      }

      if (!this.moved) {
        return
      }

      this.setPosition(
        this.startElementX + movementX,
        this.startElementY + movementY,
      )
    },

    endDrag(event) {
      if (
        !this.dragging ||
        event.pointerId !== this.pointerId
      ) {
        return
      }

      const element = this.$refs.chatHead

      element?.releasePointerCapture?.(
        event.pointerId,
      )

      this.dragging = false
      this.pointerId = null

      if (this.moved) {
        this.savePosition()
      }
    },

    cancelDrag() {
      this.dragging = false
      this.moved = false
      this.pointerId = null
    },

    handleClick(event) {
      if (!this.moved) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      this.moved = false
    },

    showDismiss() {
      this.dismissVisible = true

      if (this.dismissTimer) {
        clearTimeout(this.dismissTimer)
      }

      this.dismissTimer = setTimeout(() => {
        this.dismissVisible = false
      }, 5000)
    },

    hideDismiss() {
      if (this.dismissTimer) {
        clearTimeout(this.dismissTimer)
      }

      this.dismissVisible = false
    },

    hideChatHead() {
      this.hidden = true
      this.hideDismiss()
    },

    openSupport(event) {
      if (this.hidden || this.dragging) {
        return
      }

      if (this.moved) {
        event?.preventDefault()
        event?.stopPropagation()
        this.moved = false
        return
      }

      if (event?.pointerType === 'touch' && !this.dismissVisible) {
        event.preventDefault()
        this.showDismiss()
        return
      }

      window.open(
        SUPPORT_URL,
        '_blank',
        'noopener,noreferrer',
      )

      this.hideDismiss()
    },

    savePosition() {
      try {
        localStorage.setItem(
          POSITION_STORAGE_KEY,
          JSON.stringify({
            x: this.x,
            y: this.y,
          }),
        )
      } catch {
        // Dragging still works if storage
        // is unavailable.
      }
    },

    keepInsideScreen() {
      if (
        this.x === null ||
        this.y === null
      ) {
        return
      }

      this.setPosition(
        this.x,
        this.y,
      )

      this.savePosition()
    },
  }))
}

export function renderCustomerSupportChat() {
  return `
    <div
      x-data="customerSupportChat"
      x-show="!hidden"
      class="fixed bottom-5 right-5 z-[65]"
      :style="positionStyle"
      @resize.window="keepInsideScreen()"
    >
      <a
        x-ref="chatHead"
        href="${SUPPORT_URL}"
        target="_blank"
        rel="noopener noreferrer"
        class="customer-support-chat group relative flex size-12 items-center justify-center rounded-full border-2 border-brand-gold bg-brand-black p-1.5 shadow-2xl outline-none transition-transform duration-200 focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black sm:size-14"
        :class="{
          'customer-support-chat--dragging scale-105 cursor-grabbing':
            dragging,

          'cursor-grab':
            !dragging
        }"
        aria-label="Message YOUR PRODUCT customer support on Facebook"
        title="Drag to move or click for customer support"
        draggable="false"
        @dragstart.prevent
        @pointerdown="startDrag($event)"
        @pointermove.prevent="drag($event)"
        @pointerup="endDrag($event)"
        @pointercancel="cancelDrag()"
        @click.prevent="openSupport($event)"
        @mouseenter="showDismiss()"
        @mouseleave="hideDismiss()"
      >
        <span
          class="pointer-events-none absolute inset-0 rounded-full bg-brand-gold/25 motion-safe:animate-ping"
          style="animation-duration: 2.4s;"
          aria-hidden="true"
        ></span>

        <img
          src="${logoImage}"
          alt=""
          aria-hidden="true"
          draggable="false"
          class="pointer-events-none relative z-10 size-full rounded-full object-contain"
        >

        <span
          class="pointer-events-none absolute bottom-0.5 right-0.5 z-20 size-3 rounded-full border-2 border-brand-black bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.9)]"
          aria-hidden="true"
        ></span>

        <span
          class="pointer-events-none absolute bottom-1/2 right-[calc(100%+0.75rem)] hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-brand-border bg-brand-panel px-3 py-2 text-xs font-semibold text-brand-cream opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block"
        >
          Customer Support
        </span>

        <button
          type="button"
          x-show="dismissVisible"
          x-transition.opacity.duration.150ms
          class="absolute -right-1.5 -top-1.5 z-30 grid size-6 place-items-center rounded-full border border-white/15 bg-black text-sm leading-none text-white shadow-lg"
          aria-label="Hide customer support"
          @pointerdown.stop.prevent
          @pointerup.stop.prevent
          @pointermove.stop.prevent
          @click.stop.prevent="hideChatHead()"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </a>
    </div>
  `
}
