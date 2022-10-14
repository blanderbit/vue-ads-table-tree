<template>
    <div class="vue-ads-table-tree">
        <div v-if="manageTableProperties" class="vue-ads-flex vue-ads-justify-end">
            <div v-click-outside="clickOutsideTablePropertiesArea">
                <i
                    @click="toggleTableProperties"
                    class="fa fa-sliders-h vue-ads-mr-4 vue-ads-mb-2 vue-ads-cursor-pointer"
                />
                <table-properties
                    v-if="isTablePropertiesVisible"
                    :content-classes="cssProcessor.classes.manageProperties"
                    :columns="initialColumns"
                    v-model="checkedColumns"
                    @setCheckedColumns="setCheckedColumns"
                />
            </div>
        </div>
        <div :class="{ 'vue-ads-fix-table-head': fixedTableHead }">
            <table
                :class="tableClasses"
                class="vue-ads-w-full vue-ads-font-sans"
            >
                <!-- TABLE HEADER -->
                <thead>
                    <tr :class="headerRowClasses">
                        <component
                            :class="{ resizable: columnsResizable }"
                            v-for="(column, key) in nonGroupedColumns"
                            :key="key"
                            :is="
                                column.isSlot ? 'vue-ads-header-cell-slot' : 'vue-ads-header-cell'
                            "
                            :column="column"
                            :column-index="key"
                            :css-processor="cssProcessor"
                            :sort-icon-slot="sortIconSlot"
                            :columns-resizable="columnsResizable"
                            @sort="sort"
                            @group="group"
                        >
                            <input v-if="column.isSlot" @change="emitEvent" type="checkbox" />
                        </component>
                    </tr>
                </thead>
                <!-- TABLE ROWS -->
                <tbody>
                    <tr v-if="infoVisible">
                        <td :class="infoClasses" :colspan="nonGroupedColumns.length">
                            <span v-if="loading">
                                <slot name="loading">Loading...</slot>
                            </span>
                            <span v-else>
                                <slot name="no-rows">No results found.</slot>
                            </span>
                        </td>
                    </tr>
                    <template v-else v-for="(row, rowKey) in flattenedRows">
                        <vue-ads-row
                            v-if="!row._meta.groupColumn"
                            :key="rowKey"
                            :row="row"
                            :row-index="rowKey"
                            :columns="nonGroupedColumns"
                            :slots="rowSlots"
                            :toggle-children-icon-slot="toggleChildrenIconSlot"
                            :css-processor="cssProcessor"
                            @toggle-children="toggleChildren(row)"
                            @click.native="selectRow($event, row, rowKey)"
                        />
                        <vue-ads-group-row
                            v-else
                            :key="rowKey"
                            :row-index="rowKey"
                            :row="row"
                            :slots="rowSlots"
                            :css-processor="cssProcessor"
                            :toggle-children-icon-slot="toggleChildrenIconSlot"
                            :colspan="columns.length"
                            @toggle-children="toggleChildren(row)"
                            @disable-group="group"
                            @sort="sort"
                        />
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import rows from '../mixins/rows';
import columns from '../mixins/columns';
import filter from '../mixins/filter';
import slots from '../mixins/slots';
import pagination from '../mixins/pagination';
import styling from '../mixins/styling';
import async from '../mixins/async';
import sort from '../mixins/sort';
import groupBy from '../mixins/groupBy';
import flatten from '../mixins/flatten';
import exportData from '../mixins/exportData';
import selection from '../mixins/selection';

import VueAdsHeaderCellSlot from './HeaderCellSlot';
import VueAdsHeaderCell from './HeaderCell';
import VueAdsRow from './Row.vue';
import VueAdsGroupRow from './GroupRow.vue';
import TableProperties from '@/components/TableProperties';

// Todo check if it's possible to increase the key only for non group rows
// => so even and odd non group rows have the same background
// Todo enable sort icon if column disapears or maybe also if it doesnt dissapear.
// Todo create slots for all new icons
// Todo create slots for header cells
// Todo check if you can add child rows reactive after some child rows are already initiated.
// Todo move sorting and grouping functionality to the wrapper => The result is a wrapper that have the components
// and a table with all the implemented features
// Todo toch sorten on unresolved data => to be sure the grouping will be well done.

export default {
    name: 'VueAdsTable',

    components: {
        TableProperties,
        VueAdsHeaderCell,
        VueAdsHeaderCellSlot,
        VueAdsRow,
        VueAdsGroupRow,
    },
    props: {
        manageTableProperties: {
            type: Boolean,
            default: false,
        },
        fixedTableHead: {
            type: Boolean,
            default: false,
        },
        columnsResizable: {
            type: Boolean,
            default: false,
        },
    },
    data: () => {
        return {
            isTablePropertiesVisible: false,
        };
    },
    mixins: [
        rows,
        columns,
        slots,
        selection,
        filter,
        sort,
        groupBy,
        pagination,
        flatten,
        styling,
        async,
        exportData,
    ],

    computed: {
        totalVisibleRows () {
            return this.flattenedRows.length;
        },

        infoVisible () {
            return this.totalVisibleRows === 0 || this.loading;
        },
    },

    watch: {
        totalVisibleRows: {
            handler: 'totalVisibleRowsChanged',
            immediate: true,
        },
    },

    methods: {
        clickOutsideTablePropertiesArea () {
            this.isTablePropertiesVisible = false;
        },

        toggleTableProperties () {
            this.isTablePropertiesVisible = !this.isTablePropertiesVisible;
        },

        totalVisibleRowsChanged (totalVisibleRows) {
            this.cssProcessor.totalRows =
        totalVisibleRows === 0 ? 2 : totalVisibleRows + 1;
        },

        //eslint-disable-next-line
        emitEvent ({ target: { checked }}) {
            this.$emit('checkbox-value-changed', checked);
        },
    },
};
</script>

<style>
.vue-ads-fix-table-head {
  overflow-y: auto;
  max-height: 380px;
}

.vue-ads-fix-table-head thead th {
  position: sticky;
  top: 0;
}

.resizable {
  resize: horizontal;
  overflow: auto;
}
</style>