<template>
  <div  v-if="this.$route.query.validate">
    <p class="text-lg text-center sm:text-lg py-8 font-extrabold text-red-600">
    Validate using the code in your authenticator app
    </p>
    <div style="display: flex; flex-direction: row;">
      <v-otp-input
        ref="otpInput"
        input-classes="otp-input"
        separator="-"
        :num-inputs="6"
        :should-auto-focus="true"
        :is-input-num="true"
        :conditionalClass="['one', 'two', 'three', 'four', 'five', 'six']"
        @on-change="handleOnChange"
        @on-complete="handleOnComplete"
        class="mx-auto"
      />
    </div>
    <button class="mt-7 w-full text-lg border-b-4 text-base bg-red-600 hover:bg-red-700 font-semibold text-white rounded-lg py-4 mb-4" @click="verify(otpInput)">Verify</button>
  </div>
</template>

<script>
import VOtpInput from 'vue3-otp-input';
import { ref } from 'vue';

import AuthService from "./../../router/auth";

import http from "../../../http-common";

export default {
  name: "OTPValidate",
  components: {
    VOtpInput,
  },
  data() {
    return {
      code: '',
    }
  },
  setup() {
    const otpInput = ref(null)

    const handleOnComplete = (value) => {
      console.log('OTP completed: ', value);
    };

    const handleOnChange = (value) => {
      console.log('OTP changed: ', value);
    };

     const clearInput = () => {
      otpInput.value.clearInput()
    }

    return { handleOnComplete, handleOnChange, clearInput, otpInput };
  },
  methods: {
    verify(otpInput) {
      const config = {
          headers: { Authorization: `Bearer ${localStorage.getItem('validationToken')}` }
      };
      http.post("/auth/otp/validate", JSON.stringify({otp: otpInput.otp.join('')}), config)
        .then((response) => {
          if (response.status == 200) {
            localStorage.setItem('sessionToken', response.data.sessionToken);
            localStorage.setItem('userId', response.data.userId);
            this.$store.dispatch('setUser', AuthService.getUser());
            this.$router.push({name: 'home'});
          }
      })
      .catch(error => console.log(error));
    },
  },
};
</script>
<style>
  .otp-input {
    width: 40px;
    height: 60px;
    padding: 5px;
    margin: 0 10px;
    font-size: 20px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    text-align: center;
    color: black;
  }
  /* Background colour of an input field with value */
  .otp-input.is-complete {
    background-color: #f8f8f8;
  }
  .otp-input::-webkit-inner-spin-button,
  .otp-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input::placeholder {
    font-size: 15px;
    text-align: center;
    font-weight: 600;
  }
</style>