import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 1. Import router-nya

const app = createApp(App)

app.use(router) // 2. Gunakan router-nya

app.mount('#app')