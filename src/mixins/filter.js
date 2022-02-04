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
            let filteredRows = Array.from(this.filteredCurrentRows)
                .filter(this.rowMatch)
                .map((row, idx) => ({
                    ...row,
                    _meta: {
                        ...row._meta,
                        originalIndex: idx,
                    },
                }));

            const exactMatchRows = filteredRows
                .filter((row) => row.exactMatch);

            if (exactMatchRows.length) {
                exactMatchRows.forEach((row) => {
                    const rowMeta = row._meta;
                    this.arrayMove(filteredRows, rowMeta.originalIndex, 0);
                    filteredRows[0]._meta.index = 0;
                    filteredRows[rowMeta.originalIndex]._meta.index = rowMeta.originalIndex;
                });
            }

            if (this.isFiltering) {
                return filteredRows;
            }

            return this.filteredCurrentRows;
        },
    },

    methods: {
        arrayMove (input, from, to) {
            let numberOfDeletedElm = 1;
            const elm = input.splice(from, numberOfDeletedElm)[0];
            numberOfDeletedElm = 0;
            input.splice(to, numberOfDeletedElm, elm);
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
                    row.exactMatch = row[filterKey] === this.filter;
                    return filterKey;
                })
                .length > 0;
        },
    },
};
