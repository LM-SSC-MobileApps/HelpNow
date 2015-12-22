/**
 * DemoCtrl
 */

angular.module("helpNow").controller("DemoCtrl", ["$scope", "DemoService", "Event", "$location",
    function ($scope, DemoService, Event, $location) {

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
                    "CreateDate": "2015-12-22 00:00:00"
                }
            },
            {
                "ID": 2,
                "Type": "EventLocation",
                "WaitTime": 2,
                "Data": {

                    "Description": "Dhaka, Bangladesh",
                    "LAT": "23.713",
                    "LONG": "90.39",
                    "Radius": 542
                }
            }

        ];


        angular.forEach(demoData, function (item, key) {
            console.log(item.ID);
            console.log(item.Type);
            switch (item.Type) {

                case "Event":
                {
                    console.log("I'm an event");
                    //TODO: Event.save goes here

                    break;
                }
                case "EventLocation":
                {
                    console.log("I'm an event location");
                    //TODO: EventLocation.save goes here...
                    break;
                }
                default:
                    console.log("I'm lost");

            }

        });


    }]);