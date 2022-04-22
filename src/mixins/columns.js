export default {
  props: {
    columns: {
      type: Array,
      required: true,
    },
  },

  watch: {
    columns: {
      handler: "columnsChanged",
      immediate: true,
    },
  },

  computed: {
    visibleColumns() {
      return this.columns.filter((column) => column.visible);
    },

    columnProperties() {
      return this.visibleColumns.map((column) => column.property);
    },

    sortColumns() {
      return this.visibleColumns
        .filter(
          (column) =>
            Object.prototype.hasOwnProperty.call(column, "direction") &&
            column.direction !== null
        )
        .sort((columnA, columnB) => {
          if (columnA.grouped !== columnB.grouped) {
            return (!columnB.grouped | 0) - (!columnA.grouped | 0);
          }

          return columnA.grouped
            ? columnB.order - columnA.order
            : columnA.order - columnB.order;
        });
    },

    nonGroupedColumns() {
      return this.visibleColumns.filter(
        (column) =>
          !column.grouped || !column.hideOnGroup || column.collapseIcon
      );
    },

    groupColumns() {
      return this.visibleColumns
        .filter((column) => column.groupable && column.grouped)
        .sort((columnA, columnB) => columnA.order - columnB.order);
    },

    filterColumnProperties() {
      return this.visibleColumns
        .filter((column) => {
          return column.filterable;
        })
        .map((column) => column.property);
    },
  },

  methods: {
    columnsChanged(columns) {
      let maxSortOrder = this.maxSortOrder();

      columns.forEach((column) => {
        this.initColumn(column, maxSortOrder);
        if (column.order === maxSortOrder) {
          maxSortOrder++;
        }
      });

      if (columns.length > 0) {
        if (!columns.find((column) => column.collapseIcon)) {
          columns[0].collapseIcon = true;
        }
      }

      // todo check to remove this to the styling mixin
      this.cssProcessor.totalColumns = this.nonGroupedColumns.length;
    },

    initColumn(column, order) {
      if (typeof column.property !== "string") {
        column.property = "";
      }

      if (!Object.prototype.hasOwnProperty.call(column, "visible")) {
        column.visible = true;
      }

      if (!Object.prototype.hasOwnProperty.call(column, "export")) {
        column.export = true;
      }

      if (
        Object.prototype.hasOwnProperty.call(column, "order") ||
        Object.prototype.hasOwnProperty.call(column, "direction")
      ) {
        if (!Number.isInteger(column.order) || column.order < 0) {
          column.order = order;
        }

        if (!Object.prototype.hasOwnProperty.call(column, "direction")) {
          column.direction = null;
        }
      }

      if (!Object.prototype.hasOwnProperty.call(column, "groupable")) {
        column.groupable =
          Object.prototype.hasOwnProperty.call(column, "grouped") ||
          Object.prototype.hasOwnProperty.call(column, "groupBy") ||
          Object.prototype.hasOwnProperty.call(column, "groupCollapsable") ||
          Object.prototype.hasOwnProperty.call(column, "hideOnGroup");
      }

      if (
        column.groupable &&
        !Object.prototype.hasOwnProperty.call(column, "grouped")
      ) {
        column.groupable = false;
      }

      if (
        column.groupable &&
        !Object.prototype.hasOwnProperty.call(column, "groupCollapsable")
      ) {
        column.groupCollapsable = true;
      }

      if (
        column.groupable &&
        !Object.prototype.hasOwnProperty.call(column, "hideOnGroup")
      ) {
        column.hideOnGroup = !(column.groupBy instanceof Function);
      }
    },
  },
};
