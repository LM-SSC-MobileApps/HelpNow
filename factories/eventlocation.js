angular.module('helpNow').factory('EventLocation', function ($resource) {
    return $resource('api/eventlocation/:id', null ,{
        update: {
            method: 'PUT'
        }
    });
});
