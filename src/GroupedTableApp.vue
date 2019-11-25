<template>
    <div
        id="app"
    >
        <vue-ads-table
            :columns="columns"
            :rows="rows"
        >
        </vue-ads-table>
    </div>
</template>

<script>
import './assets/css/tailwind.css';
import '../node_modules/@fortawesome/fontawesome-free/css/all.css';

import VueAdsTable from './components/Table';

export default {
    name: 'GroupedTableApp',

    components: {
        VueAdsTable,
    },

    data () {
        let rows = [
            {
                location: 'host.domain-1.com.',
                resource: 'resourceA',
            },
            {
                location: 'host.domain-2.com.',
                resource: 'resourceA',
            },
            {
                location: 'host.domain-2.com.',
                resource: 'resourceB',
            },
        ];
        let columns = [
            {
                property: 'location',
                title: 'Location',
                direction: null,
                groupable: true,
                hideOnGroup: false,
            },
            {
                property: 'resource',
                title: 'Resource',
                direction: null,
                groupable: true,
                hideOnGroup: false,
            },
        ];

        return {
            rows,
            columns,
        };
    },
};
</script>
