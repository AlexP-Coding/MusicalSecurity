<script setup>
import TheNavbar from '../components/Frontpage/TheNavbar.vue'
import TheProducts from '../components/Frontpage/TheProducts.vue'
import TheHero from '../components/Frontpage/TheHero.vue'
import TheFooter from '../components/Frontpage/TheFooter.vue'

</script>

<template>
  <div class="flex flex-col h-screen">
    <main>
      <TheNavbar />
      <TheHero />
      <TheProducts />
    </main>
    <TheFooter />
  </div>
</template>
