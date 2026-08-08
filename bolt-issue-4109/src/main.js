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

const representatives = ['Amy Elsner', 'John Smith', 'Maria Anders', 'Robert Brown', 'Sarah Davis'];
const rows = representatives.flatMap((representative, groupIndex) =>
    Array.from({ length: 20 }, (_, rowIndex) => ({
        id: groupIndex * 20 + rowIndex + 1,
        name: `Customer ${groupIndex * 20 + rowIndex + 1}`,
        representative: { name: representative },
        country: ['Germany', 'France', 'United Kingdom', 'Italy'][rowIndex % 4],
        status: ['qualified', 'new', 'unqualified'][rowIndex % 3],
        balance: `$${(rowIndex + 1) * 125}`
    }))
);

const virtualScrollerOptions = {
    itemSize: 44
};

const App = {
    setup() {
        return () =>
            h('main', { class: 'page' }, [
                h('header', { class: 'intro' }, [
                    h('p', { class: 'eyebrow' }, 'OpenVue verification playground'),
                    h('h1', 'Issue #4109: grouped rows + virtual scrolling'),
                    h('p', 'Scroll through the table and check that group headers remain aligned as rows are virtualized.')
                ]),
                h('section', { class: 'card' }, [
                    h(DataTable, {
                        value: rows,
                        rowGroupMode: 'subheader',
                        groupRowsBy: 'representative.name',
                        sortField: 'representative.name',
                        sortOrder: 1,
                        scrollable: true,
                        scrollHeight: '420px',
                        stripedRows: true,
                        virtualScrollerOptions,
                        tableStyle: { minWidth: '48rem' }
                    }, {
                        groupheader: ({ data }) =>
                            h('div', { class: 'group-header' }, [
                                h('strong', data.representative.name),
                                h('span', `${rows.filter((row) => row.representative.name === data.representative.name).length} rows`)
                            ]),
                        default: () => [
                            h(Column, { field: 'name', header: 'Customer' }),
                            h(Column, { field: 'country', header: 'Country' }),
                            h(Column, { field: 'status', header: 'Status' }),
                            h(Column, { field: 'balance', header: 'Balance' })
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
