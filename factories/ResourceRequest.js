angular.module('helpNow').factory('ResourceRequest', function ($resource) {
    return $resource('api/resourcerequest/:id', null ,{
        update: {
            method: 'PUT'
        }
    });
});
