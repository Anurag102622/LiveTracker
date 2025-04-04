
const socket = io();//connection request]

navigator.geolocation.watchPosition(
    (position) => {
        const {latitude, longitude} = position.coords;
        socket.emit("send-location", {latitude, longitude});
    },
    (error) => {
        console.log(error);
    },
    { // Options should be here
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
        tap: true, 
        touchZoom: true
    }
);

const map = L.map("map").setView([20, 79], 4);


L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "openstreetmap"
}).addTo(map);

const markers = {};

socket.on("receive-location",(data)=>{
    const{id, latitude, longitude}= data;
    // map.setView([latitude,longitude],17);
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);

    }
    else{
        markers[id] = L.marker([latitude,longitude]).addTo(map);
        }
});


socket.on("user-disconnected", (id) => {
    if (markers[id]) {  
        map.removeLayer(markers[id]);
        delete markers[id]; 
    }
});