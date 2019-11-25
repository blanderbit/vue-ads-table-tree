import Vue from 'vue';
import App from './GroupedTableApp';

Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
}).$mount('#app');
