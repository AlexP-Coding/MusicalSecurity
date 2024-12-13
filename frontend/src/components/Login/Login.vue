<template>
  <form @submit.prevent="submit" method="post" v-if="!this.$route.query.enroll && !this.$route.query.validate">
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
      Sign In
    </button>
    <p class="text-center text-gray-700">
      Don't have an account yet? <span class="text-red-600"><router-link to="/create-account">Create an account.</router-link></span>
    </p>
  </form>
</template>

<script>

import http from "../../../http-common";

export default {
  name: "Login",
  components: {
  },
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    submit() {
      http.post("/auth/login", JSON.stringify({email: this.email, password: this.password}))
        .then(async (response) => {
          if (response.status == 200) {
              localStorage.setItem('validationToken', response.data.validationToken);
              this.$store.dispatch('setState', true);
              if (!response.data.OTPEnrolled) {
                this.$router.push({ path: '/login', query: { enroll: 'true' } })
              } else {
                this.$router.push({ path: '/login', query: { validate: 'true' } })
              }
          }
      })
      .catch(error => console.log(error));
    },
  },
};
</script>