angular.module('helpNow').factory('ResourceLocationInventory', function ($resource) {
    return $resource('api/resourcelocationinventory/:id', null, {
        update: {
            method: 'PUT'
        }
    });
});