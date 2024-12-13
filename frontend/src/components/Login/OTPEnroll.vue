<template>
  <div v-if="this.$route.query.enroll">
    <p class="text-lg text-center sm:text-lg py-8 font-extrabold text-red-600">
      Register a new authenticator device
    </p>
    <qrcode-vue :value="otpPairingUrl" :size="400" level="H" v-if="otpPairingUrl" class="mx-auto"/>
    <button class="mt-7 w-full text-lg border-b-4 text-base bg-red-600 hover:bg-red-700 font-semibold text-white rounded-lg py-4 mb-4" @click="confirm()">Confirm</button>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'

import http from "../../../http-common";

export default {
  name: "OTPEnroll",
  components: {
    QrcodeVue,
  },
  data() {
    return {
        otpPairingUrl: false,
      }
  },
  created() {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('validationToken')}` }
    };

    http.post("/auth/otp/enroll", JSON.stringify({}), config)
      .then((response) => {
        if (response.status == 200) {
            this.otpPairingUrl = response.data.OTPPairingURL;
            console.log(this.otpPairingUrl)
        }
    })
    .catch(error => console.log(error));
  },
  methods: {
    confirm() {
      this.$router.push({ query: { validate: 'true' } })
    }
  },
};
</script>