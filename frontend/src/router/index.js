import { createRouter, createWebHistory } from 'vue-router'
import { createStore } from 'vuex'

import MainPage from '../views/MainPage.vue'
import LoginView from '../views/LoginView.vue'
import SignUp from '../views/SignUp.vue'
import Product from '../views/Product.vue'
import Scoreboard from '../views/Scoreboard.vue'
import Reserve from '../views/Reserve.vue'
import Checkout from '../views/Checkout/Checkout.vue'
import PersonalInfo from '../views/Checkout/PersonalInfo.vue'
import PaymentCompleted from '../views/Checkout/PaymentCompleted.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainPage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/create-account',
      name: 'create-account',
      component: SignUp
    },
    {
      path: '/product/:id',
      name: 'product',
      component: Product
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: Checkout
    },
    {
      path: '/personal-info',
      name: 'personalInfo',
      component: PersonalInfo
    },
    {
      path: '/payment-completed',
      name: 'paymentCompleted',
      component: PaymentCompleted
    },
    {
      path: '/scoreboard',
      name: 'Scoreboard',
      component: Scoreboard
    },
    {
      path: '/reserve',
      name: 'Reserve',
      component: Reserve
    },
    /*{
         path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    } */
  ]
})

const store = createStore({
  state: {
      loggedIn: false,
      OTPEnrolled: false,
      user: {}
  },
  mutations: {
    changeState (state, payload) {
      state.loggedIn = payload;
    },
    changeOTPState (state, n) {
      state.OTPEnrolled = n;
    },
    changeUserInfo(state, payload) {
      state.user = payload
    }
  },
  actions: {
    setState(context, payload) {
      context.commit('changeState', payload)
    },
    setOTPState(context, payload) {
      context.commit('changeOTPState', payload)
    },
    setUser(context, payload) {
      context.commit('changeUserInfo', payload)
    }
},
  getters: {
    getState: function (state) {
        return state.loggedIn
    },
    getOTPState: function (state) {
        return state.OTPEnrolled
    },
    getUser: function (state) {
      return state.user
    }
  }
})

export {
  router,
  store
} 