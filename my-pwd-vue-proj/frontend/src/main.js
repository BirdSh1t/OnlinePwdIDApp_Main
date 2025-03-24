import '@fontsource/cooper-hewitt/400.css'; // Regular
import '@fontsource/cooper-hewitt/700.css'; // Bold
import '@fontsource/cooper-hewitt/800.css'; // Extra-Bold

import '@fontsource/inter/400.css'; // Regular
import '@fontsource/inter/700.css'; // Bold
import '@fontsource/inter/800.css'; // Extra-Bold

import '@fontsource/poppins/400.css'; // Regular
import '@fontsource/poppins/700.css'; // Bold
import '@fontsource/poppins/800.css'; // Extra-Bold


import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router';

const app = createApp(App);
app.use(router);
app.mount('#app');




