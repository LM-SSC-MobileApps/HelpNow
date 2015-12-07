angular.module('helpNow').factory('Regulation', function ($resource) {
    return $resource('api/organizationregulation/:id', null ,{
     update: {
         method: 'PUT'
     }
    });
});


