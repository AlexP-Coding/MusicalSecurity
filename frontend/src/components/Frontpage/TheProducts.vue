<template>
  <div class="bg-white">
    <div class="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <h2 class="text-2xl font-bold tracking-tight text-red-600">All products</h2>

      <div v-if="rendered" class="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        <div v-for="product in products" :key="product.id" class="group relative">
          <router-link :to="'/product/' + String(product.id)">
              <div class="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
                <img src="./../../assets/shirt.jpeg" alt="shirt" class="h-full w-full object-cover object-center lg:h-full lg:w-full" />
              </div>
              <div class="mt-4 flex justify-between">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <a :href="product.href">
                      <span aria-hidden="true" class="absolute inset-0" />
                      {{ product.name }}
                    </a>
                  </h3>
                  <p class="mt-1 text-sm text-gray-500">{{ product.brand }}</p>
                </div>
                <p class="text-sm font-medium text-gray-900">{{ product.price }}€</p>
              </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from "../../../http-common";

export default {
  name: "TheProducts",
  props: {
  },
  data() {
    return {
      products: [],
      rendered: false,
    };
  },
  async beforeMount() {
    await this.getProducts();
  },
  methods: {
    async getProducts() {
      let response;
      let request = "/store/products";

      response = await http.get(request);
      this.products = response.data;
      this.rendered = true;
      window.scrollTo(0, 0);
    },
  }
};
</script>