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

      <div
        x-show="!adminCustomersLoading && !adminCustomersError"
        class="mt-6 grid gap-3 rounded-2xl border border-brand-border bg-brand-panel p-4 md:grid-cols-5"
      >
        <label class="md:col-span-2">
          <span class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
            Search
          </span>
          <input
            type="search"
            x-model.trim="adminCustomerSearch"
            placeholder="Name, email, or mobile"
            class="mt-2 min-h-11 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
          >
        </label>

        <label>
          <span class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
            Type
          </span>
          <select
            x-model="adminCustomerTypeFilter"
            class="mt-2 min-h-11 w-full rounded-xl border border-brand-border bg-brand-black px-3 text-sm text-brand-cream outline-none focus:border-brand-gold"
          >
            <option value="all">All</option>
            <option value="regular">Regular</option>
            <option value="member">Member</option>
          </select>
        </label>

        <label>
          <span class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
            Membership
          </span>
          <select
            x-model="adminCustomerMembershipFilter"
            class="mt-2 min-h-11 w-full rounded-xl border border-brand-border bg-brand-black px-3 text-sm text-brand-cream outline-none focus:border-brand-gold"
          >
            <option value="all">All</option>
            <option value="none">None</option>
            <option value="active">Active</option>
          </select>
        </label>

        <label>
          <span class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
            Joined
          </span>
          <select
            x-model="adminCustomerJoinedFilter"
            class="mt-2 min-h-11 w-full rounded-xl border border-brand-border bg-brand-black px-3 text-sm text-brand-cream outline-none focus:border-brand-gold"
          >
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="week">Last 7 days</option>
            <option value="month">This month</option>
          </select>
        </label>
      </div>

      <p
        x-show="!adminCustomersLoading && !adminCustomersError && filteredAdminCustomers.length === 0"
        class="mt-6 rounded-xl border border-brand-border bg-brand-panel p-5 text-sm text-brand-muted"
      >
        No customers found.
      </p>

      <div
        x-show="!adminCustomersLoading && !adminCustomersError && filteredAdminCustomers.length > 0"
        class="mt-6 grid gap-4 md:grid-cols-2"
      >
        <template x-for="customer in filteredAdminCustomers" :key="customer.id">
          <article class="rounded-2xl border border-brand-border bg-brand-panel p-5">
            <h2
              class="font-semibold text-brand-cream"
              x-text="[customer.first_name, customer.last_name].filter(Boolean).join(' ') || 'Customer'"
            ></h2>

            <p
              class="mt-2 break-all text-sm text-brand-muted"
              x-text="customer.email || '—'"
            ></p>

            <p
              class="mt-1 text-sm text-brand-muted"
              x-text="customer.mobile_number || 'No mobile number'"
            ></p>

            <div class="mt-4 flex flex-wrap gap-2">
              <span
                class="inline-flex items-center rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-brand-gold"
                x-text="'Type: ' + (customer.customer_type || '—')"
              ></span>

              <span
                class="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-emerald-300"
                x-text="'Membership: ' + (customer.membership_status || '—')"
              ></span>

              <span
                class="inline-flex items-center rounded-full border border-brand-border bg-brand-black px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-brand-muted"
                x-text="'Account: ' + (customer.account_status || '—')"
              ></span>
            </div>
          </article>
        </template>
      </div>
    </section>
  `
}