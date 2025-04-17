import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'

// Optional Vuetify imports
//import 'vuetify/styles' // ✅ Required Vuetify base styles
import { createVuetify } from 'vuetify'

// Import vue-easy-lightbox
import VueEasyLightbox from 'vue-easy-lightbox'
import 'vue-easy-lightbox/dist/external-css/vue-easy-lightbox.css'

const vuetify = createVuetify({
  defaults: {
    global: {
      // This can help avoid some unwanted global overrides
      ripple: false,
    }
  },
  // You can use custom themes here if needed
})

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Import fonts
import '@fontsource/cooper-hewitt/400.css'
import '@fontsource/cooper-hewitt/700.css'
import '@fontsource/cooper-hewitt/800.css'

import '@fontsource/poppins/400.css'
import '@fontsource/poppins/700.css'
import '@fontsource/poppins/800.css'

import '@fontsource/roboto/100.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import '@fontsource/work-sans/400.css'
import '@fontsource/work-sans/700.css'

import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/700.css'
import '@fontsource/montserrat/800.css'

import '@fontsource/raleway/400.css'
import '@fontsource/raleway/700.css'

import '@fontsource/barlow/400.css'
import '@fontsource/barlow/700.css'

// ✅ This line should come AFTER you declare `app`
const app = createApp(App)

app.use(router)
// app.use(vuetify) // ✅ Uncomment if using Vuetify
app.use(vuetify)
app.use(Toast, {
    // Optional settings
    position: 'top-right',
    timeout: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    showCloseButtonOnHover: false,
  });

app.mount('#app')
