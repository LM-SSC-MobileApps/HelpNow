angular.module('helpNow').factory('MapLayer', function ($resource) {
    return $resource('api/maplayer/', null, {
        update: {
            method: 'PUT'
        }
    });
});