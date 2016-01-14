angular.module('helpNow').factory('api_interceptor',
    function () {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            config.headers.Authorization = 'Basic ' + btoa('a1ada5ab-b8c2-11e5-847d-00ffd0ea9272' + ':' + 'H3lpN0w2016');

            //if (authManager.authToken) {
            //    config.headers.Authorization = 'Basic ' + authManager.authToken;
            //}
            return config;
        }
    };
});

angular.module('helpNow').config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('api_interceptor');
}]);