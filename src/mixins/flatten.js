export default {
  computed: {
    flattenedRows() {
      return this.flatten(this.groupedRows);
    },
  },

  methods: {
    async toggleChildren(row) {
      row._showChildren = !row._showChildren;

      if (!row._hasChildren) {
        return;
      }

      row._meta.loading = true;
      row._children = this.initRows(await this.callChildren(row), row);
      delete row._hasChildren;
      row._meta.loading = false;
    },

    flatten(rows) {
      return rows.reduce((acc, row) => {
        const isShowChildren = !!row?._showChildren;
        if (isShowChildren) {
          row._meta.visibleChildren.forEach((children) => {
            children._isChildren = true;
          });
        }
        const toContact =
          isShowChildren && row._meta.visibleChildren.length
            ? this.flatten(row._meta.visibleChildren)
            : [];
        return acc.concat([row, ...toContact]);
      }, []);
    },
  },
};
