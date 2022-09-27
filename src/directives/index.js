import { clickOutside } from '@/directives/click-outside';

export const appDirectives = {
    install (Vue) {
        Vue.directive('click-outside', clickOutside);
    },
};