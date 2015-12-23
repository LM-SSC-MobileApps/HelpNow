/**
 * DemoCtrl
 */

angular.module("helpNow").controller("DemoCtrl", ["$scope", "DemoService", "Event", "EventLocation", "$location",
    function ($scope, DemoService, Event, EventLocation, $location) {

        $scope.started = false;


        $scope.startDemo = function () {
            $scope.started = true;
            var event = demoData[0];

            Event.save(event, function (data) {
                $scope.newEvent = data.json;
                console.log($scope.newEvent);
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
                    "EventTypeID": 1,
                    "OrganizationID": 1,
                    "Summary": "Flood",
                    "Active": "true",
                    "CreateDate": "2015-12-22 00:00:00",
                    "EventLocations": [
                        {
                            "Description": "Dhaka, Bangladesh",
                            "LAT": "23.713",
                            "LONG": "90.39",
                            "Radius": 542
                        }
                    ]
                }
            }
        ];


        angular.forEach(demoData, function (item, key) {
            console.log(item.ID);
            console.log(item.Type);
            console.log(item.Data);
            switch (item.Type) {

                case "Event":
                {
                    console.log("I'm an event");
                    var event = angular.fromJson(item.Data);
                    var eventLocation = event.EventLocations[0];
                    Event.save(event, function (data) {
                        var newEvent = data.json;
                        console.log(newEvent);
                        eventLocation.EventID = newEvent.EventID;

                        EventLocation.save(eventLocation, function (data) {
                            var newEventLocation = data.json;
                            console.log(newEventLocation);
                        });

                    });


                    break;
                }
                default:
                    console.log("I'm lost");

            }

        });


    }]);