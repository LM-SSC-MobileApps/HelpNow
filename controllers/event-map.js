var eventLat;
var eventLong;

angular.module("helpNow").controller("EventMapCtrl", function ($scope, $routeParams) {
    eventLat = $routeParams.lat;
    eventLong = $routeParams.long;
	$scope.setCurrentView("event-map");
	$scope.location = $routeParams.location;
	$scope.eventType = $routeParams.eventType;
	$scope.lat = $routeParams.lat;
	$scope.long = $routeParams.long;
	$scope.eventRadius = $routeParams.eventRadius;
	$scope.eventDate = $routeParams.eventDate;
	$scope.eventTime = $routeParams.eventTime;
	$scope.contactPhone = $routeParams.contactPhone;
});

angular.module("helpNow").directive('map', function () {
    return {
        scope: {
            location: '&location'
        },
        link: function (scope) {
            var testData = {
                max: 8,
                data: [{ lat: 24.6408, lng: 46.7728, count: 3 }, { lat: 23.7301, lng: 90.3065, count: 2 }]
            };

            var baseLayer = L.tileLayer(
              'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                  maxZoom: 18
              }
            );

            var cfg = {
                // radius should be small ONLY if scaleRadius is true (or small radius is intended)
                // if scaleRadius is false it will be the constant radius used in pixels
                "radius": 200,
                "maxOpacity": .8,
                // scales the radius based on map zoom
                "scaleRadius": false,
                // if set to false the heatmap uses the global maximum for colorization
                // if activated: uses the data maximum within the current map boundaries
                //   (there will always be a red spot with useLocalExtremas true)
                "useLocalExtrema": true,
                // which field name in your data represents the latitude - default "lat"
                latField: 'lat',
                // which field name in your data represents the longitude - default "lng"
                lngField: 'lng',
                // which field name in your data represents the data value - default "value"
                valueField: 'count'
            };


            var heatmapLayer = new HeatmapOverlay(cfg);

            var map = new L.map('map', {
                layers: [baseLayer/*, heatmapLayer*/]
            }).setView([eventLat, eventLong], 13);

            heatmapLayer.setData(testData);

            L.control.scale().addTo(map);

            map.on('click', function (e) {
                if (locationOutline != undefined) {
                    map.removeLayer(locationOutline);
                }
                locationOutline = L.circle(e.latlng, overlayRadius).addTo(map);
            });

            /*var buildingOutline = L.polygon([
              [39.557040,-105.165888],
              [39.554856,-105.163232],
              [39.555838,-105.161837],
              [39.557963,-105.164502]
            ]).addTo(map);
        
            buildingOutline.bindPopup("Non-Existant Deer Creek Facility");*/
        }
    };
});

