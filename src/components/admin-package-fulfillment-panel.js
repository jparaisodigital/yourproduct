export function renderAdminPackageFulfillmentPanel() {
    return `
      <section
        x-show="
          selectedApplication.status === 'approved'
        "
        class="rounded-2xl border border-brand-gold/30 bg-brand-black p-5"
        aria-labelledby="package-fulfillment-title"
      >
        <div
          class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
        >
          <div class="min-w-0">
            <p
              class="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-brand-gold"
            >
              Package Fulfillment
            </p>
  
            <h3
              id="package-fulfillment-title"
              class="mt-2 font-display text-2xl text-brand-cream"
            >
              Company-Assorted Products
            </h3>
  
            <p
              class="mt-2 max-w-xl text-xs leading-5 text-brand-muted"
            >
              Assign the perfume products included in this
              package. The customer cannot select individual
              scents.
            </p>
          </div>
  
          <div
            class="w-fit shrink-0 rounded-lg border px-3 py-2"
            :class="
              selectedApplication.fulfillment_status ===
              'pending-allocation'
                ? 'border-amber-400/30 bg-amber-400/[0.06]'
                : selectedApplication.fulfillment_status ===
                  'ready-for-packing'
                  ? 'border-emerald-400/30 bg-emerald-400/[0.06]'
                  : selectedApplication.fulfillment_status ===
                    'shipped'
                    ? 'border-blue-400/30 bg-blue-400/[0.06]'
                    : selectedApplication.fulfillment_status ===
                      'completed'
                      ? 'border-emerald-400/30 bg-emerald-400/[0.06]'
                      : 'border-brand-border bg-brand-panel'
            "
          >
            <p
              class="flex items-center gap-2 whitespace-nowrap text-[0.62rem] font-semibold uppercase tracking-[0.12em]"
              :class="
                selectedApplication.fulfillment_status ===
                'pending-allocation'
                  ? 'text-amber-300'
                  : selectedApplication.fulfillment_status ===
                    'ready-for-packing'
                    ? 'text-emerald-300'
                    : selectedApplication.fulfillment_status ===
                      'shipped'
                      ? 'text-blue-300'
                      : selectedApplication.fulfillment_status ===
                        'completed'
                        ? 'text-emerald-300'
                        : 'text-brand-muted'
              "
            >
              <span
                class="size-1.5 shrink-0 rounded-full"
                :class="
                  selectedApplication.fulfillment_status ===
                  'pending-allocation'
                    ? 'bg-amber-400'
                    : selectedApplication.fulfillment_status ===
                      'ready-for-packing'
                      ? 'bg-emerald-400'
                      : selectedApplication.fulfillment_status ===
                        'shipped'
                        ? 'bg-blue-400'
                        : selectedApplication.fulfillment_status ===
                          'completed'
                          ? 'bg-emerald-400'
                          : 'bg-brand-muted'
                "
                aria-hidden="true"
              ></span>
  
              <span
                x-text="
                  membershipFulfillmentStatusLabel(
                    selectedApplication.fulfillment_status
                  )
                "
              ></span>
            </p>
          </div>
        </div>
  
        <div
          x-show="
            !selectedApplication.package_inventory_deducted
          "
          class="mt-5"
        >
          <div
            class="rounded-2xl border border-brand-border bg-brand-panel p-4"
          >
            <div
              class="flex flex-wrap items-end justify-between gap-4"
            >
              <div class="min-w-0">
                <p
                  class="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-brand-muted"
                >
                  Required Perfume Bottles
                </p>
  
                <p
                  class="mt-1 text-xs leading-5 text-brand-muted"
                  x-text="
                    selectedApplication.package
                      .assortmentNotice
                  "
                ></p>
              </div>
  
              <strong
                class="select-none whitespace-nowrap font-display text-3xl"
                :class="
                  packageAllocationTotal ===
                  selectedApplication.package.productQuantity
                    ? (
                        canConfirmPackageAllocation
                          ? 'text-emerald-300'
                          : 'text-red-300'
                      )
                    : packageAllocationTotal >
                      selectedApplication.package.productQuantity
                      ? 'text-red-300'
                      : 'text-brand-gold'
                "
              >
                <span
                  x-text="packageAllocationTotal"
                ></span>
  
                <span class="text-brand-muted">
                  /
                </span>
  
                <span
                  x-text="
                    selectedApplication.package
                      .productQuantity
                  "
                ></span>
              </strong>
            </div>
  
            <div
              class="mt-4 h-2 overflow-hidden rounded-full bg-brand-black"
              aria-hidden="true"
            >
              <div
                class="h-full rounded-full transition-all duration-300"
                :class="
                  packageAllocationTotal ===
                  selectedApplication.package.productQuantity
                    ? (
                        canConfirmPackageAllocation
                          ? 'bg-emerald-400'
                          : 'bg-red-400'
                      )
                    : packageAllocationTotal >
                      selectedApplication.package.productQuantity
                      ? 'bg-red-400'
                      : 'bg-brand-gold'
                "
                :style="
                  'width: ' +
                  packageAllocationProgress +
                  '%'
                "
              ></div>
            </div>
          </div>
  
          <div class="mt-4 space-y-3">
            <template
              x-for="product in inventoryProducts"
              :key="product.id"
            >
              <div
                class="rounded-2xl border border-brand-border bg-brand-panel p-4"
              >
                <div
                  class="grid gap-4 sm:grid-cols-[minmax(0,1fr)_8rem] sm:items-center"
                >
                  <div
                    class="flex min-w-0 items-center gap-3"
                  >
                    <div
                      class="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-brand-border bg-brand-cream"
                    >
                      <img
                        :src="product.image"
                        :alt="product.name"
                        class="size-full object-contain p-1.5"
                      >
                    </div>
  
                    <div class="min-w-0">
                      <p
                        class="truncate text-sm font-semibold text-brand-cream"
                        x-text="product.name"
                      ></p>
  
                      <p
                        class="mt-1 text-xs text-brand-muted"
                      >
                        Available:
  
                        <strong
                          :class="
                            Number(
                              product.stockQuantity || 0
                            ) <= 0
                              ? 'text-red-300'
                              : 'text-brand-cream'
                          "
                          x-text="product.stockQuantity"
                        ></strong>
                      </p>
                    </div>
                  </div>
  
                  <label class="block">
                    <span class="sr-only">
                      Package quantity
                    </span>
  
                    <input
                      type="number"
                      min="0"
                      step="1"
                      inputmode="numeric"
                      :max="product.stockQuantity"
                      :value="
                        packageAllocationQuantities[
                          product.id
                        ] ?? 0
                      "
                      :disabled="
                        Number(
                          product.stockQuantity || 0
                        ) <= 0
                      "
                      @input="
                        updatePackageAllocationQuantity(
                          product.id,
                          $event.target.value
                        )
                      "
                      class="min-h-11 w-full rounded-xl border border-brand-border bg-brand-black px-3 text-center text-sm font-semibold text-brand-cream outline-none transition focus:border-brand-gold disabled:cursor-not-allowed disabled:border-brand-border/60 disabled:text-brand-muted disabled:opacity-50"
                    >
                  </label>
                </div>
              </div>
            </template>
          </div>
  
          <div
            class="mt-5 rounded-2xl border border-brand-border bg-brand-panel p-4"
          >
            <p
              class="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brand-gold"
            >
              Fixed Package Inclusions
            </p>
  
            <div class="mt-3 space-y-2">
              <template
                x-for="
                  inclusion in
                  selectedApplication.package
                    .fixedInventoryItems
                "
                :key="inclusion.inventoryItemId"
              >
                <div
                  class="flex items-center justify-between gap-4 rounded-xl border border-brand-border bg-brand-black px-3 py-2.5"
                >
                  <div>
                    <p
                      class="text-sm font-semibold text-brand-cream"
                      x-text="inclusion.name"
                    ></p>
  
                    <p
                      class="mt-0.5 text-xs text-brand-muted"
                    >
                      Available:
  
                      <span
                        x-text="
                          packageSupplyStock(
                            inclusion.inventoryItemId
                          )
                        "
                      ></span>
                    </p>
                  </div>
  
                  <strong
                    class="text-sm text-brand-gold"
                    x-text="
                      '×' + inclusion.quantity
                    "
                  ></strong>
                </div>
              </template>
            </div>
          </div>
  
          <p
            x-show="packageAllocationError"
            x-text="packageAllocationError"
            class="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-xs leading-5 text-red-200"
            role="alert"
          ></p>
  
          <div
            class="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3"
          >
            <p
              class="text-xs leading-5 text-amber-100/80"
            >
              Confirming this package will deduct the selected
              perfume products and fixed package supplies from
              inventory.
            </p>
          </div>
  
          <button
  type="button"
  class="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full px-5 text-sm font-semibold transition"
  :class="
    canConfirmPackageAllocation
      ? 'bg-brand-gold text-[#17130d] hover:bg-brand-gold-light'
      : 'cursor-not-allowed border border-brand-border bg-brand-panel text-brand-muted'
  "
  :disabled="!canConfirmPackageAllocation"
  @click="confirmPackageAllocation()"
>
  Confirm Package Contents
</button>
</div>

<div
  x-show="
    selectedApplication.package_inventory_deducted
  "
  class="mt-5 rounded-2xl border border-brand-border bg-brand-panel p-4"
>
  <div
    class="flex flex-wrap items-end justify-between gap-3 border-b border-brand-border pb-4"
  >
    <div>
      <p
        class="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brand-gold"
      >
        Allocated Package Contents
      </p>

      <p
        class="mt-1 text-xs leading-5 text-brand-muted"
      >
        Confirmed products prepared for this
        membership package.
      </p>
    </div>

    <div class="text-right">
      <strong
        class="block font-display text-2xl text-brand-cream"
        x-text="
          (
            selectedApplication.package_allocation ||
            []
          ).reduce(
            (total, allocation) =>
              total +
              Number(allocation.quantity || 0),
            0
          )
        "
      ></strong>

      <span
        class="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-brand-muted"
      >
        Total Bottles
      </span>
    </div>
  </div>

  <div class="mt-4 space-y-2">
    <template
      x-for="
        allocation in
        (
          selectedApplication.package_allocation ||
          []
        )
      "
      :key="allocation.product_id"
    >
      <div
        class="flex items-center justify-between gap-4 rounded-xl border border-brand-border bg-brand-black px-3 py-2.5"
      >
        <div
          class="flex min-w-0 items-center gap-3"
        >
          <div
            class="grid size-11 shrink-0 place-items-center overflow-hidden rounded-lg border border-brand-border bg-brand-cream"
          >
            <img
              :src="allocation.product_image_url"
              :alt="allocation.product_name"
              class="size-full object-contain p-1.5"
            >
          </div>

          <div class="min-w-0">
            <p
              class="truncate text-sm font-semibold text-brand-cream"
              x-text="allocation.product_name"
            ></p>

            <p
              class="mt-0.5 text-[0.65rem] uppercase tracking-[0.1em] text-brand-muted"
            >
              Perfume Product
            </p>
          </div>
        </div>

        <strong
          class="shrink-0 text-sm text-brand-gold"
          x-text="
            '×' + allocation.quantity
          "
        ></strong>
      </div>
    </template>
  </div>

  <div
    x-show="
      (
        selectedApplication
          .package_supply_allocation ||
        []
      ).length > 0
    "
    class="mt-4 border-t border-brand-border pt-4"
  >
    <p
      class="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-brand-muted"
    >
      Fixed Inclusions
    </p>

    <div
      class="mt-3 flex flex-wrap gap-2"
    >
      <template
        x-for="
          supply in
          (
            selectedApplication
              .package_supply_allocation ||
            []
          )
        "
        :key="supply.inventory_item_id"
      >
        <span
          class="inline-flex items-center rounded-lg border border-brand-border bg-brand-black px-3 py-2 text-xs text-brand-cream"
        >
          <span
            x-text="supply.inventory_item_name"
          ></span>

          <strong
            class="ml-2 text-brand-gold"
            x-text="'×' + supply.quantity"
          ></strong>
        </span>
      </template>
    </div>
  </div>
</div>

<div
  x-show="
    selectedApplication.package_inventory_deducted
  "
  class="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4"
>
  <div class="flex items-start gap-3">
    <span
      class="mt-1 size-2 shrink-0 rounded-full bg-emerald-400"
      aria-hidden="true"
    ></span>

    <div>
      <p
        class="text-sm font-semibold text-emerald-200"
      >
        Package contents confirmed
      </p>

      <p
        class="mt-1 text-xs leading-5 text-emerald-100/75"
      >
        The allocated perfume products and fixed
        package supplies have been deducted from
        inventory.
      </p>

      <p
        class="mt-2 text-xs text-emerald-100/70"
      >
        Confirmed:

        <span
          x-text="
            formatDate(
              selectedApplication
                .fulfillment_confirmed_at
            )
          "
        ></span>
      </p>
    </div>
  </div>
</div>

<div
  x-show="
    selectedApplication.package_inventory_deducted
  "
  class="mt-4"
>
  <div
    x-show="
      selectedApplication.fulfillment_status ===
      'ready-for-packing' &&
      !packageFulfillmentAction
    "
    class="rounded-2xl border border-brand-border bg-brand-panel p-4"
  >
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p
          class="text-sm font-semibold text-brand-cream"
        >
          Package is ready for packing
        </p>

        <p
          class="mt-1 text-xs leading-5 text-brand-muted"
        >
          After the package has been prepared and
          handed to the courier, update its shipping
          status.
        </p>
      </div>

      <button
        type="button"
        class="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-brand-gold px-5 text-sm font-semibold text-[#17130d] transition hover:brightness-110"
        @click="
          openPackageFulfillmentAction('ship')
        "
      >
        Mark as Shipped
      </button>
    </div>
  </div>
  
          <div
            x-show="
              selectedApplication.fulfillment_status ===
              'shipped' &&
              !packageFulfillmentAction
            "
            class="rounded-2xl border border-blue-400/25 bg-blue-400/[0.06] p-4"
          >
            <div
              class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p
                  class="flex items-center gap-2 text-sm font-semibold text-blue-200"
                >
                  <span
                    class="size-2 rounded-full bg-blue-400"
                    aria-hidden="true"
                  ></span>
  
                  Package shipped
                </p>
  
                <p
                  class="mt-2 text-xs leading-5 text-blue-100/70"
                >
                  The package has been handed to the courier.
                  Mark it as completed after successful
                  delivery.
                </p>
  
                <p
                  x-show="
                    selectedApplication.package_shipped_at
                  "
                  class="mt-2 text-xs text-brand-muted"
                >
                  Shipped:
  
                  <span
                    x-text="
                      formatDate(
                        selectedApplication
                          .package_shipped_at
                      )
                    "
                  ></span>
                </p>
              </div>
  
              <button
                type="button"
                class="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-500"
                @click="
                  openPackageFulfillmentAction('complete')
                "
              >
                Mark as Completed
              </button>
            </div>
          </div>
  
          <div
            x-show="
              selectedApplication.fulfillment_status ===
              'completed' &&
              !packageFulfillmentAction
            "
            class="rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.06] p-4"
          >
            <p
              class="flex items-center gap-2 text-sm font-semibold text-emerald-200"
            >
              <span
                class="size-2 rounded-full bg-emerald-400"
                aria-hidden="true"
              ></span>
  
              Package fulfillment completed
            </p>
  
            <p
              class="mt-2 text-xs leading-5 text-emerald-100/70"
            >
              The membership package has been successfully
              delivered and completed.
            </p>
  
            <p
              x-show="
                selectedApplication.package_completed_at
              "
              class="mt-2 text-xs text-brand-muted"
            >
              Completed:
  
              <span
                x-text="
                  formatDate(
                    selectedApplication
                      .package_completed_at
                  )
                "
              ></span>
            </p>
          </div>
  
          <div
            x-show="packageFulfillmentAction"
            x-transition
            class="rounded-2xl border border-brand-gold/30 bg-brand-panel p-4"
          >
            <p
              class="text-sm font-semibold text-brand-cream"
              x-text="
                packageFulfillmentAction === 'ship'
                  ? 'Confirm package shipment'
                  : 'Confirm completed delivery'
              "
            ></p>
  
            <p
              class="mt-2 text-xs leading-5 text-brand-muted"
              x-text="
                packageFulfillmentAction === 'ship'
                  ? 'Confirm that the packed membership package has been handed to the courier.'
                  : 'Confirm that this membership package was successfully delivered.'
              "
            ></p>
  
            <p
              x-show="packageFulfillmentError"
              x-text="packageFulfillmentError"
              class="mt-3 text-xs leading-5 text-red-300"
              role="alert"
            ></p>
  
            <div
              class="mt-4 grid gap-3 sm:grid-cols-2"
            >
              <button
                type="button"
                class="inline-flex min-h-11 items-center justify-center rounded-xl border border-brand-border px-4 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
                @click="
                  closePackageFulfillmentAction()
                "
              >
                Keep Current Status
              </button>
  
              <button
                type="button"
                class="inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold transition"
                :class="
                  packageFulfillmentAction === 'ship'
                    ? 'bg-brand-gold text-[#17130d] hover:brightness-110'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500'
                "
                @click="
                  confirmPackageFulfillmentAction()
                "
                x-text="
                  packageFulfillmentAction === 'ship'
                    ? 'Confirm Shipment'
                    : 'Confirm Completion'
                "
              ></button>
            </div>
          </div>
        </div>
      </section>
    `
  }