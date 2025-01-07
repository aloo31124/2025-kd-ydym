/**
 * Odaf31Stamp Client
 */

Ext.define('OA.client.Odaf31Stamp', {
    alias: 'client.Odaf31Stamp',
    singleton: true,
    requires: [
        'OA.model.Odaf31Stamp', 'OA.common.UrlMgr'
    ],
    config: {},
    constructor: function (config) {
        this.initConfig(config);
        return this;
    },

    /**
     * 登入 ， 異步返回 callback
     *
     * @param {Object} paras
     * @param {Function} callback
     */
    load: function (paras, callback) {
        var client = Ext.create('OA.model.Odaf31Stamp', paras);
        var params = { token: OA.common.UrlMgr.getToken() };
        client.getProxy().setUrl(OA.common.UrlMgr.restUrl('getOdaf31Stamp'));
        //console.log(params);
        client.getProxy().setExtraParams(params);
        client.save(callback);
    }
});