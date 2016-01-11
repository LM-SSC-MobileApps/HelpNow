/**
 * DemoCtrl
 */

angular.module("helpNow").controller("DemoCtrl", ["$scope", "$http", "Event", "EventLocation", "ResourceRequest", "$location", "ResourceLocation",
    function ($scope, $http, Event, EventLocation, ResourceRequest, $location, ResourceLocation) {

        $scope.demoRunning = false;


        $scope.loadScenario = function () {
            $http.get("data/scenario.json")
                .success(function (data) {
                    $scope.scenarioData = data;
                    console.log("Success loading scenario data: " + data);

                }).error(function (data) {
                console.log("Error loading scenario data:  " + data);
            });
        };

        $scope.go = function (path) {
            $location.path(path);
        };


        $scope.loadScenario();

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
                                    var resourceRequest = event.ResourceRequests[key];
                                    resourceRequest.EventID = newEvent.EventID;
                                    var centerLat = parseFloat(resourceRequest.LAT);
                                    var centerLong = parseFloat(resourceRequest.LONG);
                                    var diameter = 0.5;
                                    setTimeout(function () {
                                        for (var i = 0; i < resourceRequest.NumberOfRequests; i++) {
                                            //populate lat
                                            var latRand = Math.random() * diameter;
                                            var relLat = latRand - diameter * 0.5;
                                            var lat = centerLat + relLat;

                                            //populate long
                                            var longRand = Math.random() * diameter;
                                            var relLong = longRand - diameter * 0.5;
                                            var lng = centerLong + relLong;

                                            resourceRequest.LAT = lat.toFixed(3);
                                            resourceRequest.LONG = lng.toFixed(3);
                                            console.log ("resourceRequest.LAT:" + resourceRequest.LAT);
                                            console.log ("resourceRequest.LONG:" + resourceRequest.LONG);

                                            //populate notes
                                            var notesRand = Math.random() * 10;
                                            var notes;
                                            if (notesRand < 3.33) notes = "Please help!";
                                            else if (notesRand > 6.66) notes = "Reported via Facebook";
                                            else notes = "Reported via Twitter";
                                            resourceRequest.Notes = notes;

                                            //populate quantity
                                            resourceRequest.Quantity = Math.round(Math.random() * 20);

                                            //populate resource type
                                            resourceRequest.ResourceTypeID = Math.round(Math.random() * 5) + 1;

                                            //populate urgency
                                            resourceRequest.RequestUrgencyID = Math.round(Math.random() * 5) + 1;

                                            ResourceRequest.save(resourceRequest, function (data) {
                                                var newResourceRequest = data.json;
                                                console.log(newResourceRequest);
                                            });

                                        }
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
                            }
                        );
                        break;
                    }
                    default:
                        console.log("I'm lost");
                }
            })
            ;

            $scope.demoRunning = false;
        }
        ;

    }])
;
