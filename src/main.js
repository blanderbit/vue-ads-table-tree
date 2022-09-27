import Vue from 'vue';
import App from './TableContainerApp';
import { appDirectives } from '@/directives';

Vue.config.productionTip = false;

Vue.use(appDirectives);

new Vue({
    render: h => h(App),
}).$mount('#app');
