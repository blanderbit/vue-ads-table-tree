<script>

import CSSProcessor from '../services/CSSProcessor';
import sortCell from '../mixins/cell/sortCell';

export default {
    name: 'VueAdsHeaderCell',

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

        columnsResizable: {
            type: Boolean,
            default: false,
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
                {
                    'vue-ads-bg-white': true,
                },
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

        headerStyles () {
            const styles = {};
            if (this.column.width) {
                styles.width = `${this.column.width}px`;
            } 
            return styles;
        },
    },

    render (createElement) {
        const headerContent = [
            createElement(
                'span',
                {
                    class: {
                        'vue-ads-flex-grow': true,
                    },
                },
                [
                    this.title || this.column.title,
                ],
            ),
        ];

        if (this.sortable) {
            headerContent.push(this.sortIcon(createElement));
        }

        if (this.column.groupable && !this.column.grouped) {
            headerContent.push(createElement(
                'i',
                {
                    class: this.groupIconClasses,
                    on: {
                        click: (event) => {
                            event.stopPropagation();
                            this.$emit('group', this.column);
                        },
                    },
                }
            ));
        }

        return createElement(
            'th',
            {
                class: this.headerClasses,
                style: this.headerStyles,
            },
            [
                createElement(
                    'div',
                    {
                        class: {
                            'vue-ads-flex': true,
                            'vue-ads-mr-2': this.columnsResizable,
                        },
                        on: {
                            click: (event) => {
                                event.stopPropagation();
                                this.$emit('sort', this.column);
                            },
                        },
                    },
                    headerContent,
                ),
            ]
        );
    },
};
</script>
