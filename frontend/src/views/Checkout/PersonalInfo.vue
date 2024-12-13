<template>
<div class="flex flex-col h-screen">
  <main>
    <div class="px-4 py-3 text-left sm:px-6">
      <router-link to="/">
        <button type="button" class="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">Back</button>
      </router-link>
    </div>

    <div class="mx-52">
      <h3 class="text-lg font-medium leading-6 text-gray-800 mb-4 mt-5">Personal Information</h3>
      <div class="mt-5 md:col-span-2 md:mt-0">
        <form method="POST" @submit.prevent="submit">
          <div class="overflow-hidden shadow sm:rounded-md">
            <div class="bg-white px-4 py-5 sm:p-6">
              <div class="grid grid-cols-6 gap-6">
                <div class="col-span-6 sm:col-span-3">
                  <label for="first-name" class="block text-sm font-medium text-gray-700">First name</label>
                  <input type="text" name="first-name" id="first-name" v-model="personalInfoData.firstName" autocomplete="first-name" class="mt-1 outline-none w-full focus:border-2 focus:border-blue-accent text-black text-sm font-semibold border py-1 px-8 rounded-lg" />
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label for="last-name" class="block text-sm font-medium text-gray-700">Last name</label>
                  <input type="text" name="last-name" id="last-name" v-model="personalInfoData.lastName" autocomplete="last-name" class="mt-1 outline-none w-full focus:border-2 focus:border-blue-accent text-black text-sm font-semibold border py-1 px-8 rounded-lg">
                </div>

                <div class="col-span-6 sm:col-span-4">
                  <label for="email-address" class="block text-sm font-medium text-gray-700">Email address</label>
                  <input type="text" name="email-address" id="email-address" v-model="personalInfoData.email" autocomplete="email" class="mt-1 outline-none w-full focus:border-2 focus:border-blue-accent text-black text-sm font-semibold border py-1 px-8 rounded-lg">
                </div>

                <div class="col-span-6">
                  <label for="street-address" class="block text-sm font-medium text-gray-700">Street address</label>
                  <input type="text" name="street-address" id="street-address" v-model="personalInfoData.street" required autocomplete="street-address" class="mt-1 outline-none w-full focus:border-2 focus:border-blue-accent text-black text-sm font-semibold border py-1 px-8 rounded-lg">
                </div>

                <div class="col-span-6 sm:col-span-6 lg:col-span-2">
                  <label for="city" class="block text-sm font-medium text-gray-700">City</label>
                  <input type="text" name="city" id="city" v-model="personalInfoData.city" autocomplete="city" required class="mt-1 outline-none w-full focus:border-2 focus:border-blue-accent text-black text-sm font-semibold border py-1 px-8 rounded-lg">
                </div>

                <div class="col-span-6 sm:col-span-3 lg:col-span-2">
                  <label for="region" class="block text-sm font-medium text-gray-700">State / Province</label>
                  <input type="text" name="region" id="region" v-model="personalInfoData.state" autocomplete="region" class="mt-1 outline-none w-full focus:border-2 focus:border-blue-accent text-black text-sm font-semibold border py-1 px-8 rounded-lg">
                </div>

                <div class="col-span-6 sm:col-span-3 lg:col-span-2">
                  <label for="postal-code" class="block text-sm font-medium text-gray-700">ZIP / Postal code</label>
                  <input type="text" name="postal-code" id="postal-code" v-model="personalInfoData.postalCode" required autocomplete="postal-code" class="mt-1 outline-none w-full focus:border-2 focus:border-blue-accent text-black text-sm font-semibold border py-1 px-8 rounded-lg">
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
              <button type="submit" class="inline-flex justify-center rounded-lg border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">Checkout</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </main>
    <TheFooter />
</div>
</template>
<script>
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

import TheFooter from '../../components/Frontpage/TheFooter.vue'

import http from './../../../http-common'

export default {
  name:'PersonalInfo',
  components: { TheFooter },
  data() {
    return {
      personalInfoData: {
        firstName: '',
        lastName: '',
        email: '',
        country: 'Portugal',
        street: '',
        city: '',
        state: '',
        postalCode: '',
      },
    }
  },  
  methods: {
    submit() {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('sessionToken')}` }
      };

      let userId = localStorage.getItem('userId');
      http.post("/user/"+ userId +"/address", JSON.stringify({city: this.personalInfoData.city, postal_code: this.personalInfoData.postalCode, street: this.personalInfoData.street}), config)
      .then((response) => {
        if (response.status == 200) {
          this.$router.push({ path: '/checkout' });
        }
      })
      .catch(error => console.log(error));
    }
  },
}
</script>