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
              <!-- <p
                class="text-sm text-center sm:text-left sm:text-base font-base sm:font-semibold"
              >
                See how experienced developers solve problems in real-time.
                Watching scripted tutorials isn't right, but understanding how
                developers think is invaluable.
              </p> -->
            </div>
          </div>
          <div class="px-8 mb-auto mt-auto">
            <div
              class="rounded-lg bg-white p-5 sm:p-10 border-b-4 border-red-primary-translucent"
            >
              <form @submit.prevent="submit" method="post" v-if="!this.$route.query.enroll && !this.$route.query.validate">
                <input
                  name="firstname"
                  type="text"
                  v-model="first_name"
                  class="outline-none w-full focs:border-2 focus:border-blue-accent text-black text-sm font-semibold border py-4 px-8 rounded-lg mb-4"
                  placeholder="First Name"
                />
                <!-- <ErrorMessage
                  name="firstname"
                  class="inline-flex text-red-primary text-xs font-bold mb-5 pl-4"
                /> -->
                <input
                  name="lastname"
                  type="text"
                  v-model="last_name"
                  class="outline-none w-full focs:border-2 focus:border-blue-accent text-black text-sm font-semibold border py-4 px-8 rounded-lg mb-4"
                  placeholder="Last Name"
                />
                <input
                  name="username"
                  type="text"
                  v-model="username"
                  class="outline-none w-full focs:border-2 focus:border-blue-accent text-black text-sm font-semibold border py-4 px-8 rounded-lg mb-4"
                  placeholder="Username"
                />
                <input
                  name="email"
                  type="text"
                  v-model="email"
                  class="outline-none w-full focs:border-2 focus:border-blue-accent text-black text-sm font-semibold border py-4 px-8 rounded-lg mb-4"
                  placeholder="E-mail"
                />
                <input
                  name="password"
                  type="password"
                  v-model="password"
                  class="outline-none w-full focs:border-2 focus:border-blue-accent text-black text-sm font-semibold border py-4 px-8 rounded-lg mb-4"
                  placeholder="Password"
                />
                <button type="submit" class="w-full uppercase border-b-4 text-base bg-red-600 hover:bg-red-700 font-semibold text-white rounded-lg py-4 mb-4">
                  Sign Up
                </button>
                <p class="text-center text-gray-700">
                  Already have an account? <span class="text-red-600"><router-link to="/login">Sign in.</router-link></span>
                </p>
              </form>
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

import OTPValidate from '../components/Login/OTPValidate.vue'
import OTPEnroll from '../components/Login/OTPEnroll.vue'

import http from "../../http-common";

export default {
  name: "SignUp",
  components: {
    TheNavbar,
    TheFooter,
    OTPValidate,
    OTPEnroll
  },
  data() {
    return {
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      password: '',
    }
  },
  methods: {
    submit() {
      http.post("/auth/register", JSON.stringify({name: this.first_name + " " + this.last_name, username: this.username, email: this.email, password: this.password}))
        .then(async (response) => {
          if (response.status == 201) {
              localStorage.setItem('validationToken', response.data.validationToken);
              this.$store.dispatch('setState', true);
              this.$router.push({ path: '/create-account', query: { enroll: 'true' } })
          }
      })
      .catch(error => console.log(error));
    },
  },
};
</script>