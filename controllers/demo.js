/**
 * DemoCtrl
 */

angular.module("helpNow").controller("DemoCtrl", ["$scope", "DemoService", "Event", "EventLocation", "ResourceRequest", "$location",
    function ($scope, DemoService, Event, EventLocation, ResourceRequest , $location) {

        $scope.started = false;


        $scope.startDemo = function () {

            console.log("starting demo run");
            $scope.started = true;
            angular.forEach(demoData, function (item, key) {
                console.log("Going into switch: " + item.Type +":"+ item.ID);
                switch (item.Type) {
                    case "Event":
                    {
                        console.log("In Event Switch: " + item.Type +":"+ item.ID);

                        var event = angular.fromJson(item.Data);
                        console.log ("event data:" + event);
                        Event.save(event, function (data) {
                              var newEvent = data.json;
                            console.log(newEvent);


                            angular.forEach(event.EventLocations, function (item, key) {
                                console.log(key + ":" + item);
                                var eventLocation = event.EventLocations[key];
                                eventLocation.EventID = newEvent.EventID;

                                EventLocation.save(eventLocation, function (data) {
                                    var newEventLocation = data.json;
                                    console.log(newEventLocation);
                                });
                            });


                            angular.forEach(event.ResourceRequests, function (item, key) {
                                console.log(key + ":" + item);
                                var resourceRequest = event.ResourceRequests[key];
                                resourceRequest.EventID = newEvent.EventID;

                                ResourceRequest.save(resourceRequest, function (data) {
                                    var newResourceRequest = data.json;
                                    console.log(newResourceRequest);
                                });
                            });
                        });
                        break;
                    }

                    default:
                        console.log("I'm lost");
                }
            });
        };


        $scope.go = function (path) {
            $location.path(path);
        };


        var demoData = [


            {
                "ID": 1,
                "Type": "Event",
                "WaitTime": 0,
                "Data": {
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
                            "RequestStateID": 1,
                            "Notes": "Please help!",
                            "Quantity": 17,
                            "ResourceTypeID": 2,
                            "LAT": "39.739",
                            "LONG": "-104.990",
                            "RequestUrgencyID": 2,
                            "CreateDate": "2015-12-22 00:00:00",
                        },
                        {
                            "RequestStateID": 1,
                            "Notes": "Please help!",
                            "Quantity": 17,
                            "ResourceTypeID": 2,
                            "LAT": "39.739",
                            "LONG": "-104.990",
                            "RequestUrgencyID": 2,
                            "CreateDate": "2015-12-22 00:00:00",
                        }
                    ]
                }
            }
        ];
    }]);