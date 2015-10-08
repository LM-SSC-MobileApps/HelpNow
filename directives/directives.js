angular.module("helpNow").directive('map', function () {
    return {
        link: function (scope, element, attrs) {
			var center = attrs.mapCenter.split(",");
			var zoom = attrs.mapZoom;
			
			var baseLayer = L.tileLayer(
              'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                  maxZoom: 18
              }
            );
			
			var map = new L.map('map', {
                layers: [baseLayer]
            }).setView(center, zoom);

            L.control.scale().addTo(map);

            if (scope.initMap) scope.initMap(map);
        }
    };
});