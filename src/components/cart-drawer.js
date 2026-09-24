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
      <!-- Backdrop -->
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
        <!-- Header -->
        <header
          class="flex items-center justify-between border-b border-brand-border px-5 py-5 sm:px-6"
        >
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold"
            >
              Your Order
            </p>

            <h2
              class="mt-1 font-display text-3xl text-brand-cream"
            >
              Shopping Cart
            </h2>
          </div>

          <button
            type="button"
            class="grid size-11 place-items-center rounded-full border border-brand-border text-brand-muted transition hover:border-brand-gold hover:bg-brand-gold/10 hover:text-brand-gold active:scale-95"
            aria-label="Close shopping cart"
            @click="open = false"
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
                d="M6 6l12 12M18 6 6 18"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </header>

        <!-- Empty cart -->
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

            <h3
              class="mt-5 font-display text-2xl text-brand-cream"
            >
              Your cart is empty
            </h3>

            <p
              class="mt-2 text-sm leading-6 text-brand-muted"
            >
              Add a fragrance from the collection to begin
              your order.
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
          <div
            class="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6"
          >
            <template
              x-for="item in $store.cart.detailedItems"
              :key="item.productId"
            >
              <article
                class="flex gap-4 rounded-2xl border border-brand-border bg-brand-panel p-3.5 sm:p-4"
              >
                <!-- Product poster -->
                <div
                  class="h-28 w-20 shrink-0 overflow-hidden rounded-xl border border-brand-border bg-brand-black"
                >
                  <img
                    :src="item.product.image"
                    :alt="item.product.name"
                    class="size-full object-cover object-center"
                  >
                </div>

                <!-- Product information -->
                <div class="min-w-0 flex-1">
                  <p
                    class="truncate text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-brand-gold"
                    x-text="item.product.collectionLabel"
                  ></p>

                  <div
                    class="mt-1 flex items-start justify-between gap-3"
                  >
                    <p
                      class="truncate font-display text-xl text-brand-cream"
                      x-text="item.product.name"
                    ></p>

                    <button
                      type="button"
                      class="shrink-0 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-brand-muted transition hover:text-red-400"
                      aria-label="Remove product from cart"
                      @click="
                        $store.cart.remove(item.productId)
                      "
                    >
                      Remove
                    </button>
                  </div>

                  <div class="mt-2">
                    <p
                      class="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-brand-muted"
                    >
                      Regular Price
                    </p>

                    <p
                      class="mt-0.5 text-sm font-semibold text-brand-gold"
                      x-text="
                        '₱' +
                        Number(
                          item.product.regularPrice || 0
                        ).toLocaleString('en-PH')
                      "
                    ></p>
                  </div>

                  <div
                    class="mt-3 flex flex-wrap items-center justify-between gap-3"
                  >
                    <!-- Quantity controls -->
                    <div
                      class="flex items-center overflow-hidden rounded-full border border-brand-border bg-brand-black"
                    >
                      <button
                        type="button"
                        class="grid size-9 place-items-center text-brand-cream transition hover:bg-brand-gold/10 hover:text-brand-gold"
                        aria-label="Decrease quantity"
                        @click="
                          $store.cart.decrease(
                            item.productId
                          )
                        "
                      >
                        −
                      </button>

                      <span
                        class="min-w-8 text-center text-sm font-semibold text-brand-cream"
                        x-text="item.quantity"
                      ></span>

                      <button
                        type="button"
                        class="grid size-9 place-items-center text-brand-cream transition hover:bg-brand-gold/10 hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Increase quantity"
                        :disabled="
                          item.quantity >=
                          Number(
                            item.product.stockQuantity || 0
                          )
                        "
                        @click="
                          $store.cart.increase(
                            item.productId
                          )
                        "
                      >
                        +
                      </button>
                    </div>

                    <p
                      class="text-[0.62rem] text-brand-muted"
                      x-text="
                        Number(
                          item.product.stockQuantity || 0
                        ) +
                        ' available'
                      "
                    ></p>
                  </div>

                  <div
                    class="mt-3 flex items-center justify-between border-t border-brand-border pt-3"
                  >
                    <span
                      class="text-[0.62rem] uppercase tracking-[0.1em] text-brand-muted"
                    >
                      Item Total
                    </span>

                    <span
                      class="text-sm font-semibold text-brand-cream"
                      x-text="
                        '₱' +
                        Number(
                          item.lineTotal || 0
                        ).toLocaleString('en-PH')
                      "
                    ></span>
                  </div>
                </div>
              </article>
            </template>
          </div>

          <!-- Cart summary -->
          <footer
            class="border-t border-brand-border bg-brand-panel px-5 py-5 sm:px-6 sm:py-6"
          >
            <div
              class="flex items-center justify-between"
            >
              <span
                class="text-xs uppercase tracking-[0.16em] text-brand-muted"
              >
                Selected Items
              </span>

              <strong
                class="text-brand-cream"
                x-text="$store.cart.itemCount"
              ></strong>
            </div>

            <div
              class="mt-3 flex items-center justify-between"
            >
              <span
                class="text-xs uppercase tracking-[0.16em] text-brand-muted"
              >
                Subtotal
              </span>

              <strong
                class="font-display text-2xl text-brand-cream"
                x-text="
                  '₱' +
                  Number(
                    $store.cart.subtotal || 0
                  ).toLocaleString('en-PH')
                "
              ></strong>
            </div>

            <p
              class="mt-3 text-xs leading-5 text-brand-muted"
            >
              Delivery fees are reviewed during checkout.
            </p>

            <a
              href="/checkout/"
              class="mt-5 flex w-full items-center justify-center rounded-full bg-brand-gold px-6 py-3.5 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-light active:scale-[0.99]"
            >
              Proceed to Checkout
            </a>

            <button
              type="button"
              class="mt-3 w-full py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-muted transition hover:text-red-400"
              @click="$store.cart.clear()"
            >
              Clear Cart
            </button>
          </footer>
        </div>
      </aside>
    </div>
  `
}