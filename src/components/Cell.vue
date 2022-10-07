<script>
import cell from '../mixins/cell/cell';

export default {
    name: 'VueAdsCell',

    mixins: [
        cell,
    ],

    render (createElement) {
        const spanContentValue = this.value(createElement);
        const hasSpanEmptyContent = spanContentValue.length === 1 && spanContentValue.includes('');
        const spanDomProps =  {};

        if (hasSpanEmptyContent) {
            spanDomProps.innerHTML = '&nbsp;';
        }
        
        const spanChildren = hasSpanEmptyContent ? [] : spanContentValue;
        return createElement(
            'td', {
                class: this.cellClasses,
                style: this.style,
            }, 
            [
                createElement('span', {
                    class: this.titleClasses,
                    on: this.clickEvents,
                    domProps: spanDomProps,
                }, spanChildren),
            ]
        );
    },
};
</script>

<style scoped>
td.selectedAndExactMatch {
  background-color: #EFF8C7;
}
</style>