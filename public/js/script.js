const socket = io();
const markers = {};

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        console.log("Sending location: ", { latitude, longitude }); // Log the sent location
        socket.emit("send-location", { latitude, longitude });
    }, (error) => {
        console.error("Geolocation error: ", error);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });
}

const map = L.map('map').setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap"
}).addTo(map);

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;

    console.log("Received location: ", { id, latitude, longitude }); // Log the received location

    
        // map.setView([latitude, longitude]);
        if (markers[id]) {
            markers[id].setLatLng([latitude, longitude]); // Correct method name here
        } else {
            markers[id] = L.marker([latitude, longitude]).addTo(map);
        }
    
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});

function isValidLatLng(latitude, longitude) {
    const valid = typeof latitude === 'number' && typeof longitude === 'number' &&
                  latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
    console.log(`Is valid LatLng (${latitude}, ${longitude}): ${valid}`); // Log validation check
    return valid;
}
