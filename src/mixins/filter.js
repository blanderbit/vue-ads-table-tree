export default {
  props: {
    filter: {
      type: String,
      default: "",
    },
    exactMatch: {
      type: Boolean,
      default: false,
    },
    isExactMatchCaseSensitive: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    filter: {
      handler: "filterChanged",
      immediate: true,
    },
  },

  computed: {
    isFiltering() {
      return this.filter !== "" && this.filterColumnProperties.length > 0;
    },

    filterRegex() {
      return new RegExp(this.filter, "i");
    },

    filteredCurrentRows() {
      return this.unresolved
        ? this.currentRows.filter((row) => row)
        : this.currentRows;
    },

    filteredRows() {
      if (this.unresolved || !this.isFiltering) {
        return this.filteredCurrentRows;
      }

      const filteredRows = Array.from(this.filteredCurrentRows).filter(
        this.rowMatch
      );

      if (this.exactMatch) {
        this.handleExactMatch(filteredRows);
      }

      return filteredRows;
    },
  },

  methods: {
    async filterChanged() {
      this.totalFilteredRowsChanged(this.filteredRows.length);
      this.clearSelection();

      if (this.unresolved) {
        await this.handleUnresolved();
      }
    },

    handleExactMatch(filteredRows) {
      const matchDictionary = new Map();
      let exactMatchCounter = 0;
      filteredRows.forEach((row, idx) => {
        let index = idx;
        if (row._exactMatch) {
          index = exactMatchCounter;
          exactMatchCounter++;
        }
        matchDictionary.set(row, {
          index,
          _exactMatch: row._exactMatch,
        });
      });

      let maxExactMatchIndex = exactMatchCounter;
      matchDictionary.forEach((dictionaryValue) => {
        if (!dictionaryValue._exactMatch) {
          dictionaryValue.index = maxExactMatchIndex;
          maxExactMatchIndex++;
        }
      });

      filteredRows.forEach((row) => {
        if (matchDictionary.has(row)) {
          const { index } = matchDictionary.get(row);
          row._meta.index = index;
        }
      });
    },

    totalFilteredRowsChanged(total) {
      this.$emit("total-filtered-rows-change", total);
    },

    rowMatch(row) {
      if (row === undefined) {
        return true;
      }

      if (row._children.length) {
        row._meta.visibleChildren = row._children.filter(this.rowMatch);
      }

      if (!this.isFiltering) {
        return true;
      }

      const entities = Object.keys(row)
        .filter((rowKey) => this.filterColumnProperties.includes(rowKey))
        .filter((filterKey) => this.filterRegex.test(row[filterKey]));

      if (this.exactMatch) {
        entities.forEach((filterKey) => {
          const isExactMatch = this.isExactMatchCaseSensitive
            ? row[filterKey].toString() === this.filter
            : row[filterKey].toString().toLowerCase() ===
              this.filter.toLowerCase();
          row._exactMatch = isExactMatch;
          if (isExactMatch) {
            row._meta.exactMatchColumns.push(filterKey);
          }
        });
      }

      if (row._meta.visibleChildren.length > 0) {
        row._showChildren = true;
        return true;
      }

      return entities.length > 0;
    },
  },
};
