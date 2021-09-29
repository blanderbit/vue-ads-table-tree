<template>
    <th :class="headerClasses">
        <div class="vue-ads-flex">
            <slot></slot>
        </div>
    </th>
</template>

<script>
import CSSProcessor from '../services/CSSProcessor';
import sortCell from '../mixins/cell/sortCell';

export default {
    name: 'VueAdsHeaderCellSlot',

    mixins: [
        sortCell,
    ],

    props: {
        title: {
            type: String,
            default: '',
        },

        column: {
            type: Object,
            default: () => {
                return {
                    title: '',
                    direction: null,
                };
            },
        },

        columnIndex: {
            type: Number,
            required: true,
        },

        cssProcessor: {
            type: CSSProcessor,
            required: true,
        },
    },

    computed: {
        headerClasses () {
            return Object.assign(
                {
                    'vue-ads-cursor-pointer': [
                        null,
                        true,
                        false,
                    ].includes(this.column.direction) && this.sortable,
                },
                this.cssProcessor.process(null, this.columnIndex),
                this.cssProcessor.process(0, this.columnIndex),
            );
        },

        groupIconClasses () {
            if (!this.column.groupable) {
                return {};
            }

            return {
                fa: true,
                'vue-ads-ml-2': true,
                'fa-stream': !this.column.grouped,
            };
        },
    },
};
</script>