/**
 * Created by apple on 2014/8/7.
 */
Ext.define('OA.model.PaperInfo', {
    extend: 'Ext.data.Model',
    requires: ['OA.model.Attach'],
    config: {
        fields: [
            { name: "pid", type: "string"},
            { name: "di", type: "string"},
            { name: "form", type: "string"}
        ],
        hasMany: {model: 'OA.model.Attach', name: 'attachs'}
    }
});