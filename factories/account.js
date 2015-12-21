angular.module('helpNow').factory('Account', function ($resource) {
    return $resource('api/account/:id', null ,{
        update: {
            method: 'PUT'
        }
    });
});
