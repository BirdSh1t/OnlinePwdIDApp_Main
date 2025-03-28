import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router';


import '@fontsource/cooper-hewitt/400.css'; // Regular
import '@fontsource/cooper-hewitt/700.css'; // Bold
import '@fontsource/cooper-hewitt/800.css'; // Extra-Bold

import '@fontsource/inter/400.css'; // Regular
import '@fontsource/inter/700.css'; // Bold
import '@fontsource/inter/800.css'; // Extra-Bold

import '@fontsource/poppins/400.css'; // Regular
import '@fontsource/poppins/700.css'; // Bold
import '@fontsource/poppins/800.css'; // Extra-Bold

import '@fontsource/roboto/100.css'; /* Thin */
import '@fontsource/roboto/300.css'; /* Light */
import '@fontsource/roboto/400.css'; /* Regular */
import '@fontsource/roboto/500.css'; /* Medium */
import '@fontsource/roboto/700.css'; /* Bold */


import '@fontsource/work-sans/400.css'; // Regular
import '@fontsource/work-sans/700.css'; // Bold

import '@fontsource/montserrat/400.css'; // Regular
import '@fontsource/montserrat/700.css'; // Bold
import '@fontsource/montserrat/800.css'; // Extra-Bold

import '@fontsource/raleway/400.css'; // Regular
import '@fontsource/raleway/700.css'; // Bold

import '@fontsource/barlow/400.css'; // Regular
import '@fontsource/barlow/700.css'; // Bold




const app = createApp(App);
app.use(router);
app.mount('#app');




