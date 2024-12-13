<template>
<main>
  <div class="py-10">
    <button class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-52 rounded inline-flex items-center">
      <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
      <span>Pay</span>
    </button>
    <div class="relative flex py-5 items-center">
      <div class="flex-grow border-t border-gray-300"></div>
        <span class="flex-shrink mx-4 text-gray-300">or</span>
      <div class="flex-grow border-t border-gray-300"></div>
    </div>
  </div>
  <div class="mt-2 sm:mt-0">
      <div class="mt-2 md:col-span-2 md:mt-0">
        <form method="POST"  @submit.prevent="submit">
          <div class="overflow-hidden shadow sm:rounded-md">
            <div class="bg-white px-4 py-5 sm:p-6">
              <div class="grid grid-cols-6 gap-6">

                <div class="col-span-6">
                  <label for="card-number" class="block text-sm font-medium text-gray-700">Card Number</label>
                  <input type="text" name="card-number" v-model="cardNumber" id="card-number" autocomplete="email" class="outline-none w-full focus:border-2 focus:border-blue-accent text-black text-sm font-semibold border py-1 px-8 rounded-lg" />
                </div>

                <div class="col-span-6">
                  <label for="card-holder-name" class="block text-sm font-medium text-gray-700">Card Holder Name</label>
                  <input type="text" name="card-holder-name" v-model="cardHolderName" id="card-holder-name" autocomplete="email" class="outline-none w-full focus:border-2 focus:border-blue-accent text-black text-sm font-semibold border py-1 px-8 rounded-lg" />
                </div>

                <div class="col-span-6 sm:col-span-6 lg:col-span-6">
                  <label for="date" class="block text-sm font-medium text-gray-700">Expiry Date (MM/YY)</label>
                  <input type="month" name="date" id="date" v-model="date" class="outline-none w-full focus:border-2 focus:border-blue-accent text-black text-sm font-semibold border py-1 px-8 rounded-lg" />
                </div>

                <div class="col-span-6 sm:col-span-6 lg:col-span-6">
                  <label for="cvv" class="block text-sm font-medium text-gray-700">CVV Code</label>
                  <input type="text" name="cvv" id="cvv" v-model="cvv" class="outline-none w-full focus:border-2 focus:border-blue-accent text-black text-sm font-semibold border py-1 px-8 rounded-lg" />
                </div>

              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
              <button type="submit" class="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">Pay €{{ products.totalPrice }}</button>
            </div>
          </div>
        </form>
      </div>
  </div>
</main>
</template>
<script>

import http from './../../../http-common';

export default {
  name:'CardForm',
  props: {
    products: [],
  },
  data() {
    return {
      cardInfo: {
        cardNumber: '',
        cardHolderName: '',
        date: '',
        cvv: '',
      },
    }
  },
  methods: {
    submit() {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('sessionToken')}` }
      };

      http.post("/store/order", JSON.stringify({}), config)
      .then((response) => {
        if (response.status == 201) {
          this.$router.push({ path: '/payment-completed' });
        }
      })
      .catch(error => console.log(error));
    }
  } 
}
</script>
