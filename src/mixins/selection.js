export default {
  props: {
    selectable: {
      type: String,
      validator: function (value) {
        if (value !== undefined) {
          return ["single", "multi"].indexOf(value) !== -1;
        }
        return true;
      },
    },
    exactMatch: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      firstSelectedRowIndex: null,
    };
  },

  computed: {
    multiSelect() {
      return this.selectable === "multi";
    },
  },

  methods: {
    clearSelection() {
      this.flatten(this.currentRows).forEach((row) => {
        row._meta.selected = false;
        this.resetExactMatch(row);
      });
    },

    resetExactMatch(row) {
      if (row._children.length) {
        row._children.forEach((childrenRow) => {
          this.resetExactMatch(childrenRow);
        });
      }

      if (row._meta.index !== row._meta.originalIndex) {
        row._meta.index = row._meta.originalIndex;
      }
      row._exactMatch = false;
    },

    selectRows(rows) {
      rows.forEach((row) => {
        if (row._selectable) {
          row._meta.selected = true;
        }
      });
    },

    selectRow(event, row) {
      if (!row._selectable) {
        return;
      }

      let flatten = this.isFiltering
        ? this.flatten(this.filteredRows)
        : this.flatten(this.currentRows);

      const areFlattenRowsHaveExactMatch = flatten.every(
        (flattenRow) => flattenRow._exactMatch
      )
        ? false
        : flatten.some((flattenRow) => flattenRow._exactMatch);

      if (this.exactMatch && this.isFiltering && areFlattenRowsHaveExactMatch) {
        flatten = this.reOrderFlattenRows(flatten);
      }

      if (event.shiftKey && this.multiSelect) {
        this.handleShiftKey(row, flatten);
      } else if (event.ctrlKey) {
        this.handleCtrlKey(row);
      } else {
        this.clearSelection();
        this.firstSelectedRowIndex = row._meta.uniqueIndex;
        row._meta.selected = true;
      }

      this.$emit(
        "selection-change",
        flatten.filter((row) => row._meta.selected)
      );
    },

    handleShiftKey(row, flatten) {
      const indexes = [row._meta.uniqueIndex, this.firstSelectedRowIndex];
      let minKey = flatten.findIndex(
        (row) => row._meta.uniqueIndex === indexes[0]
      );
      let maxKey = flatten.findIndex(
        (row) => row._meta.uniqueIndex === indexes[1]
      );
      const keys = [minKey, maxKey];
      [minKey, maxKey] = keys.sort((a, b) => a - b);
      this.clearSelection();
      this.selectRows(flatten.slice(minKey, maxKey + 1));
    },

    handleCtrlKey(row) {
      let oldSelected = row._meta.selected;
      if (!this.multiSelect) {
        this.clearSelection();
      }
      this.firstSelectedRowIndex = row._meta.uniqueIndex;
      row._meta.selected = !oldSelected;
    },

    reOrderFlattenRows(flatten) {
      // Since we use exactMatch and update row._meta.index,
      // to records with an exact match go first,
      // we need to re-order flatten array.
      // The rows that don't have children rows come first,
      // then come those that have ones.
      const childrenRows = flatten.filter(
        (row) => row._isChildren || row._children.length
      );
      const notChildrenRows = flatten.filter(
        (row) => !row._isChildren && !row._children.length
      );
      return [...notChildrenRows, ...childrenRows];
    },
  },
};
