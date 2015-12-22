angular.module('helpNow').factory('ResourceLocationType', function ($resource) {
    return $resource('api/resourcelocationtype/:id', null, {
        update: {
            method: 'PUT'
        }
    });
});