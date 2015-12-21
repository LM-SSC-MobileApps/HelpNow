angular.module('helpNow').factory('Event', function ($resource) {
    return $resource('api/event/:id', null ,{
        update: {
            method: 'PUT'
        }
    });
});
