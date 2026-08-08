import * as Vue from 'vue';

import './style.css';

globalThis.Vue = Vue;
const { createApp, h } = Vue;

async function bootstrap() {
    await new Promise((resolve, reject) => {
        const script = document.createElement('script');

        script.src = '/openvue.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });

    const { Config, Column, DataTable } = globalThis.OpenVue;
    const TOTAL_CUSTOMERS = 10_000;
    const CUSTOMERS_PER_GROUP = 200;
    const representatives = Array.from({ length: TOTAL_CUSTOMERS / CUSTOMERS_PER_GROUP }, (_, groupIndex) => `Representative ${String(groupIndex + 1).padStart(2, '0')}`);
    const countries = ['Germany', 'France', 'United Kingdom', 'Italy', 'Spain', 'Hungary'];
    const statuses = ['qualified', 'new', 'unqualified'];
    const rows = Array.from({ length: TOTAL_CUSTOMERS }, (_, index) => {
        const groupIndex = Math.floor(index / CUSTOMERS_PER_GROUP);
        const rowIndex = index % CUSTOMERS_PER_GROUP;

        return {
            id: index + 1,
            name: `Customer ${String(index + 1).padStart(5, '0')}`,
            representative: { name: representatives[groupIndex] },
            country: countries[index % countries.length],
            status: statuses[index % statuses.length],
            balance: `$${(rowIndex + 1) * 125}`
        };
    });
    const virtualScrollerOptions = { itemSize: 46 };

    const App = {
        setup() {
            return () =>
                h('main', { class: 'page' }, [
                    h('header', { class: 'intro' }, [
                        h('p', { class: 'eyebrow' }, 'OpenVue verification playground'),
                        h('h1', 'Issue #4109: grouped rows + virtual scrolling'),
                        h('p', 'This table has 10,000 loaded customers across 50 representative groups. Scroll through it and check that group headers remain aligned as rows are virtualized.'),
                        h('div', { class: 'metrics' }, [
                            h('span', `${rows.length.toLocaleString()} customers loaded`),
                            h('span', `${representatives.length} groups`),
                            h('span', 'VirtualScroller itemSize: 46px')
                        ])
                    ]),
                    h('section', { class: 'card' }, [
                        h(DataTable, {
                            value: rows,
                            rowGroupMode: 'subheader',
                            groupRowsBy: 'representative.name',
                            sortField: 'representative.name',
                            sortOrder: 1,
                            scrollable: true,
                            scrollHeight: '400px',
                            stripedRows: true,
                            virtualScrollerOptions,
                            tableStyle: { minWidth: '50rem' }
                        }, {
                            groupheader: ({ data }) =>
                                h('div', { class: 'group-header' }, [
                                    h('strong', data.representative.name),
                                    h('span', `${CUSTOMERS_PER_GROUP} customers`)
                                ]),
                            default: () => [
                                h(Column, { field: 'representative.name', header: 'Representative', style: { minWidth: '220px' } }),
                                h(Column, { field: 'name', header: 'Name', style: { minWidth: '220px' } }),
                                h(Column, { field: 'country', header: 'Country', style: { minWidth: '180px' } }),
                                h(Column, { field: 'status', header: 'Status', style: { minWidth: '160px' } }),
                                h(Column, { field: 'balance', header: 'Balance', style: { minWidth: '140px' } })
                            ]
                        })
                    ]),
                    h('p', { class: 'hint' }, 'Expected result: headers appear at the correct group boundaries while scrolling; there should be no blank rows or header drift.')
                ]);
        }
    };

    createApp(App).use(Config, { unstyled: true }).mount('#app');
}

bootstrap();
