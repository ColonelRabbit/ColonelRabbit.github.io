console.log("hello");


var campus = {
    "type": "Feature",
    "properties": {
        "popupContent": "Roshen information and whatnot that pops up on clicking roshen",
        "style": {
            weight: 2,
            color: "#999",
            opacity: 1,
            fillColor: "#6908A5",
            fillOpacity: 0.1
        }
    },
    "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
            [
                [
                    [310, 370],
                    [290, 500],
                    [280, 510],
                    [260, 540],
                    [260, 580],
                    [295, 650],
                    [310, 700],
                    [290, 750],
                    [270, 780],
                    [255, 780],
                    [265, 820],
                    [255, 850],
                    [255, 865],
                    [280, 890],
                    [320, 930],
                    [350, 940],
                    [375, 950],
                    [400, 990],
                    [900, 990],
                    [900, 960],
                    [940, 920],
                    [940, 890],
                    [880, 840],
                    [860, 730],
                    [830, 630],
                    [790, 520],
                    [730, 440],
                    [680, 400],
                    [570, 450],
                    [520, 450],
                    [480, 400],
                    [400, 410],
                    [350, 390]
                ]
            ]
        ]
    }
};


var bicycleRental = {
    "type": "FeatureCollection",
    "features": [
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    224.9998241,
                    229.7471494
                ]
            },
            "type": "Feature",
            "properties": {
                "popupContent": "When you click on a place something will happen"
            },
            "id": 51
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    1000.9998241,
                    229.7471494
                ]
            },
            "type": "Feature",
            "properties": {
                "popupContent": "When you click on a place something will happen"
            },
            "id": 51
        }

    ]
};

var map = L.map('map', {
  crs: L.CRS.Simple,
  maxBounds: L.latLngBounds(L.latLng(0,250),L.latLng(1436,1648)),
  maxBoundsViscosity: 1,
  minZoom: -0.75,
  maxZoom: 1,
  zoomSnap: 0.25,
  zoomDelta: 0.25,
  wheelPxPerZoomLevel: 300
});


function onEachFeature(feature, layer) {
  var popupContent = "<p>I started out as a GeoJSON " +
      feature.geometry.type + ", but now I'm a Leaflet vector!</p>";
      popupContent = "";
  if (feature.properties && feature.properties.popupContent) {
    popupContent += feature.properties.popupContent;
  }

  layer.bindPopup(popupContent);
}


var yx = L.latLng;

var xy = function(x, y) {
  if (L.Util.isArray(x)) {    // When doing xy([x, y]);
    return yx(x[1], x[0]);
  }
  return yx(y, x);  // When doing xy(x, y);
};

var bounds = [xy(0, 0), xy(2048, 1536)];
var image = L.imageOverlay('./media/Map.jpg', bounds).addTo(map);

L.geoJSON([campus], {

		style: function (feature) {
			return feature.properties && feature.properties.style;
		},

		onEachFeature: onEachFeature,

		pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, {
				radius: 8,
				fillColor: "#ff7800",
				color: "#000",
				weight: 1,
				opacity: 1,
				fillOpacity: 0.8
			});
		}
	}).addTo(map);


//var sol      = xy(175.2, 145.0);
//var deneb    = xy(218.7,   8.3);

//var miria = xy(690,640);
//L.marker(miria).addTo(map).bindPopup('Miria');

//L.marker(     sol).addTo(map).bindPopup(      'Sol');
//L.marker(   deneb).addTo(map).bindPopup(    'Deneb');

//var travel = L.polyline([sol, deneb]).addTo(map);

map.setView(xy(1000, 700), -0.75);
