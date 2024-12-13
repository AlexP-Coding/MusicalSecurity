<template>
  <div class="flex flex-col h-screen">
      <main>
        <TheNavbar />
        <div
        class="container h-screen mx-auto flex">
        <div class="my-5 w-full grid md:grid-cols-2 grid-cols-1 sm:p-10 bg-red-50">
          <div class="flex text-red-600 p-auto mb-12 px-8 text-center">
            <div class="m-auto">
              <h1
                class="text-xl text-center sm:text-left sm:text-5xl py-8 font-extrabold"
              >
                Fulfill your musical needs.
              </h1>
            </div>
          </div>

          <div class="px-8 mb-auto mt-auto">
            <div
              class="rounded-lg bg-white p-5 sm:p-10 border-b-4 border-red-primary-translucent"
            >
              <Login />
              <OTPValidate />
              <OTPEnroll />
            </div>
          </div>
        </div>
      </div>
    </main>
    <TheFooter />
  </div>
</template>

<script>
import TheNavbar from '../components/Frontpage/TheNavbar.vue'
import TheFooter from '../components/Frontpage/TheFooter.vue'
import Login from '../components/Login/Login.vue'
import OTPValidate from '../components/Login/OTPValidate.vue'
import OTPEnroll from '../components/Login/OTPEnroll.vue'


export default {
  name: "LoginView",
  components: {
    TheNavbar,
    TheFooter,
    Login,
    OTPValidate,
    OTPEnroll
  },
  data () {
    return {
    }
  },
};
</script>
