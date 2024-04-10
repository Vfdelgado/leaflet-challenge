// Create a map instance
let myMap = L.map('map', {center: [37, -95], zoom: 4});

// Add the base tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Function to determine marker color based on depth
function getColor(depth) {
    return depth > 90 ? '#800026' :
           depth > 70 ? '#BD0026' :
           depth > 50 ? '#E31A1C' :
           depth > 30 ? '#FC4E2A' :
           depth > 10 ? '#FD8D3C' :
                        '#FEB24C';
}

// Fetch GeoJSON data and add it to the map
d3.json(url).then(function(data) {
    L.geoJSON(data.features, {
        pointToLayer: function(feature, latlng) {
            // Determine marker size based on magnitude
            let markerSize = feature.properties.mag * 5;

            // Determine marker color based on depth
            let depth = feature.geometry.coordinates[2];
            let markerColor = getColor(depth);

            // Marker styling
            let markerOptions = {
                radius: markerSize,
                fillColor: markerColor,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };

            return L.circleMarker(latlng, markerOptions).bindPopup(`
                <h3>Magnitude: ${feature.properties.mag}</h3>
                <p>Location: ${feature.properties.place}</p>
                <p>Depth: ${feature.geometry.coordinates[2]} km</p>
            `);
        }
    }).addTo(myMap);

    // Create a legend control
    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function(map) {
        let div = L.DomUtil.create('div', 'info legend');
        div.innerHTML += '<h4>Earthquake Depth</h4>'; // Title for the legend
        let depthColors = ['#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];
        let depthLabels = ['0 - 10', '10 - 30', '30 - 50', '50 - 70', '70 - 90', '> 90'];

        for (let i = 0; i < depthColors.length; i++) {
            div.innerHTML +=
                '<i style="background:' + depthColors[i] + '; width: 20px; height: 20px; display: inline-block;"></i> ' +
                depthLabels[i] + '<br>';
        }
        return div;
    };

    // Add legend to the map
    legend.addTo(myMap);
});
