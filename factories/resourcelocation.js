angular.module('helpNow').factory('ResourceLocation', function ($resource) {
    return $resource('api/resourcelocation/:id', null, {
        update: {
            method: 'PUT'
        }
    });
});