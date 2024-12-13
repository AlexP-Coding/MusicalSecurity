import { createApp } from 'vue'
import App from './App.vue'
import { router, store } from './router'
import AuthService from './router/auth';


//Tailwind
import './input.css';

import './assets/main.css'

const app = createApp(App)


app.use(router)
app.use(store)

router.beforeEach(AuthService.authenticate);

app.mount('#app')
