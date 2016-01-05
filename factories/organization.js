angular.module('helpNow').factory('Organization', function ($resource) {
    return $resource("/api/organization/:id", null ,{
        update: {
            method: 'PUT'
        }
    });
});
