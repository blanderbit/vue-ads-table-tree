<template>
    <div class="vue-ads-relative vue-ads-z-50">
        <div class="vue-ads-properties-card vue-ads-mt-3 vue-ads-absolute vue-ads-shadow-2xl" :class="contentClasses">
            <span>Properties</span>
            <div class="vue-ads-ml-3 vue-ads-mt-2 vue-ads-mr-2">
                <div class="vue-ads-mt-1 vue-ads-flex" v-for="column of transformedTablePropertyColumns" :key="column.property">
                    <input
                        v-model="selectedTablePropertyColumns"
                        type="checkbox"
                        :id="column.property"
                        :value="column.property"
                        :disabled="column.disabled"
                    >
                    <label
                        class="vue-ads-ml-2"
                        :for="column.property"
                    >
                        {{ column.shortTitle }}
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const COLUMN_TITLE_PROPERTY_LENGTH_LIMIT = 8;

export default {
    name: 'TableProperties',
    props: {
        columns: {
            type: Array,
            required: true,
        },
        contentClasses: {
            type: [
                String,
                Object,
            ],
            default: '',
        },
        value: {
            type: Array,
            required: true,
        },
    },
    data () {
        return {
            selectedTablePropertyColumns: [],
        };
    },
    computed: {
        transformedTablePropertyColumns () {
            return this.columns.map((column) => {
                // If the column is grouped or the last checked column from the list is left,
                // the column should be disabled.
                column.disabled =
                    column.grouped ||
                    (this.selectedTablePropertyColumns.length === 1 &&
                    this.selectedTablePropertyColumns[0] === column.property);
                column.shortTitle = column.title.length > COLUMN_TITLE_PROPERTY_LENGTH_LIMIT
                    ? `${column.title.slice(0, COLUMN_TITLE_PROPERTY_LENGTH_LIMIT)}...`
                    : column.title;
                return column;
            });
        },  
    },
    watch: {
        value: {
            handler (val) {
                this.selectedTablePropertyColumns = val;
            },
            immediate: true,
        },
        selectedTablePropertyColumns (val) {
            this.$emit('setCheckedTableProperties', val);
        },
    },
};
</script>

<style scoped>
.vue-ads-properties-card {
  right: 0.5rem;
  width: max-content;
}
</style>