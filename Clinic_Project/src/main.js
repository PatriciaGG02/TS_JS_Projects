import { createApp } from 'vue';
import App from './App.vue';
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createPinia } from 'pinia';
import '@fortawesome/fontawesome-free/css/all.css'

library.add(faUserCircle);

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router);
app.use(createPinia())
app.mount('#app');
