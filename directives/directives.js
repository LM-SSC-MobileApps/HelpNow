angular.module("helpNow").directive('showErrors', function () {
    return {
        restrict: 'A',
        require: '^form',
        link: function (scope, el, attrs, formCtrl) {
            // find the text box element, which has the 'name' attribute
            var inputEl = el[0].querySelector("[name]");
            // convert the native text box element to an angular element
            var inputNgEl = angular.element(inputEl);
            // get the name on the text box so we know the property to check
            // on the form controller
            var inputName = inputNgEl.attr('name');

            // only apply the has-error class after the user leaves the text box
            inputNgEl.bind('blur', function () {
                el.toggleClass('has-error', formCtrl[inputName].$invalid);
            });

            scope.$on('show-errors-check-validity', function () {
                el.toggleClass('has-error', formCtrl[inputName].$invalid);
            });
        }
    };
});

angular.module("helpNow").directive('latitude', function () {
    var LAT_REGEXP = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)/i;

    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$validators.latitude = function (modelValue, viewValue) {
                if (ctrl.$isEmpty(viewValue)) {
                    // not validating for empty value, only for valid
                    return true;
                }
                return LAT_REGEXP.test(viewValue);
            };
        }
    };
});

angular.module("helpNow").directive('longitude', function () {
    var LONG_REGEXP = /^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/i;

    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$validators.longitude = function (modelValue, viewValue) {
                if (ctrl.$isEmpty(viewValue)) {
                    // not validating for empty value, only for valid
                    return true;
                }
                return LONG_REGEXP.test(viewValue);
            };
        }
    };
});

angular.module("helpNow").directive("filters", function () {
    return {
        scope: {
            togglefunc: "=",
            classfunc: "="
        },
        templateUrl: 'views/fragments/resource-filters.html'
    };
});

angular.module("helpNow").directive('map', ['MapLayer', function (MapLayer) {
    return {
        link: function (scope, element, attrs) {
            var center = attrs.mapCenter.split(",");
            var zoom = attrs.mapZoom;
            var event = attrs.mapEvent;

            MapLayer.get({}, function (results) {
                var baseMapLayers = {};
                var overlayMapLayers = {};
                var baseMapLayer;
                var overlayMapLayer;

                var OWMAppId = '533e5eea3d1b3eb5d9616d2723cf4b6b';

                var clouds = L.OWM.clouds({ showLegend: true, opacity: 0.5, appId: OWMAppId });
                var cloudscls = L.OWM.cloudsClassic({ showLegend: true, opacity: 0.5, appId: OWMAppId });
                var precipitation = L.OWM.precipitation({ showLegend: true, opacity: 0.5, appId: OWMAppId });
                var precipitationcls = L.OWM.precipitationClassic({ showLegend: true, opacity: 0.5, appId: OWMAppId });
                var rain = L.OWM.rain({ showLegend: true, opacity: 0.5, appId: OWMAppId });
                var raincls = L.OWM.rainClassic({ showLegend: true, opacity: 0.5, appId: OWMAppId });
                var snow = L.OWM.snow({ showLegend: true, opacity: 0.5, appId: OWMAppId });
                var pressure = L.OWM.pressure({ showLegend: true, opacity: 0.5, appId: OWMAppId });
                var pressurecntr = L.OWM.pressureContour({ showLegend: true, opacity: 0.5, appId: OWMAppId });
                var temp = L.OWM.temperature({ showLegend: true, opacity: 0.5, appId: OWMAppId });
                var wind = L.OWM.wind({ showLegend: true, opacity: 0.5, appId: OWMAppId });
                var city = L.OWM.current({ intervall: 0, lang: 'en', appId: OWMAppId, temperatureUnit: 'F' });
                
                for (var i = 0; i < results.json.length; i++) {
                    var layer = results.json[i];
                    if (layer.MapLayerTypeID == 1 && (layer.EventID == event || layer.EventID == null)) {
                        if (layer.IsEsri == 1) {
                            var GBMREST = L.esri.tiledMapLayer({ url: layer.ImageryURL, attribution: layer.AttributionText });
                            baseMapLayers[layer.Name] = GBMREST;
                        }
                        else {
                            baseMapLayer = new L.tileLayer(
                                layer.ImageryURL, {
                                    attribution: layer.AttributionText,
                                    minZoom: layer.MinZoomLevel,
                                    maxZoom: layer.MaxZoomLevel
                                }
                            );
                            baseMapLayers[layer.Name] = baseMapLayer;
                        }
                    }
                    if (layer.MapLayerTypeID == 2 && (layer.EventID == event || layer.EventID == null)) {
                        if (layer.IsTSM == 1) {
                            overlayMapLayer = new L.tileLayer(
                                layer.ImageryURL, {
                                    attribution: layer.AttributionText,
                                    tms: true,
                                    minZoom: layer.MinZoomLevel,
                                    maxZoom: layer.MaxZoomLevel
                                }
                            );
                            overlayMapLayers[layer.Name] = overlayMapLayer;
                        }
                        else {
                            overlayMapLayer = new L.tileLayer(
                                layer.ImageryURL, {
                                    attribution: layer.AttributionText,
                                    minZoom: layer.MinZoomLevel,
                                    maxZoom: layer.MaxZoomLevel
                                }
                            );
                            overlayMapLayers[layer.Name] = overlayMapLayer;
                        }

                    }
                }

                overlayMapLayers["Precipitation"] = precipitationcls;
                overlayMapLayers["Pressure"] = pressure;
                overlayMapLayers["Temp"] = temp;
                overlayMapLayers["Wind"] = wind;
                overlayMapLayers["City Data"] = city;

                var map = new L.map('map', {
                    layers: [baseMapLayer],
                    maxBounds: [[-90.0, -180], [90.0, 180.0]]
                }).setView(center, zoom);

                L.control.scale().addTo(map);

                map.attributionControl.setPrefix('');

                L.control.layers(baseMapLayers, overlayMapLayers, null, {
                    collapsed: true
                }).addTo(map);

                map.addControl(new L.Control.Search({
                    url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
                    jsonpParam: 'json_callback',
                    propertyName: 'display_name',
                    propertyLoc: ['lat', 'lon'],
                    circleLocation: false,
                    markerLocation: false,
                    autoType: false,
                    autoCollapse: true,
                    minLength: 2,
                    zoom: 13
                }));

                if (scope.initMap) scope.initMap(map);
            });
        }
    };
}]);
