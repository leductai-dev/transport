
var mymap = L.map('mapid').setView([15.9791226,108.211886,754], 13);
console.log("script map");
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	id: 'mapbox/streets-v11',
	tileSize: 512,
	zoomOffset: -1
}).addTo(mymap);
	
	L.marker([15.9791226,108.211886,754]).addTo(mymap)
		.bindPopup("<b>Hello world!</b><br />I am a popup.");
/* 
	L.circle([15.9791226,108.211886,754], 1500, {
        
	}).addTo(mymap).bindPopup("I am a circle."); */

    var popup = L.popup();
    function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}

L.polyline([
		[15.982502, 108.216323],
		[15.973480, 108.206505],
		[15.974684, 108.223987]
	]).addTo(mymap).bindPopup("I am a polygon.");


mymap.on('click', onMapClick);

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

mymap.on('click', onMapClick);


window.onload = function(){
	document.getElementById("modal").addEventListener('click',function(){
		console.log("hii");
		$("#modal").fadeOut();
	})
	
}
