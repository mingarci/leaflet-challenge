// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><hr><p>${feature.properties.mag}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };



  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

// Define a markerSize() function that will give each city a different radius based on its population.
function markerSize(mag) {
  return Math.sqrt(mag) * 50;
}


  
 // Loop through the cities array, and create one marker for each city object.
 for (var i = 0; i < cities.length; i++) {
  L.circle(properties[i].place, {
    fillOpacity: 0.75,
    color: "white",
    fillColor: "purple",
    // Setting our circle's radius to equal the output of our markerSize() function:
    // This will make our marker's size proportionate to its population.
    radius: markerSize(properties[i].m/15)
  }).bindPopup(`<h1>${properties[i].name}</h1> <hr> <h3>mag: ${properties[i].m.toLocaleString()}</h3>`).addTo(myMap);
}

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  
 

}
function createFeatures(earthquakeData) {
  function onEachFeature(feature, layer) {
      layer.bindPopup('<h4>Place: ' + feature.properties.place + '</h4><h4>Date: ' + new Date(feature.properties.time) + '</h4><h4>Magnitude: ' + feature.properties.mag + {maxWidth: 400})
  }

  const layerToMap = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: function(feature, latlng) {
          let radius = feature.properties.mag * 4.5;

          if (feature.properties.mag > 5) {
              fillcolor = '#f27b68';
          }
          else if (feature.properties.mag >= 4) {
              fillcolor = '#f79757';
          }
          else if (feature.properties.mag >= 3) {
              fillcolor = '#81f7ed';
          }
          else if (feature.properties.mag >= 2) {
              fillcolor = '#60a9bd';
          }
          else if (feature.properties.mag >= 1) {
              fillcolor = '#bcb0cf';
          }
          else  fillcolor = '#d0a9d6';

          return L.circleMarker(latlng, {
              radius: radius,
              color: 'black',
              fillColor: fillcolor,
              fillOpacity: 1,
              weight: 1
          });
      }
  });
  createMap(layerToMap);
}
/*Legend specific*/
var legend = L.control({ position: "bottomright" });

legend.onAdd = function(myMap) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Tegnforklaring</h4>";
  div.innerHTML += '<i style="background: #f27b68"></i><span>Water</span><br>';
  div.innerHTML += '<i style="background: #f79757"></i><span>Forest</span><br>';
  div.innerHTML += '<i style="background: #81f7ed"></i><span>Land</span><br>';
  div.innerHTML += '<i style="background: #60a9bd"></i><span>Residential</span><br>';
  div.innerHTML += '<i style="background: #bcb0cf"></i><span>Ice</span><br>';
  div.innerHTML += '<i style="background: #d0a9d6"></i><span>Ice</span><br>';
  
  
  

  return div;
};

legend.addTo(myMap);
