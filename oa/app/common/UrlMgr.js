Ext.define('OA.common.UrlMgr', {
    alias: 'common.UrlMgr',
    singleton: true,
    config: {
        host: '',
        hostMake: '',
        token: '',
        domain: '' // 新增 domain 到 config
    },
    constructor: function (config) {
        this.initHost();
        this.initConfig(config);
        return this;
    },

    initHost: function () {
        var url_host = '';
        switch (KangDaAppConfig().environment) {
            case 'testing':
                url_host = KangDaAppConfig().useSSL ? KangDaAppConfig().host_testing_ssl : KangDaAppConfig().host_testing;
                break;
            case 'production':
                url_host = KangDaAppConfig().useSSL ? KangDaAppConfig().host_production_ssl : KangDaAppConfig().host_production;
                break;
            default:
                url_host = KangDaAppConfig().useSSL ? KangDaAppConfig().host_development_ssl : KangDaAppConfig().host_development;
        }

        var prefix = KangDaAppConfig().useSSL ? 'https://' : 'http://';
        var url = prefix + url_host;

        if (url_host.startsWith('.')) url = this.qualifyUrl(url_host);
        this.setHost(url);
        const domain = url.split("/rest/")[0] ? url.split("/rest/")[0] : '';
        this.setDomain(domain)

        var url_make = KangDaAppConfig().useSSL ? KangDaAppConfig().host_make_ssl : KangDaAppConfig().host_make;
        if (url_make.startsWith('.')) url_make = this.qualifyUrl(url_make);
        this.setHostMake(prefix + url_make);
    },

    restUrl: function (path, id) {
        return id ? `${this.getHost()}${path}/${id}` : `${this.getHost()}${path}`;
    },
    hostUrl: function () {
        return this.getHost()

    },
    qualifyUrl: function (url) {
        var element = document.createElement('a');
        element.href = url;
        return element.href;
    },

    getDocFlowUrl: function (data) {
        return Ext.String.format(
            '{0}?menuId={1}&sort={2}&roleId={3}',
            this.restUrl('docflow', data.jobNo),
            data.menu,
            data.sort,
            data.roleId
        );
    },

    getAttachUrl: function (sort, src) {
        return `${this.getHostMake()}${sort}/${src}`;
    },

    getToken: function () {
        return this.token || 'default_token';
    },

    getAjaxWorkFlow: function () {
        //return this.restUrl('') + '../workFlow/ajaxWorkFlow.jsp?q=1&method=getDataCollection&type=Odaf01&kind=2';
        return this.hostUrl() + '../workFlow/ajaxWorkFlow.jsp';
    },
    
    getDept: function (depNo, nodeType) {
        return this.restUrl('dept') + '/' + depNo + '?nodeType=' + nodeType+ '?online=2';
    },

    getEmps: function (data) {
        return Ext.String.format('{0}?empNo={1}&nodeType={2}',
            this.restUrl('emp', data.depNo), data.empNo, data.nodeType);
    },

    getCaseNo: function (depNo, doSno, yearNo) {
        if (doSno)
            return Ext.String.format('{0}?depNo={1}&doSno={2}&fsYear={3}', this.restUrl('editor', 'caseno'), depNo, doSno, yearNo);
        else
            return Ext.String.format('{0}?depNo={1}&fsYear={2}', this.restUrl('editor', 'caseno'), depNo, yearNo);
    },

    getSSO: function (ssoToken) {
        var queryString = '';
        if (ssoToken) queryString = '?ssoToken1=' + ssoToken;

        var prefix = KangDaAppConfig().useSSL ? 'https://' : 'http://';
        var url_host = KangDaAppConfig().useSSL ? KangDaAppConfig().host_ssoSvc_ssl : KangDaAppConfig().host_ssoSvc;
        var url = prefix + url_host;
        if (url.substring(0, 1) === '.') url = this.qualifyUrl(url_host);

        url = url + queryString;
        return url;
    },

    getSSOHome: function () {
        var prefix = KangDaAppConfig().useSSL ? 'https://' : 'http://';
        var url_host = KangDaAppConfig().useSSL ? KangDaAppConfig().host_ssoHome_ssl : KangDaAppConfig().host_ssoHome;
        var url = prefix + url_host;
        if (url.substring(0, 1) === '.') url = this.qualifyUrl(url_host);

        return url;
    }
});
