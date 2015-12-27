/**
 * DemoCtrl
 */

angular.module("helpNow").controller("DemoCtrl", ["$scope", "DemoService", "Event", "EventLocation", "ResourceRequest", "ResourceLocation", "$location",
    function ($scope, DemoService, Event, EventLocation, ResourceRequest, ResourceLocation, $location) {

        $scope.started = false;


        $scope.startDemo = function () {

            console.log("starting demo run");
            $scope.demoRunning = true;
            angular.forEach(demoData, function (item, key) {
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


        $scope.go = function (path) {
            $location.path(path);
        };


        var demoData = [
            {
                "ID": 1,
                "Type": "Event",
                "Data": {
                    "WaitTime": 0,
                    "EventTypeID": 3,
                    "OrganizationID": 1,
                    "Summary": "Denver, Colorado",
                    "Active": "true",
                    "CreateDate": "2015-12-22 00:00:00",
                    "EventLocations": [
                        {
                            "Description": "Denver, Colorado",
                            "LAT": "39.739",
                            "LONG": "-104.990",
                            "Radius": 542
                        }
                    ],
                    "ResourceRequests": [
                        {
                            "WaitTime": 3000,
                            "RequestStateID": 1,
                            "Notes": "Please help!",
                            "Quantity": 17,
                            "ResourceTypeID": 2,
                            "LAT": "39.739",
                            "LONG": "-104.990",
                            "RequestUrgencyID": 2,
                            "CreateDate": "2015-12-22 00:00:00"
                        },
                        {
                            "WaitTime": 3000,
                            "RequestStateID": 1,
                            "Notes": "Please help!",
                            "Quantity": 17,
                            "ResourceTypeID": 2,
                            "LAT": "39.739",
                            "LONG": "-104.990",
                            "RequestUrgencyID": 2,
                            "CreateDate": "2015-12-22 00:00:00"
                        }
                    ],
                    "ResourceLocations": [
                        {
                            "WaitTime": 6000,
                            "OrganizationID": 2,
                            "ResourceLocationTypeID": 1,
                            "ResourceLocationStatusID": 1,
                            "Description": "Distribution Center A",
                            "Notes": "Note 1",
                            "LAT": "39.739",
                            "LONG": "-104.990"
                        },
                        {
                            "WaitTime": 9000,
                            "OrganizationID": 2,
                            "ResourceLocationTypeID": 2,
                            "ResourceLocationStatusID": 2,
                            "Description": "Deployment A",
                            "Notes": "Note 2",
                            "LAT": "39.739",
                            "LONG": "-104.990"
                        }
                    ]
                }
            }
        ];
    }]);
