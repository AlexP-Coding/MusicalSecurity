<template>
<div class="flex flex-col h-screen">
    <!-- This example requires Tailwind CSS v3.0+ -->
  <main class="m-auto">
    <div class="relative px-6 lg:px-8">
      <div class="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
        <div>
          <div>
            <h1 class="text-3xl text-gray-400 font-bold tracking-tight sm:text-center sm:text-5xl">Payment completed successfully!</h1>
            <div class="mt-8 flex gap-x-4 sm:justify-center">
              <router-link to="/">
                <a href="#" class="inline-block rounded-lg bg-red-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-red-600 hover:bg-red-700 hover:ring-red-700">
                  See more products!
                  <span class="text-white-200" aria-hidden="true">&rarr;</span>
                </a>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
<TheFooter />
</div>
</template>
<script>
import TheFooter from '../../components/Frontpage/TheFooter.vue'

export default {
  name:'PaymentCompleted',
  components: { TheFooter },
}
</script>
