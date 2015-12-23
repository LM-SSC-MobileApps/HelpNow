/**
 * DemoCtrl
 */

angular.module("helpNow").controller("DemoCtrl", ["$scope", "DemoService", "Event", "EventLocation", "$location",
    function ($scope, DemoService, Event, EventLocation, $location) {

        $scope.started = false;


        $scope.startDemo = function () {
            $scope.started = true;
            angular.forEach(demoData, function (item, key) {
                switch (item.Type) {
                    case "Event":
                    {
                        var event = angular.fromJson(item.Data);
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
            }
        ];
    }]);