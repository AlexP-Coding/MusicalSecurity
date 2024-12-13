<template>
  <div class="flex flex-col h-screen">
    <main>
      <TheNavbar />
      <div class="flex flex-col xl:mx-96 mt-10 bg-gray-50 p-8 rounded-md">
        <div class="overflow-x-auto">
          <h1 class="text-3xl text-red-600 font-bold tracking-tight sm:text-center sm:text-5xl text-center">Get your favorite items before others!</h1>
          <p class="my-6 text-lg leading-8 text-gray-600 text-center">
            Top ranked customers in the respective scoreboard(s) can make a reservation for new items!
          </p>
          <div class="p-1.5 w-full inline-block align-middle text-center">
            <div class="overflow-hidden border rounded-lg">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase text-center">
                      Ranking
                    </th>
                    <th scope="col" class="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase text-center">
                      Artist
                    </th>
                    <th scope="col" class="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase text-center">
                      Reservation
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr>
                    <td class="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                      1
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                      Arctic Monkeys
                    </td>
                    <td class="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
                      <a class="text-green-500 hover:text-green-700" href="#">
                        Make a reservation
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td class="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                      800
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                      Reneé Rapp
                    </td>
                    <td class="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
                      <a class="text-green-500 hover:text-green-700" href="#">
                        Make a reservation
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td class="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                      60
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                      Ed Sheeran
                    </td>
                    <td class="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
                      <a class="text-green-500 hover:text-green-700" href="#">
                        Make a reservation
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
    <TheFooter />
  </div>
</template>
<script>
import TheNavbar from "../components/Frontpage/TheNavbar.vue";
import TheFooter from "../components/Frontpage/TheFooter.vue";

export default {
  name: "Reserve",
  components: { TheFooter, TheNavbar },
};
</script>
