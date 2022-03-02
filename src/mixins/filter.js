export default {
    props: {
        filter: {
            type: String,
            default: '',
        },
        exactMatch: {
            type: Boolean,
            default: false,
        },
    },

    watch: {
        filter: {
            handler: 'filterChanged',
            immediate: true,
        },
    },

    computed: {
        isFiltering () {
            return this.filter !== '' && this.filterColumnProperties.length > 0;
        },

        filterRegex () {
            return new RegExp(this.filter, 'i');
        },

        filteredCurrentRows () {
            return this.unresolved ? this.currentRows.filter(row => row) : this.currentRows;
        },

        filteredRows () {
            if (this.unresolved) {
                return this.filteredCurrentRows;
            }

            // Always execute because of the children filtering.
            const filteredRows = Array.from(this.filteredCurrentRows)
                .filter(this.rowMatch);

            if (this.isFiltering && this.exactMatch) {
                this.handleExactMatch(filteredRows);
            }

            if (this.isFiltering) {
                return filteredRows;
            }

            return this.filteredCurrentRows;
        },
    },

    methods: {
        async filterChanged () {
            this.clearSelection();

            this.totalFilteredRowsChanged(this.filteredRows.length);

            if (this.unresolved) {
                await this.handleUnresolved();
            }
        },

        handleExactMatch (filteredRows) {
            const exactMatchDictionary = new Map();
            let counter = 0;
            filteredRows
                .forEach((row, idx) => {
                    let index = idx;
                    if (row._exactMatch) {
                        index = counter;
                        counter++;
                    }
                    exactMatchDictionary.set(row, {
                        originalIndex: row._meta.index,
                        index,
                        _exactMatch: row._exactMatch,
                    });
                });

            let maxExactMatchIndex = null;
            exactMatchDictionary.forEach((value) => {
                if (value._exactMatch && maxExactMatchIndex <= value.index) {
                    maxExactMatchIndex = value.index;
                }
            });

            maxExactMatchIndex = maxExactMatchIndex + 1;
            exactMatchDictionary.forEach((value) => {
                if (!value._exactMatch) {
                    value.index = maxExactMatchIndex;
                    maxExactMatchIndex++;
                }
            });
            filteredRows.forEach((row) => {
                if (exactMatchDictionary.has(row)) {
                    const { index } = exactMatchDictionary.get(row);
                    row._meta.index = index;
                }
            });
        },

        totalFilteredRowsChanged (total) {
            this.$emit('total-filtered-rows-change', total);
        },

        rowMatch (row) {
            if (row === undefined) {
                return true;
            }

            row._meta.visibleChildren = row._children.filter(this.rowMatch);

            if (!this.isFiltering) {
                return true;
            }

            if (row._meta.visibleChildren.length > 0) {
                row._showChildren = true;

                return true;
            }

            const entities = Object.keys(row)
                .filter(rowKey => this.filterColumnProperties.includes(rowKey))
                .filter(filterKey => this.filterRegex.test(row[filterKey]));

            if (this.exactMatch) {
                entities.forEach(filterKey => {
                    row._exactMatch = row[filterKey].toString() === this.filter;
                    row._meta.filterProperty =
                        row[filterKey].toString() === this.filter
                            ? filterKey 
                            : null;
                });
            }
            return entities.length > 0;
        },
    },
};
