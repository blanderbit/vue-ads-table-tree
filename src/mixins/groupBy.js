// TODO how to handle grouped data for async data

import { interpolateStr } from '@/utils/utils';

export default {
    data () {
        return {
            groupRows: [],
        };
    },

    computed: {
        groupedRows () {
            if (this.paginatedRows.length === 0) {
                return this.paginatedRows;
            }

            // this.groupRows = [];
            return this.groupingRows(this.paginatedRows, 0);
        },
    },

    methods: {
        groupingRows (rows, groupColumnIndex) {
            if (groupColumnIndex === this.groupColumns.length) {
                return rows;
            }

            let column = this.groupColumns[groupColumnIndex];

            let previousValue = null;
            let groups = [];
            let groupedRows = [];
            let value;


            rows.forEach(row => {
                value = this.rowValue(row, column);

                if (previousValue === null) {
                    previousValue = value;
                }

                if (value !== previousValue) {
                    groups.push(this.createGroupRow(previousValue, column, groupedRows, groups.length, groupColumnIndex + 1));

                    previousValue = value;
                    groupedRows = [];
                }

                groupedRows.push(row);
            });

            groups.push(this.createGroupRow(value, column, groupedRows, groups.length, groupColumnIndex + 1));

            if (groupColumnIndex > 0) {
                groups.forEach(row => row._meta.groupParent += 1);
            }

            return groups;
        },

        rowValue (row, column) {
            let value = row[column.property];

            if (column.groupBy instanceof Function) {
                value = column.groupBy(value);
            }

            return value;
        },

        createGroupRow (value, column, groupedRows, groupLength, groupColumnIndex) {
            groupedRows.forEach(groupedRow => {
                groupedRow._meta.groupParent = groupColumnIndex;
            });
            groupedRows = this.groupingRows(groupedRows, groupColumnIndex);

            if (column.groupBy instanceof Function) {
                value = interpolateStr(value, {
                    rowsLength: groupedRows.length,
                });
            }
            
            let groupRow = {
                [column.property]: value,
                _children: groupedRows,
                _showChildren: true,
            };

            this.initRow(groupRow, 0, groupLength, column);
            this.groupRows.push(groupRow);

            return groupRow;
        },

        async group (column) {
            column.grouped = !column.grouped;
            if (!column.grouped) {
                //  If column is not grouped, but it was grouped previously, we need to reset groupParent value,
                //  that we set in `createGroupRow` method before, to avoid rows style issue after ungrouping.
                //  Based on `groupParent` value we add `padding-left` to rows (see the `parent` computed property in `cell.js` file)
                //  to show nesting level.
                this.rows.forEach((row) => {
                    if (row._meta.groupParent > 0) {
                        row._meta.groupParent = 0;
                    }
                });
            }
            column.direction = column.grouped ? !column.direction : null;
            column.order = this.maxSortOrder() + 1;

            // Todo For now, no async data
            // if (this.unresolved) {
            //     await this.handleUnresolved();
            // }
        },
    },
};
