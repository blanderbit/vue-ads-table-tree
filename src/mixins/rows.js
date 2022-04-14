import { v4 as uuid } from "uuid";
import { reactive } from "vue";

export default {
  props: {
    rows: {
      type: Array,
      default: () => [],
    },
    exactMatch: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    rows: {
      handler: "rowsChanged",
      immediate: true,
      deep: true,
    },
  },

  computed: {
    loadedRows() {
      return this.rows.filter((row) => row);
    },
  },

  methods: {
    rowsChanged(rows, oldRows, parent) {
      this.initRows(rows, parent);
    },

    initRows(rows, parent) {
      rows.forEach((row, index) => this.initRow(row, parent, index));
      rows
        .filter((row) => row._children.length > 0)
        .forEach((row) => this.rowsChanged(row._children, null, row));

      return rows;
    },

    initRow(row, parent, index, groupColumn = null) {
      if (this.exactMatch && !Object.hasOwnProperty.call(row, "_exactMatch")) {
        row._exactMatch = false;
      }

      if (!Object.hasOwnProperty.call(row, "_children")) {
        row._children = reactive([]);
      }

      if (!Object.hasOwnProperty.call(row, "_showChildren")) {
        row._showChildren = false;
      }

      if (!Object.hasOwnProperty.call(row, "_selectable")) {
        row._selectable =
          parent && Object.hasOwnProperty.call(parent, "_selectable")
            ? parent._selectable
            : !!this.selectable;
      }

      if (!Object.hasOwnProperty.call(row, "_meta")) {
        row._meta = {
          groupParent: 0,
          parent: parent && parent._meta ? parent._meta.parent + 1 : 0,
          uniqueIndex: uuid(),
          loading: false,
          visibleChildren: row._children,
          index,
          groupColumn,
          selected: false,
          originalIndex: index,
          exactMatchColumns: [],
        };
      }
    },
  },
};
