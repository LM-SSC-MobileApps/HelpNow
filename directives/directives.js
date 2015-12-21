angular.module("helpNow").directive("filters", function () {
    return {
        scope: {
            togglefunc: "=",
            classfunc: "="
        },
        templateUrl: 'views/fragments/resource-filters.html'
    }
});

angular.module("helpNow").directive('map', function () {
    return {
        link: function (scope, element, attrs) {
            var center = attrs.mapCenter.split(",");
            var zoom = attrs.mapZoom;

            var api_key = 'pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImNpZjc5N3NiMTA5OXlzb2x6c3FyZHQ3cTUifQ.88yZYJc78Z2MAnkX2fOjuw';
            var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
			mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ';

            var grayscale = L.tileLayer(mbUrl, { id: 'mapbox.light', attribution: mbAttr }),
                streets = L.tileLayer(mbUrl, { id: 'mapbox.streets', attribution: mbAttr }),

                GBMREST = L.esri.tiledMapLayer({ url: 'https://services.digitalglobe.com/earthservice/gis/0688362c-8f94-4016-95c3-172c2ab72023/rest/services/DigitalGlobe:ImageryTileService/MapServer', attribution: 'DigitalGlobe Basemap, 2015' }),
                GBMWMS = L.tileLayer.wms('https://services.digitalglobe.com/mapservice/wmsaccess?connectid=0688362c-8f94-4016-95c3-172c2ab72023', { layers: 'DigitalGlobe:Imagery', format: 'image/png', transparent: true, attribution: 'DigitalGlobe 2015' }),
                EsriImagery = L.esri.tiledMapLayer({ url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer', attribution: 'Esri 2015' });

            /*var hybrid = new L.tileLayer('https://{s}.tiles.mapbox.com/v4/digitalglobe.n6nhclo2/{z}/{x}/{y}.png?access_token=' + api_key, {
			    minZoom: 2,
			    maxZoom: 19,
			    attribution: '(c) <a href="http://microsites.digitalglobe.com/interactive/basemap_vivid/">DigitalGlobe</a> , (c) OpenStreetMap, (c) Mapbox'
			});*/

            var vivid = new L.tileLayer('https://{s}.tiles.mapbox.com/v4/digitalglobe.n6ngnadl/{z}/{x}/{y}.png?access_token=' + api_key, {
                minZoom: 2,
                maxZoom: 19,
                attribution: '(c) <a href="http://microsites.digitalglobe.com/interactive/basemap_vivid/">DigitalGlobe</a>'
            });

            var street = new L.tileLayer('https://{s}.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + api_key, {
                minZoom: 2,
                maxZoom: 19,
                attribution: '(c) OpenStreetMap , (c) Mapbox'
            });

            var openStreetMap = new L.tileLayer(
              'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  attribution: mbAttr,
                  noWrap: true,
                  minZoom: 2,
                  maxZoom: 18
              }
            );

            var baseLayer = L.tileLayer('https://{s}.tiles.mapbox.com/v4/digitalglobe.n6nhclo2/{z}/{x}/{y}.png?access_token=' + api_key, {
                minZoom: 2,
                maxZoom: 19,
                attribution: '(c) <a href="http://microsites.digitalglobe.com/interactive/basemap_vivid/">DigitalGlobe</a> , (c) OpenStreetMap, (c) Mapbox'
            });

            var map = new L.map('map', {
                layers: [baseLayer],
                maxBounds: [[-90.0, -180], [90.0, 180.0]]
            }).setView(center, zoom);

            L.control.scale().addTo(map);

            map.attributionControl.setPrefix('');
            var overlays = {
                "Base Open Street Maps": openStreetMap,
                "DigitalGlobe Basemap +Vivid with Streets": baseLayer,
                "DigitalGlobe Basemap: REST": GBMREST
            };

            L.control.layers(overlays, null, {
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
        }
    };
});