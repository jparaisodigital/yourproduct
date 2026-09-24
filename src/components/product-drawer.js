export function renderProductDrawer() {
  return `
    <div
      x-data
      x-cloak
      x-show="$store.productView.isOpen"
      @keydown.escape.window="$store.productView.close()"
      @open-cart.window="$store.productView.close()"
      class="fixed inset-0 z-[70]"
      role="dialog"
      aria-modal="true"
      aria-label="Product quick view"
    >
      <!-- Backdrop -->
      <button
        type="button"
        class="absolute inset-0 cursor-default bg-black/35 backdrop-blur-[2px]"
        aria-label="Close product quick view"
        @click="$store.productView.close()"
      ></button>

      <!-- Product drawer -->
      <aside
        x-show="$store.productView.isOpen"
        x-transition:enter="transition duration-300 ease-out"
        x-transition:enter-start="translate-x-full"
        x-transition:enter-end="translate-x-0"
        x-transition:leave="transition duration-200 ease-in"
        x-transition:leave-start="translate-x-0"
        x-transition:leave-end="translate-x-full"
        class="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col border-l border-brand-border bg-brand-black shadow-2xl"
      >
        <!-- Header -->
        <header
          class="flex min-h-20 shrink-0 items-center justify-between border-b border-brand-border px-5 sm:px-6"
        >
          <div>
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-gold"
            >
              Product Details
            </p>

            <p class="mt-1 text-sm text-brand-muted">
              Quick view
            </p>
          </div>

          <button
            type="button"
            class="grid size-10 place-items-center rounded-full border border-brand-border text-brand-muted transition duration-200 hover:border-brand-gold hover:bg-brand-gold/10 hover:text-brand-gold active:scale-95"
            aria-label="Close product quick view"
            @click="$store.productView.close()"
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

        <template x-if="$store.productView.selectedProduct">
          <div class="flex min-h-0 flex-1 flex-col">
            <!-- Scrollable content -->
            <div class="min-h-0 flex-1 overflow-y-auto">
              <!-- Product image -->
              <div
                class="relative aspect-[4/5] overflow-hidden border-b border-brand-border bg-brand-black"
              >
                <img
                  :src="$store.productView.selectedProduct.image"
                  :alt="$store.productView.selectedProduct.name"
                  class="size-full object-contain object-center"
                >

                <span
                  class="absolute left-5 top-5 rounded-lg border border-brand-gold/30 bg-brand-black/85 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-brand-gold backdrop-blur-sm"
                  x-text="
                    $store.productView.selectedProduct
                      .collectionLabel
                  "
                ></span>
              </div>

              <div class="p-5 sm:p-6">
                <!-- SKU and availability -->
                <div
                  class="flex items-center justify-between gap-4"
                >
                  <span
                    class="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
                    x-text="
                      $store.productView.selectedProduct.sku
                    "
                  ></span>

                  <span
                    class="inline-flex items-center gap-2 text-xs font-semibold"
                    :class="
                      $store.productView.selectedProduct
                        .stockQuantity > 0
                        ? 'text-emerald-400'
                        : 'text-red-400'
                    "
                  >
                    <span
                      class="block size-1.5 shrink-0 rounded-full"
                      :class="
                        $store.productView.selectedProduct
                          .stockQuantity > 0
                          ? 'bg-emerald-400 stock-status-dot'
                          : 'bg-red-400'
                      "
                      aria-hidden="true"
                    ></span>

                    <span
                      x-text="
                        $store.productView.selectedProduct
                          .stockQuantity > 0
                          ? 'In stock'
                          : 'Out of stock'
                      "
                    ></span>
                  </span>
                </div>

                <!-- Product name -->
                <h2
                  class="mt-3 font-display text-4xl leading-tight text-brand-cream"
                  x-text="
                    $store.productView.selectedProduct.name
                  "
                ></h2>

                <!-- Optional description -->
                <p
                  x-show="
                    Boolean(
                      $store.productView.selectedProduct
                        .shortDescription
                    )
                  "
                  class="mt-3 text-sm leading-6 text-brand-muted"
                  x-text="
                    $store.productView.selectedProduct
                      .shortDescription
                  "
                ></p>

                <!-- Pricing -->
                <div
                  class="mt-5 grid grid-cols-2 gap-3 border-y border-brand-border py-4"
                >
                  <div>
                    <p
                      class="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-brand-muted"
                    >
                      Regular Price
                    </p>

                    <p
                      class="mt-1 font-semibold text-brand-cream"
                      x-text="
                        '₱' +
                        Number(
                          $store.productView
                            .selectedProduct.regularPrice
                        ).toLocaleString('en-PH')
                      "
                    ></p>
                  </div>

                  <div
                    x-show="
                      Number(
                        $store.productView.selectedProduct
                          .memberPrice || 0
                      ) > 0
                    "
                  >
                    <p
                      class="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-brand-muted"
                    >
                      Reseller Price
                    </p>

                    <p
                      class="mt-1 font-semibold text-brand-gold"
                      x-text="
                        '₱' +
                        Number(
                          $store.productView
                            .selectedProduct.memberPrice
                        ).toLocaleString('en-PH')
                      "
                    ></p>
                  </div>
                </div>

                <!-- Optional scent information -->
                <div
                  x-show="
                    Boolean(
                      $store.productView.selectedProduct
                        .scentProfile ||
                      $store.productView.selectedProduct
                        .scentCharacter ||
                      $store.productView.selectedProduct
                        .bestFor
                    )
                  "
                  class="mt-5 space-y-4"
                >
                  <div
                    x-show="
                      Boolean(
                        $store.productView.selectedProduct
                          .scentProfile
                      )
                    "
                    class="grid grid-cols-[7rem_1fr] gap-4"
                  >
                    <p
                      class="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-brand-gold"
                    >
                      Scent Profile
                    </p>

                    <p
                      class="text-sm leading-6 text-brand-muted"
                      x-text="
                        $store.productView.selectedProduct
                          .scentProfile
                      "
                    ></p>
                  </div>

                  <div
                    x-show="
                      Boolean(
                        $store.productView.selectedProduct
                          .scentCharacter
                      )
                    "
                    class="grid grid-cols-[7rem_1fr] gap-4 border-t border-brand-border pt-4"
                  >
                    <p
                      class="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-brand-gold"
                    >
                      Character
                    </p>

                    <p
                      class="text-sm leading-6 text-brand-muted"
                      x-text="
                        $store.productView.selectedProduct
                          .scentCharacter
                      "
                    ></p>
                  </div>

                  <div
                    x-show="
                      Boolean(
                        $store.productView.selectedProduct
                          .bestFor
                      )
                    "
                    class="grid grid-cols-[7rem_1fr] gap-4 border-t border-brand-border pt-4"
                  >
                    <p
                      class="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-brand-gold"
                    >
                      Best For
                    </p>

                    <p
                      class="text-sm leading-6 text-brand-muted"
                      x-text="
                        $store.productView.selectedProduct
                          .bestFor
                      "
                    ></p>
                  </div>
                </div>

                <!-- Points and quantity -->
                <div
                  class="mt-5 flex items-center gap-4 border-t border-brand-border pt-5"
                  :class="
                    $store.productView.selectedProduct
                      .isPointsQualified &&
                    Number(
                      $store.productView.selectedProduct
                        .pointsPerUnit || 0
                    ) > 0
                      ? 'justify-between'
                      : 'justify-end'
                  "
                >
                  <div
                    x-show="
                      $store.productView.selectedProduct
                        .isPointsQualified &&
                      Number(
                        $store.productView.selectedProduct
                          .pointsPerUnit || 0
                      ) > 0
                    "
                  >
                    <p
                      class="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-brand-muted"
                    >
                      Qualified Purchase
                    </p>

                    <p
                      class="mt-1 text-sm font-semibold text-brand-gold"
                      x-text="
                        $store.productView.selectedProduct
                          .pointsPerUnit +
                        ' points per bottle'
                      "
                    ></p>
                  </div>

                  <!-- Quantity controls -->
                  <div
                    class="inline-flex h-11 items-center overflow-hidden rounded-xl border border-brand-border bg-brand-panel"
                  >
                    <button
                      type="button"
                      class="grid size-11 place-items-center text-brand-muted transition hover:bg-brand-gold/10 hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Decrease quantity"
                      :disabled="
                        $store.productView.quantity <= 1
                      "
                      @click="$store.productView.decrease()"
                    >
                      <svg
                        class="size-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        aria-hidden="true"
                      >
                        <path
                          d="M6 12h12"
                          stroke-linecap="round"
                        />
                      </svg>
                    </button>

                    <span
                      class="grid min-w-10 place-items-center text-sm font-semibold text-brand-cream"
                      x-text="$store.productView.quantity"
                    ></span>

                    <button
                      type="button"
                      class="grid size-11 place-items-center text-brand-muted transition hover:bg-brand-gold/10 hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Increase quantity"
                      :disabled="
                        $store.productView.quantity >=
                        $store.productView.selectedProduct
                          .stockQuantity
                      "
                      @click="$store.productView.increase()"
                    >
                      <svg
                        class="size-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        aria-hidden="true"
                      >
                        <path
                          d="M12 6v12M6 12h12"
                          stroke-linecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer actions -->
            <div
              class="shrink-0 border-t border-brand-border bg-brand-black p-4 sm:p-5"
            >
              <button
                type="button"
                class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-gold px-5 text-sm font-semibold text-[#17130d] transition duration-200 hover:bg-brand-gold-light active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="
                  $store.productView.selectedProduct
                    .stockQuantity <= 0
                "
                @click="$store.productView.addToCart()"
              >
                <svg
                  class="size-[1.1rem]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  aria-hidden="true"
                >
                  <path
                    d="M3.5 4.5h2l1.65 9.1a2 2 0 0 0 1.97 1.65h7.96a2 2 0 0 0 1.95-1.55L20.5 7.5H6.05"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />

                  <circle
                    cx="9.25"
                    cy="19"
                    r="1.25"
                    fill="currentColor"
                    stroke="none"
                  />

                  <circle
                    cx="17.25"
                    cy="19"
                    r="1.25"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>

                <span
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  x-text="
                    $store.productView.addedQuantity > 0
                      ? 'Added ✓'
                      : 'Add ' +
                        $store.productView.quantity +
                        ' to cart'
                  "
                >
                  Add to cart
                </span>
              </button>

              <button
                type="button"
                x-show="$store.cart.itemCount > 0"
                class="mt-3 inline-flex h-11 w-full items-center justify-center rounded-xl border border-brand-border text-sm font-semibold text-brand-gold transition hover:border-brand-gold hover:bg-brand-gold/10 active:scale-[0.99]"
                @click="$dispatch('open-cart')"
              >
                View Cart
              </button>
            </div>
          </div>
        </template>
      </aside>
    </div>
  `
}