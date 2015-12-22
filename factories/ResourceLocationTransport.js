angular.module('helpNow').factory('ResourceLocationTransport', function ($resource) {
    return $resource('api/resourcelocationtransport/:id', null, {
        update: {
            method: 'PUT'
        }
    });
});