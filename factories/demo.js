/**
 * Created by dsjennin on 12/18/2015.
 */


angular.module('helpNow').factory("DemoService",['$q',function($q){

    var worker = new Worker('doWork.js');
    var defer = $q.defer();
    worker.addEventListener('message', function(e) {
        console.log('Worker said: ', e.data);
        defer.resolve(e.data);
    }, false);

    return {
        doWork : function(myData){
            defer = $q.defer();
            worker.postMessage(myData); // Send data to our worker.
            return defer.promise;
        }
    };

}]);

