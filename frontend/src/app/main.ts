import { createApp } from 'vue';
import { createNotivue } from 'notivue';
import { createPinia } from 'pinia';
import { PiniaColada } from '@pinia/colada';

import 'notivue/notification.css'; // Only needed if using built-in notifications
import 'notivue/animations.css'; // Only needed if using built-in animations

import App from './App.vue';
import router from './router';

import '@/assets/css/main.css';

const notivue = createNotivue({
    position: 'bottom-right',
    limit: 6,
    avoidDuplicates: true,
    notifications: {
        global: {
            duration: 10000,
        },
    },
});
const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
app.use(PiniaColada);
app.use(router);
app.use(notivue);

app.mount('#app');
