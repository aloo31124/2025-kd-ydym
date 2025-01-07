Ext.define("OA.store.DeptTree", {
    extend: 'Ext.data.TreeStore',
    //alias: 'store.TreeStore',
    requires: ['OA.model.DeptTree'],
    config: {
        model: 'OA.model.DeptTree',
        proxy: {
            type: 'rest',
            useDefaultXhrHeader: false,
            withCredentials: true,
            headers: {
                'Accept': 'application/json'
            },
            reader: {
                type: 'json'
                //,rootProperty: 'children'
            }
        }
        //,search: function(criteria) {
        //    var fields = ['header', 'description', 'code'];
        //    return this.searchByFields(criteria, fields, true);
        //},
        //searchByCode: function(criteria){
        //    var fields = ['code'];
        //    return this.searchByFields(criteria, fields, false);
        //},
        //searchByFields: function(criteria, fields, fuzzy) {
        //    var rootNode = this.getRootNode();
        //    var subStore = this.getSubStore(rootNode);
        //    var results = new Array();
        //    this.searchStore(this, subStore, criteria, fields, results, fuzzy);
        //    return results;
        //},
        ///*
        // * Recursively search the tree by searching each
        // * flat substore at each node.
        // */
        //searchStore: function(aStore, aSubstore, criteria, fields, results, fuzzy){
        //    aSubstore.each(function(record){
        //        if(results.length >= Ingenix.views.SearchView.Limit){
        //            // Already exceeded the max so do not continue searching
        //            return false;
        //        }
        //
        //        var recordIsLeaf = false;
        //        var leaf = record.get('leaf');
        //        if(Ext.isDefined(leaf) && leaf == true){
        //            recordIsLeaf = true;
        //        }
        //        // we should only search the leaf nodes
        //        if(recordIsLeaf){
        //            var relevance = this.relevance(record, criteria, fields, fuzzy);
        //            if(relevance > 0){
        //                var instance = Ext.ModelMgr.create({
        //                    relevance: relevance,
        //                    record: record,
        //                }, 'SearchResults');
        //                results[results.length] = instance;
        //            }
        //        }
        //        else {
        //            //  need to recursively evaluate the children
        //            var subSubstore = aStore.getSubStore(record);
        //            this.searchStore(aStore, subSubstore, criteria, fields, results, fuzzy);
        //        }
        //
        //    }, this);
        //},
        //relevance: function(record, criteria, fields, fuzzy){
        //    /*
        //     * Tests each record against the following criteria:
        //     * Relevance    Check (all case insensitive)
        //     *    0.            Not found
        //     *     1.             Exact phrase
        //     *    2.            Starts with criteria
        //     *     3.             Contains criteria
        //     *    4.            Contains all words in criteria
        //     */
        //    var exactPhrase = new RegExp('\\b'+criteria+'\\b', '/i');
        //    if(this.testPattern(exactPhrase, record, fields)){
        //        return Relevance.EXACT_PHRASE;
        //    }
        //    if(fuzzy){
        //        var exactPhraseStart = new RegExp('\\b'+criteria, '/i');
        //        if(this.testPattern(exactPhraseStart, record, fields)){
        //            return Relevance.STARTS_WITH;
        //        }
        //        var containsPhrase = new RegExp(criteria, '/i');
        //        if(this.testPattern(containsPhrase, record, fields)){
        //            return Relevance.CONTAINS;
        //        }
        //        var keyWords = criteria.split(" ");
        //        var length = keyWords.length;
        //        if(length > 1){
        //            var allMatch = false;
        //            for(i=0; i<length; i++){
        //                var keywordPattern = new RegExp(keyWords[i], '/i');
        //                if(this.testPattern(keywordPattern, record, fields)){
        //                    allMatch = true;
        //                }
        //                else {
        //                    allMatch = false;
        //                    break;
        //                }
        //            }
        //            if(allMatch){
        //                return Relevance.CONTAINS_ALL;
        //            }
        //        }
        //    } // end if fuzzy
        //    return Relevance.NOT_FOUND;
        //},
        //testPattern: function(pattern, record, fields){
        //    // returns a boolean if the searched fields match the pattern
        //
        //    for(var index=0; index < fields.length; index++){
        //        var match = pattern.test(record.get(fields[index]));
        //        if(match){
        //            return true;
        //        }
        //    }
        //}
    }
});