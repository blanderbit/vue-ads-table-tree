export default {
    props: {
        filter: {
            type: String,
            default: '',
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
                .map((row, idx) => {
                    row._meta.originalIndex = idx;
                    return row;
                })
                .filter(this.rowMatch);

            const exactMatchRows = filteredRows
                .filter((row) => row._exactMatch);

            if (exactMatchRows.length) {
                exactMatchRows.forEach((row) => {
                    this.arrayMove(filteredRows, row._meta.originalIndex, 0);
                });
                // Set actual index, do not keep old value.
                filteredRows.forEach((_, idx) => {
                    filteredRows[idx]._meta.index = idx;
                });
            }

            if (this.isFiltering) {
                return filteredRows;
            }

            return this.filteredCurrentRows;
        },
    },

    methods: {
        arrayMove (arr, from, to) {
            let numberOfDeletedElm = 1;
            const elm = arr.splice(from, numberOfDeletedElm)[0];
            numberOfDeletedElm = 0;
            arr.splice(to, numberOfDeletedElm, elm);
            if (!arr[0]) {
                arr.splice(0, 1);
            }
        },

        async filterChanged () {
            this.clearSelection();

            this.totalFilteredRowsChanged(this.filteredRows.length);

            if (this.unresolved) {
                await this.handleUnresolved();
            }
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

            return Object.keys(row)
                .filter(rowKey => this.filterColumnProperties.includes(rowKey))
                .filter(filterKey => this.filterRegex.test(row[filterKey]))
                .map(filterKey => {
                    row._exactMatch = row[filterKey].toString() === this.filter;
                    row._meta.filterProperty =
                      row[filterKey].toString() === this.filter
                          ? filterKey 
                          : null;
                    return filterKey;
                })
                .length > 0;
        },
    },
};
