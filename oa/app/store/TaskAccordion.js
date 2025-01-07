/*

 */

Ext.define('OA.store.TaskAccordion', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.TaskAccordion',
    requires: [
        'OA.model.History'
    ],
    config: {
        autoLoad: true,
        model: 'OA.model.History',
        defaultRootProperty: 'items',
        root: {items: []}
    }
});