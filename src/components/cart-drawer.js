export function renderCartDrawer() {
    return `
      <div
        x-data="{ open: false }"
        @open-cart.window="open = true"
        @keydown.escape.window="open = false"
        x-effect="
  document.body.style.overflow =
    (open || $store.productView.isOpen)
      ? 'hidden'
      : ''
"
        x-cloak
      >
        <!-- Dark background overlay -->
        <button
          type="button"
          x-show="open"
          x-transition.opacity
          class="fixed inset-0 z-40 cursor-default bg-black/75 backdrop-blur-sm"
          aria-label="Close shopping cart"
          @click="open = false"
        ></button>
  
        <!-- Cart drawer -->
        <aside
          x-show="open"
          x-transition:enter="transition duration-300 ease-out"
          x-transition:enter-start="translate-x-full"
          x-transition:enter-end="translate-x-0"
          x-transition:leave="transition duration-200 ease-in"
          x-transition:leave-start="translate-x-0"
          x-transition:leave-end="translate-x-full"
          class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-brand-border bg-brand-black shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping cart"
        >
          <!-- Drawer header -->
          <header
            class="flex items-center justify-between border-b border-brand-border px-6 py-5"
          >
            <div>
              <p
                class="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold"
              >
                Your Order
              </p>
  
              <h2 class="mt-1 font-display text-3xl text-brand-cream">
                Shopping Cart
              </h2>
            </div>
  
            <button
              type="button"
              class="grid size-11 place-items-center rounded-full border border-brand-border text-xl text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
              aria-label="Close shopping cart"
              @click="open = false"
            >
              ×
            </button>
          </header>
  
          <!-- Empty cart state -->
          <div
            x-show="$store.cart.itemCount === 0"
            class="grid flex-1 place-items-center px-6 text-center"
          >
            <div>
              <div
                class="mx-auto grid size-16 place-items-center rounded-full border border-brand-border text-brand-gold"
              >
                <svg
                  class="size-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 3h1.386a1.5 1.5 0 0 1 1.455 1.136l.383 1.535m0 0L6.75 10.5A1.5 1.5 0 0 0 8.205 11.636h7.884a1.5 1.5 0 0 0 1.43-1.048l1.481-4.917H5.474ZM8.25 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm9 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
              </div>
  
              <h3 class="mt-5 font-display text-2xl text-brand-cream">
                Your cart is empty
              </h3>
  
              <p class="mt-2 text-sm leading-6 text-brand-muted">
                Add a fragrance from the collection to begin your order.
              </p>
  
              <button
                type="button"
                class="mt-6 rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-light"
                @click="open = false"
              >
                Continue shopping
              </button>
            </div>
          </div>
  
          <!-- Cart with products -->
          <div
            x-show="$store.cart.itemCount > 0"
            class="flex min-h-0 flex-1 flex-col"
          >
            <!-- Product list -->
            <div class="flex-1 space-y-4 overflow-y-auto px-6 py-6">
              <template
                x-for="item in $store.cart.detailedItems"
                :key="item.productId"
              >
                <article
                  class="flex gap-4 rounded-2xl border border-brand-border bg-brand-panel p-4"
                >
                  <div
                    class="size-24 shrink-0 overflow-hidden rounded-xl bg-brand-cream"
                  >
                    <img
                      :src="item.product.image"
                      :alt="item.product.name"
                      class="size-full object-contain p-2"
                    >
                  </div>
  
                  <div class="min-w-0 flex-1">
                    <p
                      class="truncate font-display text-xl text-brand-cream"
                      x-text="item.product.name"
                    ></p>
  
                    <p
                      class="mt-1 text-sm font-semibold text-brand-gold"
                      x-text="'₱' + item.product.regularPrice.toLocaleString('en-PH')"
                    ></p>
  
                    <div class="mt-4 flex items-center justify-between gap-3">
                      <!-- Quantity controls -->
                      <div
                        class="flex items-center rounded-full border border-brand-border"
                      >
                        <button
                          type="button"
                          class="grid size-9 place-items-center text-brand-cream transition hover:text-brand-gold"
                          aria-label="Decrease quantity"
                          @click="$store.cart.decrease(item.productId)"
                        >
                          −
                        </button>
  
                        <span
                          class="min-w-8 text-center text-sm font-semibold text-brand-cream"
                          x-text="item.quantity"
                        ></span>
  
                        <button
                          type="button"
                          class="grid size-9 place-items-center text-brand-cream transition hover:text-brand-gold"
                          aria-label="Increase quantity"
                          @click="$store.cart.increase(item.productId)"
                        >
                          +
                        </button>
                      </div>
  
                      <button
                        type="button"
                        class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted transition hover:text-red-400"
                        @click="$store.cart.remove(item.productId)"
                      >
                        Remove
                      </button>
                    </div>
  
                    <div
                      class="mt-3 flex items-center justify-between border-t border-brand-border pt-3"
                    >
                      <span class="text-xs uppercase tracking-wider text-brand-muted">
                        Item total
                      </span>
  
                      <span
                        class="text-sm font-semibold text-brand-cream"
                        x-text="'₱' + item.lineTotal.toLocaleString('en-PH')"
                      ></span>
                    </div>
                  </div>
                </article>
              </template>
            </div>
  
            <!-- Cart summary -->
            <footer
              class="border-t border-brand-border bg-brand-panel px-6 py-6"
            >
              <div class="flex items-center justify-between">
                <span
                  class="text-sm uppercase tracking-[0.18em] text-brand-muted"
                >
                  Selected Items
                </span>
  
                <strong
                  class="text-brand-cream"
                  x-text="$store.cart.itemCount"
                ></strong>
              </div>
  
              <div class="mt-3 flex items-center justify-between">
                <span
                  class="text-sm uppercase tracking-[0.18em] text-brand-muted"
                >
                  Subtotal
                </span>
  
                <strong
                  class="font-display text-2xl text-brand-cream"
                  x-text="'₱' + $store.cart.subtotal.toLocaleString('en-PH')"
                ></strong>
              </div>
  
              <p class="mt-3 text-xs leading-5 text-brand-muted">
                Minimum order and checkout rules are pending final client confirmation.
              </p>
  
              <a
               href="/checkout/"
                class="mt-5 flex w-full items-center justify-center rounded-full bg-brand-gold px-6 py-3.5 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-light"
                >
               Proceed to checkout
              </a>
  
              <button
                type="button"
                class="mt-3 w-full py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-muted transition hover:text-red-400"
                @click="$store.cart.clear()"
              >
                Clear cart
              </button>
            </footer>
          </div>
        </aside>
      </div>
    `
  }