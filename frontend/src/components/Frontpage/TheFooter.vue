<template>
  <footer class="sticky top-[100vh] w-full bg-gray-900 pb-6 bg-zinc-200">
    <div class="container mx-auto px-4">
      <hr class="mb-6 border-b-1" />
      <div class="flex flex-wrap items-center md:justify-between justify-center">
        <div class="w-full md:w-4/12 px-4">
          <div class="text-sm text-gray-600 font-semibold py-1">
            Copyright © {{date}}
            <a href="#" class="text-gray-600 hover:text-black text-sm font-semibold py-1">MusicMarkt</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      date: new Date().getFullYear()
    }
  }
}
</script>