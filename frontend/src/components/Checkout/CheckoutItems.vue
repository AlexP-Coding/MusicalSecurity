<template>
  <main>
    <div class="m-10">
      <div class="flow-root">
        <ul role="list" class="-my-6 divide-y divide-gray-200">
          <li v-for="product in products.cart" :key="product.id" class="flex py-6">
            <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
              <img src="./../../assets/shirt.jpeg" alt="shirt" class="h-full w-full object-cover object-center" />
            </div>

            <div class="ml-4 flex flex-1 flex-col">
              <div>
                <div class="flex justify-between text-base font-medium text-gray-900">
                  <h3>
                    <a :href="product.href">{{ product.Product.name }}</a>
                  </h3>
                  <p class="ml-4">{{ product.Product.price }}</p>
                </div>
              </div>
              <div class="flex flex-1 items-end justify-between text-sm">
                <p class="text-gray-500">Qty {{ product.quantity }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="border-t border-gray-200 py-6 px-4 sm:px-6">
      <div class="flex justify-between text-base font-medium text-gray-900">
        <p class="text-gray-500">Subtotal</p>
        <p>€{{ products.totalPrice }}</p>
      </div>
      <div class="flex justify-between text-base font-medium text-gray-900">
        <p class="text-gray-500">Shipping</p>
        <p>$5.00</p>
      </div>
    </div>
    <div class="border-t border-gray-200 py-6 px-4 sm:px-6">
      <div class="flex justify-between text-base font-medium text-gray-900">
        <p>Total</p>
        <p>€{{ products.totalPrice + 5 }}</p>
      </div>
    </div>
  </main>
</template>

<script>
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'


import http from './../../../http-common';

export default {
  name:'CheckoutItems',
  props: {
    products: [],
  },
  
}
</script>