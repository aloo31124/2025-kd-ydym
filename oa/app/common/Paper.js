Ext.define('OA.common.Paper', {
    singleton: true,
    alias: 'common.Paper',
    constructor: function () {
        var map = {};

        // The sole reason for this is just to support the old code of ComponentQuery
        this.all = {
            map: map,

            getArray: function () {
                var list = [],
                    id;

                for (id in map) {
                    if (map.hasOwnProperty(id)) {
                        list.push(map[id]);
                    }
                }
                return list;
            }
        };

        this.map = map;
    },

    /**
     * Registers an item to be managed.
     * @param {Object} component The item to register.
     */
    register: function (component) {
        var id = component.getId();

        // <debug>
        // if (this.map[id]) {
        //     Ext.Logger.warn('Registering a component with a id (`' + id + '`) which has already been used. Please ensure the existing component has been destroyed (`Ext.Component#destroy()`.');
        // }
        // </debug>

        this.map[component.getId()] = component;
    },

    /**
     * Unregisters an item by removing it from this manager.
     * @param {Object} component The item to unregister.
     */
    unregister: function (component) {
        delete this.map[component.getId()];
    },

    /**
     * Checks if an item type is registered.
     * @param {String} component The mnemonic string by which the class may be looked up.
     * @return {Boolean} Whether the type is registered.
     */
    isRegistered: function (component) {
        return this.map[component] !== undefined;
    },

    /**
     * Returns an item by id.
     * For additional details see {@link Ext.util.HashMap#get}.
     * @param {String} id The `id` of the item.
     * @return {Object} The item, or `undefined` if not found.
     */
    get: function (id) {
        return this.map[id];
    },

    main: function () {
        return this.map['cpaper'] || Ext.getCmp('cpaper');
    },
    /**
     * Creates a new Component from the specified config object using the
     * config object's `xtype` to determine the class to instantiate.
     * @param {Object} component A configuration object for the Component you wish to create.
     * @param {Function} [defaultType] The constructor to provide the default Component type if
     * the config object does not contain a `xtype`. (Optional if the config contains an `xtype`).
     * @return {Ext.Component} The newly instantiated Component.
     */
    create: function (component, defaultType) {
        if (component.isComponent) {
            return component;
        }
        else if (Ext.isString(component)) {
            return Ext.createByAlias('widget.' + component);
        }
        else {
            var type = component.xtype || defaultType;

            return Ext.createByAlias('widget.' + type, component);
        }
    },

    registerType: Ext.emptyFn,

    getActiveStatus: function () {
        var area = Ext.getCmp('docArea');
        var isDocForm = area && area.getActiveItem().config.xtype == 'docForm';
        if (isDocForm) {
            return area.getActiveItem().getStatus();
        } else {
            var ctr = this.main() || Ext.getCmp('cpaper');
            return ctr.getStatus();
        }
    },
    setActiveStatus: function (status) {
        var area = Ext.getCmp('docArea');
        var isDocPaper = area.getActiveItem().config.xtype == 'docPaper';
        var isDocForm = area.getActiveItem().config.xtype == 'docForm';
        if (isDocForm) {
             area.getActiveItem().setStatus(status);
        } else {
            var ctr = this.main() || Ext.getCmp('cpaper');
            ctr.setStatus(status);
        }
    },
    getActiveFields: function () {
        var area = Ext.getCmp('docArea');
        if (!area) return;
        var ctr = this.main() || area.getActiveItem();
        var fields = null;
        if (ctr.getFields) fields = ctr.getFields();
        return fields;
    }
});

