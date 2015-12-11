angular.module('helpNow').factory('Invitation', function ($resource) {
    return $resource('api/inviterequest/:inviteid', null ,{
        update: {
            method: 'PUT'
        }
    });
});





