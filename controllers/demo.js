/**
 * DemoCtrl
 */

angular.module("helpNow").controller("DemoCtrl", ["$scope", "DemoService", "Event", "EventLocation", "ResourceRequest", "ResourceLocation" , "$location",
    function ($scope, DemoService, Event, EventLocation, ResourceRequest , ResourceLocation , $location) {

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

                            angular.forEach(event.ResourceLocations, function (item, key) {
                                console.log(key + ":" + item);
                                var resourceLocation = event.ResourceLocations[key];
                                resourceLocation.EventID = newEvent.EventID;

                                ResourceLocation.save(resourceLocation, function (data) {
                                    var newResourceLocation = data.json;
                                    console.log(newResourceLocation);
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
                    ],
                    "ResourceLocations": [
                        {
                            "OrganizationID": 2,
                            "ResourceLocationTypeID": 1,
                            "ResourceLocationStatusID": 1,
                             "Description": "Distribution Center A",
                            "Notes": "Note 1",
                            "LAT": 23.719999,
                            "LONG": 90.400002,
                        },
                        {
                            "OrganizationID": 2,
                            "ResourceLocationTypeID": 2,
                            "ResourceLocationStatusID": 2,
                            "Description": "Deployment A",
                            "Notes": "Note 2",
                            "LAT": 23.700001,
                            "LONG": 90.400002
                        }
                    ]
                }
            }
        ];
    }]);



