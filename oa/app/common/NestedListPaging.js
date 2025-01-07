Ext.define('OA.common.NestedListPaging', {
    extend: 'Ext.plugin.ListPaging',
    alias: 'plugin.nestedlistpaging',


    config: {
        /**
         * @cfg {Ext.data.Store} store The store provided to the Ext.dataview.NestedList
         */
        store: null
    },


    /**
     * @private
     * Sets up all of the references the plugin needs
     */
    init: function (list) {
        var scroller = list.getScrollable().getScroller(),
            store = list.getStore();

        // if (list.hasLoadedStore) return;
        // this.setStore(store);

        this.setList(list);
        this.setScroller(scroller);
        this.bindStore(store);

        list.setScrollToTopOnRefresh(false);
        this.addLoadMoreCmp();

        // The List's Store could change at any time so make sure we are informed when that happens
        list.updateStore = Ext.Function.createInterceptor(list.updateStore, this.bindStore, this);

        // I added these two lines to fix some rendering issues with the load more component in 2.1.0.
        // I am not sure if these are required or what impact they will have in 2.1.1 or later
        // this.getLoadMoreCmp().setHeight(45); // The loadMoreCmp does not fully fit in the scrollable area after the second page is loaded, if the height is not explicitly set.
        // this.getLoadMoreCmp().show(); // Show the load more cmp be default because store.getCount() does not work in 2.1.0

        // We provide our own load mask so if the Store is autoLoading already disable the List's mask straight away,
        // otherwise if the Store loads later allow the mask to show once then remove it thereafter
        // if (store) {
        //     this.disableDataViewMask(store);
        // }

        if (this.getAutoPaging()) {
            scroller.on({
                scrollend: this.onScrollEnd,
                scope: this
            });
        }
    },


    /**
     * @private
     * Returns true if the Store is detected as being fully loaded, or the server did not return a total count, which
     * means we're in 'infinite' mode
     * @return {Boolean}
     */
    storeFullyLoaded: function () {
        var store = Ext.getStore(this.getStore());
        var total = store.getTotalCount();
        // if (!this.getLoading()) {
        var toolbar = this.getList().getParent()._toolbar;
        if (toolbar) {
            var p = toolbar.down('button[action=showpage]');
            p.setText('p.' + store.currentPage);
        }
        // }
        return total !== null ? total <= (store.currentPage * store.getPageSize()) : false;
    },


    /**
     * @private
     */
    loadNextPage: function () {
        var me = this;
        if (!me.storeFullyLoaded()) {
            me.setLoading(false);
            var store = Ext.getStore(me.getStore());
            var proxyType = store.getProxy().config.type;
            var page = store.currentPage + 1;
            var pageSize = store.getPageSize();
            var options = store.searchBy;
            options.page = page;
            options.start = (page - 1) * pageSize;
            options.limit = pageSize;
            if (proxyType != 'memory') {
                options.InputDep3.page = options.page;
                options.InputDep3.start = options.start;
                options.InputDep3.limit = options.limit;
                store.nextPage({params: options});
            } else {
                store.currentPage = page;
                var rows = OA.client.Member.getDep3Rows(options);
                store.setData(rows);
            }
        }
    }
});