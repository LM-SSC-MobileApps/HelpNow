/**
 * DemoCtrl
 */

angular.module("helpNow").controller("DemoCtrl", ["$scope", "$http", "ResourceRequest", "$location", "ResourceLocation",
    function ($scope, $http, ResourceRequest, $location, ResourceLocation) {

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
            $scope.demoRunning = true;
            angular.forEach($scope.scenarioData, function (item, key) {
                switch (item.Type) {
                    case "ResourceRequest":
                    {
                        var resourceRequest = angular.fromJson(item.Data);
                        var centerLat = parseFloat(resourceRequest.LAT);
                        var centerLong = parseFloat(resourceRequest.LONG);
                        var diameter = 0.5;

                        var saveRequest = function (i, resourceRequest) {
                            setTimeout(function () {
                                ResourceRequest.save(resourceRequest, function (data) {
                                    var newResourceRequest = data.json;
                                    console.log(newResourceRequest);
                                    console.log(i);
                                });
                            }, i * resourceRequest.WaitTime);
                        };

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
                                    //resourceRequest.RequestUrgencyID = Math.round(Math.random() * 5) + 1;

                                    saveRequest(i, resourceRequest);

                                }
                            }, resourceRequest.WaitTime
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
