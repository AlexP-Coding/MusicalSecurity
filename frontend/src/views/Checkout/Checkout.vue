<template>
<div class="flex flex-col h-screen">
  <div class="px-4 py-3 text-left sm:px-6">
    <router-link to="/personal-info">
      <button type="button" class="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">Back</button>
    </router-link>
  </div>
  <main class="grid grid-cols-7 gap-4">
    <div class="col-start-2 col-span-2 m-auto">
      <CardForm :products="products"/>
    </div>
    <div class="col-start-5 col-span-2 bg-gray-100 rounded-b-md border border-gray-100">
      <CheckoutItems :products="products"/>
    </div>
  </main>
  <TheFooter />
</div>
</template>
<script>
import CardForm from '../../components/Checkout/CardForm.vue'
import CheckoutItems from '../../components/Checkout/CheckoutItems.vue'
import TheFooter from '../../components/Frontpage/TheFooter.vue'


import http from './../../../http-common';

export default {
  components: { CardForm, CheckoutItems, TheFooter },
  mounted() {
    this.showCart();
  },
  data() {
    return {
      products: []
    }
  },
  methods: {
    showCart() {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('sessionToken')}` }
      };

      let userId = localStorage.getItem('userId');

      http.get("/user/"+ userId +"/cart", config)
      .then((response) => {
        if (response.status == 200) {
            this.products = response.data;
        }
      });
    }
  }
}
</script>
<style>
  body {
    background-color: rgb(242, 242, 242);
  }
</style>
