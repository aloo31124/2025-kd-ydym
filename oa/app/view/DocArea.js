Ext.define('OA.view.DocArea', {
    id: 'docArea',
    extend: 'Ext.Container',
    xtype: "docArea",
    requires: [
        'OA.view.DocPaper',
        'OA.view.DocForm',
        'OA.view.DocWorkflow'],
    config: {
        layout: "card",
        ui: 'plain',
        items: [
            {
                xtype: 'docPaper'
            },
            {
                xtype: 'docForm'
            }
        ]
    }
});