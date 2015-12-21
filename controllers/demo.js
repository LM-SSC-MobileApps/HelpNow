/**
 * DemoCtrl
 */

angular.module("helpNow").controller("DemoCtrl", ["$scope", "DemoService", "Event", "$location",
    function ($scope, DemoService, Event, $location) {

        $scope.started = false;


        $scope.startDemo = function () {
            // console.log($scope.started);
            $scope.started = true;
            var event = demoEvents[0];
            var eventResponse = Event.save(event);

        }

        $scope.createProduct = function (product) {
            $http.post(baseUrl, product).success(function (newProduct) {
                $scope.products.push(newProduct);
                $scope.displayMode = "list";
            });
        }

        $scope.go = function (path) {
            $location.path(path);
        };

        var demoEvents = [

            {
                "EventTypeID": 1,
                "OrganizationID": 1,
                "Summary": "Flood",
                "Active": "true"
            }
        ];

    }]);