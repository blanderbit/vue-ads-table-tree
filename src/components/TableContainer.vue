<template>
  <div>
    <slot name="top" :filter="filter" :filter-changed="filterChanged">
      <div class="vue-ads-flex vue-ads-py-3">
        <div class="vue-ads-w-3/4"></div>
        <div class="vue-ads-w-1/4 vue-ads-flex">
          <form
            :class="[filterClasses, 'vue-ads-font-sans']"
            :style="{ 'min-width': 0 }"
          >
            <div class="vue-ads-flex vue-ads-flex-wrap">
              <input
                :value="filter"
                placeholder="Filter..."
                type="text"
                class="vue-ads-p-2 vue-ads-border focus:vue-ads-shadow-form-focus vue-ads-outline-none vue-ads-rounded-sm vue-ads-text-grey-darkest vue-ads-text-sm vue-ads-flex-grow"
                @input="filterChanged($event.target.value)"
              />
            </div>
          </form>
        </div>
      </div>
    </slot>
    <vue-ads-table
      ref="table"
      :columns="columns"
      :rows="rows"
      :filter="debouncedFilter"
      :selectable="selectable"
      :exactMatch="exactMatch"
      :isExactMatchCaseSensitive="isExactMatchCaseSensitive"
      :start="start"
      :end="end"
      :classes="classes"
      :call-rows="callRowsFunction"
      :call-children="callChildrenFunction"
      :call-temp-rows="callTempRowsFunction"
      :slots="$slots"
      @total-filtered-rows-change="totalFilteredRowsChanged"
      @export="exportTable"
      @selection-change="selectionChanged"
      @checkbox-value-changed="checkboxValueChanged"
    >
      <template #loading>
        <slot name="loading"></slot>
      </template>
      <template #no-rows>
        <slot name="no-rows"></slot>
      </template>
    </vue-ads-table>
    <slot
      name="bottom"
      :total="total"
      :page="page"
      :itemsPerPage="itemsPerPage"
      :pageChanged="pageChanged"
      :rangeChanged="rangeChanged"
    >
      <VueAdsPagination
        :total-items="total"
        :page="page"
        :items-per-page="itemsPerPage"
        :with-input="withPageInput"
        @page-change="pageChanged"
        @range-change="rangeChanged"
      />
    </slot>
  </div>
</template>

<script>
import VueAdsPagination from "./Pagination";
import debounce from "../services/debounce";

import VueAdsTable from "./Table";

import defaultClasses from "../services/defaultClasses";

export default {
  name: "VueAdsTableContainer",

  components: {
    VueAdsTable,
    VueAdsPagination,
  },

  props: {
    columns: {
      type: Array,
      required: true,
    },

    rows: {
      type: Array,
      default: () => [],
    },

    filter: {
      type: String,
      default: "",
    },

    selectable: {
      type: String,
    },

    exactMatch: {
      type: Boolean,
      default: false,
    },

    isExactMatchCaseSensitive: {
      type: Boolean,
      default: false,
    },

    classes: {
      type: Object,
      default: () => defaultClasses,
    },

    callRows: {
      type: Function,
    },

    callTempRows: {
      type: Function,
    },

    callChildren: {
      type: Function,
    },

    debounceFilterTime: {
      type: Number,
      default: 500,
    },

    page: {
      type: Number,
      default: 0,
    },

    itemsPerPage: {
      type: Number,
      default: 10,
    },

    withPageInput: {
      type: Boolean,
      default: false,
    },

    exportName: {
      type: String,
      default: "",
    },

    fullExport: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      total: this.rows.length,
      start: null,
      end: null,
      debouncedFilter: this.filter,
      debounce: debounce(this.filterChange, this.debounceFilterTime),
      exportData: [],
      exportFields: {},
      exportTitle: "",
    };
  },

  watch: {
    rows: "rowsChanged",

    filter: {
      handler: "filterChanged",
      immediate: true,
    },
  },

  computed: {
    hasExport() {
      return this.exportName.length > 0;
    },

    filterClasses() {
      return {
        "vue-ads-flex-grow": true,
        "vue-ads-mr-2 ": this.hasExport,
      };
    },

    callRowsFunction() {
      return this.callRows || (() => []);
    },

    callTempRowsFunction() {
      return this.callTempRows || (() => []);
    },

    callChildrenFunction() {
      return this.callChildren || (() => []);
    },
  },

  methods: {
    rowsChanged() {
      this.total = this.rows.length;
    },

    filterChanged(filter) {
      if (this.callRows) {
        this.debounce(filter);
        return;
      }

      this.filterChange(filter);
    },

    async filterChange(filter) {
      this.debouncedFilter = filter;
      this.$emit("filter-change", filter);
      this.$emit("page-change", 0);
    },

    selectionChanged(rows) {
      this.$emit("selection-change", rows);
    },

    collectExportData() {
      this.$refs.table.exportTable(this.exportName, this.fullExport);
    },

    exportTable(exportData) {
      this.exportFields = exportData.fields;
      this.exportData = exportData.data;
      this.exportTitle = exportData.title;
    },

    pageChanged(page) {
      this.$emit("page-change", page);
    },

    rangeChanged(start, end) {
      this.start = start;
      this.end = end;
    },

    totalFilteredRowsChanged(total) {
      this.total = total;
    },

    checkboxValueChanged(checked) {
      this.$emit("checkbox-value-changed", checked);
    },
  },
};
</script>
