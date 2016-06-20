angular.module('helpNow').factory('api_interceptor', function($cookies){
    return {
        // request: function (config) {
        //     config.headers = config.headers || {};
        //     config.headers.Authorization = 'Basic ' + btoa('a1ada5ab-b8c2-11e5-847d-00ffd0ea9272' + ':' + 'H3lpN0w2016');
        //
        //     config.headers.Authorization =
        //
        //     //if (authManager.authToken) {
        //     //    config.headers.Authorization = 'Basic ' + authManager.authToken;
        //     //}
        //     return config;
        // }
        'request': function (config) {
            config.headers = config.headers || {};
            if ($cookies.get('cookie.helpnowmap.org')) {
                config.headers.Authorization = 'JWT '+$cookies.get('cookie.helpnowmap.org');
            }
            return config;
        },
        'responseError': function (response) {
            if (response.status === 401 || response.status === 403) {
                $location.path('/login');
            }
            return $q.reject(response);
        }
    };
});

angular.module('helpNow').config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('api_interceptor');
}]);