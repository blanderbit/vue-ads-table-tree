import Vue from 'vue';

export default {
    computed: {
        flattenedRows () {
            return this.flatten(this.groupedRows);
        },
    },

    methods: {
        async toggleChildren (row) {
            row._showChildren = !row._showChildren;

            if (!row._hasChildren) {
                return;
            }

            row._meta.loading = true;
            row._children = this.initRows(await this.callChildren(row), row);
            Vue.delete(row, '_hasChildren');
            row._meta.loading = false;
        },

        flatten (rows) {
            return rows.reduce((flattenedRowsAcc, row) => {
                const showRowChildren = row._showChildren;
                if (showRowChildren) {
                    row._meta.visibleChildren.forEach((child) => {
                        child._isChildren = true;
                    });
                }
                const flattenedChildren =
                  showRowChildren && row._meta.visibleChildren.length
                      ? this.flatten(row._meta.visibleChildren)
                      : [];
                return flattenedRowsAcc.concat([
                    row,
                    ...flattenedChildren,
                ]);
            }, []);
        },
    },
};
