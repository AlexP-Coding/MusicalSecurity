<template>
  <div class="flex flex-col h-screen">
      <main>
        <TheNavbar />
        <TheProductCard :product="product" v-if="this.rendered"/>
      </main>
    <TheFooter />
  </div>
</template>
<script>
import http from "../../http-common";
import { StarIcon } from '@heroicons/vue/20/solid'
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'

import TheNavbar from '../components/Frontpage/TheNavbar.vue'
import TheFooter from '../components/Frontpage/TheFooter.vue'
import TheProductCard from '../components/TheProductCard.vue'

export default {
  name: "Product",
  components: {
    TheNavbar,
    TheFooter,
    TheProductCard
  },
  props: {
  },
  data() {
    return {
      product: {},
      rendered: false,
    };
  },
  async beforeMount() {
    await this.getProduct();
  },
  methods: {
    async getProduct() {
      let response;
      let request = "/store/products/" + this.$route.params.id;

      response = await http.get(request);
      
      this.product = response.data;
      this.rendered = true;
      window.scrollTo(0, 0);
    },
  }
};
</script>