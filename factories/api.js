angular.module('helpNow').factory('api_interceptor', function($cookies, $location){
    return {
        'request': function (config) {
            config.headers = config.headers || {};
            if ($cookies.get('cookie.helpnowmap.org')) {
                config.headers.Authorization = 'JWT '+$cookies.get('cookie.helpnowmap.org');
            }
            return config;
        },
        'responseError': function (response) {
            if (response.status === 401 || response.status === 403) {
                alert("Unauthorized.  ");
                $location.path('/login');
            }
            return response;
        }
    };
});

angular.module('helpNow').config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('api_interceptor');
}]);