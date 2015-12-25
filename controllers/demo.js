/**
 * DemoCtrl
 */

angular.module("helpNow").controller("DemoCtrl", ["$scope", "DemoService", "Event", "EventLocation", "$location",
    function ($scope, DemoService, Event, EventLocation, $location) {

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
                        });
                        break;
                    }
                    case "ResourceRequest":
                    {

                        console.log("In Request Switch: " + item.Type +":"+ item.ID);
                        //var request = angular.fromJson(item.Data);
                        //console.log("Made it into resource request." + request);
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
                    ]
                }
            },
            {
                "ID": 2,
                "Type": "ResourceRequest",
                "WaitTime": 0,
                "Data": {
                    "RequestStateID": 1,
                    "Notes": "Please help!",
                    "Quantity": 17,
                    "ResourceTypeID": 2,
                    "LAT": "39.739",
                    "LONG": "-104.990",
                    "RequestUrgencyID": 2
                }
            }
        ];
    }]);