/**
 * User Client
 */

Ext.define('OA.client.DocFlow', {
    alias: 'client.DocFlow',
    singleton: true,
    requires: [
        'OA.model.DocFlow', 'OA.common.UrlMgr'
    ],
    config: {},
    constructor: function (config) {
        this.initConfig(config);
        return this;
    },
    /**
     *
     * @param {Function} menuId
     * @param {Function} data
     * @param {Function} callback
     */
    load: function (menuId, data, callback) {
        var sotreCase = Ext.getStore('DocFlow');
        sotreCase.currentPage = 1;
        sotreCase.getProxy().setUrl(OA.common.UrlMgr.getDocFlowUrl(menuId, data));
        sotreCase.getProxy().setExtraParams({token: OA.common.UrlMgr.getToken()});
        sotreCase.load(callback); //Get /docflow/{jobNo}
    },
    /**
     *
     * @param {String} menu
     * @param {Function} options
     * @param {Function} scope
     */
    loadMenu: function (menu, options, scope) {
        var me = this;
        options = options || {};

        if (Ext.isFunction(options)) {
            options = {
                callback: options,
                scope: scope || this
            };
        }

        var data = OA.common.Global.getCurrentRole();
        
        data.menu = menu;
        data.sort = options.sort;

        var sotreCase = Ext.getStore('DocFlow');
        sotreCase.currentPage = 1;
        sotreCase.getProxy().setUrl(OA.common.UrlMgr.getDocFlowUrl(data));
        sotreCase.getProxy().setExtraParams({token: OA.common.UrlMgr.getToken()});
        sotreCase.load(options); //Get /docflow/{jobNo}

        return me;
    }
});