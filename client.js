var socket = io.connect();
$(document).ready(function(){
    $('#form').submit(function(e){
        e.preventDefault();
        socket.emit('client_data', $('#Input').val());
    });
    $('#stop').submit(function(e){
        e.preventDefault();
        socket.emit('stop');
    });
    $('#clear').submit(function(e){
        e.preventDefault();
        socket.emit('clear');
        initMap();
    });
});
socket.on('location', function(data){
    addMarker(data);
});

function initMap() {
    var uluru = {lat: 37.0902, lng: -95.7129};
    var options = {
        zoom: 4,
        center: uluru,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById('map'), options);
}

function addMarker(location) {
    marker = new google.maps.Marker({
        position: location,
        map: map
    });
}