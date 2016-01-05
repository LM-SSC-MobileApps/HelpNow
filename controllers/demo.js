/**
 * DemoCtrl
 */

angular.module("helpNow").controller("DemoCtrl", ["$scope", "$http", "Event", "EventLocation", "ResourceRequest", "$location" ,"ResourceLocation",
    function ($scope, $http, Event, EventLocation, ResourceRequest, $location ,ResourceLocation) {

        $scope.demoRunning = false;


        $http.get("data/scenario.json")
            .success(function (data) {
                $scope.scenarioData = data;
                console.log("Success loading scenario data: " + data);

            }).error(function (data) {
            console.log("Error loading scenario data:  " + data);
        });

        $scope.go = function ( path ) {
            $location.path( path );
        };



        $scope.startDemo = function () {

            console.log("starting demo run");
            $scope.demoRunning = true;

            angular.forEach($scope.scenarioData, function (item, key) {
                console.log("item.Type : " + item.Type);
                switch (item.Type) {

                    case "Event":
                    {
                        var event = angular.fromJson(item.Data);
                        Event.save(event, function (data) {
                            var newEvent = data.json;
                            console.log(newEvent);
                            angular.forEach(event.EventLocations, function (item, key) {
                                var eventLocation = event.EventLocations[key];
                                eventLocation.EventID = newEvent.EventID;
                                setTimeout(function () {
                                    EventLocation.save(eventLocation, function (data) {
                                        var newEventLocation = data.json;
                                        console.log(newEventLocation);
                                    });
                                }, event.WaitTime);
                            });

                            angular.forEach(event.ResourceRequests, function (item, key) {
                                console.log(key + ":" + item);
                                var resourceRequest = event.ResourceRequests[key];
                                resourceRequest.EventID = newEvent.EventID;
                                setTimeout(function () {
                                    ResourceRequest.save(resourceRequest, function (data) {
                                        var newResourceRequest = data.json;
                                        console.log(newResourceRequest);
                                    });
                                }, resourceRequest.WaitTime);
                            });

                            angular.forEach(event.ResourceLocations, function (item, key) {
                                var resourceLocation = event.ResourceLocations[key];
                                resourceLocation.EventID = newEvent.EventID;
                                setTimeout(function () {
                                    ResourceLocation.save(resourceLocation, function (data) {
                                        var newResourceLocation = data.json;
                                        console.log(newResourceLocation);
                                    });
                                }, resourceLocation.WaitTime);
                            });
                        });
                        break;
                    }
                    default:
                        console.log("I'm lost");
                }
            });

            $scope.demoRunning = false;
        };

    }]);
