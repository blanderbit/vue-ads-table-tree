import './assets/css/tailwind.css';

import Vue from 'vue';
import VueAdsTableContainer from './components/TableContainer';
import VueAdsTable from './components/Table';
import { appDirectives } from '@/directives';

// To make directives available in the library build.
Vue.use(appDirectives);

export default VueAdsTableContainer;
export { VueAdsTable };
