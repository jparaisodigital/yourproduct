import './style.css'
import Alpine from 'alpinejs'

window.Alpine = Alpine

document.querySelector('#app').innerHTML = `
  <main class="grid min-h-screen place-items-center bg-[#0b0a09] px-6 text-center text-white">
    <section x-data="{ count: 0 }">
      <p class="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#c7a35a]">
        Your Product
      </p>

      <h1 class="text-4xl font-bold sm:text-6xl">
        Alpine Ready
      </h1>

      <p class="mx-auto mt-5 max-w-md text-base leading-7 text-neutral-400">
        Click the button to test Alpine.js interaction.
      </p>

      <button
        type="button"
        class="mt-8 rounded-full bg-[#c7a35a] px-6 py-3 font-semibold text-black transition hover:bg-[#dfbf7a]"
        @click="count++"
      >
        Click Count:
        <span x-text="count">0</span>
      </button>
    </section>
  </main>
`

Alpine.start()