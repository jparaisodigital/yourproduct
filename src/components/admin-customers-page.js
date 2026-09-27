export function renderAdminCustomersPage() {
    return `
      <section
        x-show="activePage === 'customers'"
        x-transition.opacity
        aria-labelledby="customers-page-title"
      >
        <div class="rounded-[1.75rem] border border-brand-border bg-brand-panel p-6 sm:p-8">
          <p class="text-xs font-semibold uppercase tracking-widest text-brand-gold">
            Admin Management
          </p>
          <h1 id="customers-page-title" class="mt-2 font-display text-4xl text-brand-cream">
            Customers
          </h1>
          <p class="mt-3 text-sm text-brand-muted">
            Customer accounts from the database.
          </p>
        </div>

        <p x-show="adminCustomersLoading" class="mt-6 text-sm text-brand-muted">
          Loading customers...
        </p>

        <p
          x-show="adminCustomersError"
          x-text="adminCustomersError"
          class="mt-6 rounded-xl border border-red-400/30 bg-brand-panel p-5 text-sm text-red-300"
          role="alert"
        ></p>

        <p
          x-show="!adminCustomersLoading && !adminCustomersError && adminCustomers.length === 0"
          class="mt-6 rounded-xl border border-brand-border bg-brand-panel p-5 text-sm text-brand-muted"
        >
          No customers found.
        </p>

        <div
          x-show="!adminCustomersLoading && !adminCustomersError && adminCustomers.length > 0"
          class="mt-6 grid gap-4 md:grid-cols-2"
        >
          <template x-for="customer in adminCustomers" :key="customer.id">
            <article class="rounded-2xl border border-brand-border bg-brand-panel p-5">
              <h2
                class="font-semibold text-brand-cream"
                x-text="[customer.first_name, customer.last_name].filter(Boolean).join(' ') || 'Customer'"
              ></h2>
              <p class="mt-2 break-all text-sm text-brand-muted" x-text="customer.email || '—'"></p>
              <p class="mt-1 text-sm text-brand-muted" x-text="customer.mobile_number || 'No mobile number'"></p>
              <div class="mt-4 flex flex-wrap gap-2 text-xs text-brand-gold">
                <span x-text="customer.customer_type || '—'"></span>
                <span>·</span>
                <span x-text="customer.membership_status || '—'"></span>
                <span>·</span>
                <span x-text="customer.account_status || '—'"></span>
              </div>
            </article>
          </template>
        </div>
      </section>
    `
  }