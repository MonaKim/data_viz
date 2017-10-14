var mapimg;
// mapboxgl.accessToken = 'pk.eyJ1IjoibW9uYWtpbSIsImEiOiJjajhhanlpdnUwNGd4MnhwbWlqdXJnbjgzIn0.btcUE5wCZE2SGx2GpAEpRA';
var clon = 0;
var clat = 0;
// 40.7128° N, 74.0059° W
var lat = 40.7128;
var lon = -74.0059;

var zoom = 1;
var earthquakes; 
var earthquake_array = [];
var p;
var time;
var times = [];
// var info;

function formatDate(date)
{//example 2017-10-02T20:12:53.800Z
}
// document.getElementById("date").innerHTML = new Date();
var date = new Date("");
var milliseconds = date.getTime();

function preload(){
	mapimg = loadImage("https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/0,0,1,0,0/1024x500?access_token=pk.eyJ1IjoibW9uYWtpbSIsImEiOiJjajhhanlpdnUwNGd4MnhwbWlqdXJnbjgzIn0.btcUE5wCZE2SGx2GpAEpRA");
	//token = pk.eyJ1IjoibW9uYWtpbSIsImEiOiJjajhhanlpdnUwNGd4MnhwbWlqdXJnbjgzIn0.btcUE5wCZE2SGx2GpAEpRA
	earthquakes = loadTable('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv', "csv", "header");
}

function mercX (lon){
	lon = radians(lon);
	var a = (256/PI) * pow(2, zoom);
	var b = lon +PI;
	return a * b;
}

function mercY (lat){
	lat = radians(lat);
	var a = (256/PI) * pow(2, zoom);
	var b = tan(PI/4 + lat /2);
	var c = PI - log(b);
	return a * c;
}

function setup(){
	createCanvas (1024,500);
	translate(width/2, height/2);
	imageMode(CENTER);
	image(mapimg,width/2,height/2,10,10);

	var cx = mercX(clon);
	var cy = mercY(clat);
	for (var r = 0; r < earthquakes.getRowCount(); r++){
		// orig lat
		var lat = earthquakes.getString(r, 1);
		// lat as we use it on our pixel map:
		var y = mercY(lat) - cy;

		// orig lon:
		var lon = earthquakes.getString(r, 2);
		// lon as we use it on our pixel map:
		var x = mercX(lon) - cx;

		// orig time
		time = earthquakes.getString(r, 0);
		times.push( earthquakes.getString(r, 0) );
		// here to get the actual time
		// use it in milliseconds in an animation
		var t = 2000 * random(10);

		// orig mag
		var mag = earthquakes.getString(r, 4);
		mag = pow(10, mag);
		mag = sqrt(mag);
		var magmax = sqrt(pow(10,10));
		// mag as turned into a pixel sized "d" diameter
		var d = map (mag, 0, magmax,3,300);
		
		var city = earthquakes.getString(r, 13);
		//console.log(city);

		var info = {
			lat: lat,
			lon: lon,
			time: time,
			mag: earthquakes.getString(r, 4),
			x: x,
			y: y,
			d: d,
			t: t,
			p:p,
			city: city
		}
		earthquake_array.push(info);   
	}
	 //console.log(earthquake_array);
}
function draw(){
	translate(width/2, height/2);
	// redraw map to wipe out all eartyhquakes and draw them afresh
	image(mapimg,0,0);
	// ey, what's the current run-time of this program?
	var current_milli_seconds = millis();
	// print(current_milli_seconds);
	// did any earthquake occure at this time?
	// not sure, let's check with every single one of them!
	for( var i = 0; i < earthquake_array.length; i++){
		var current_earthquake = earthquake_array[i];
		var earthquake_time_in_milli_seconds = current_earthquake.t;

		if( abs(current_milli_seconds - earthquake_time_in_milli_seconds) <= 500){
			stroke(220,80,55);
			fill(225,20,25,100);

			ellipse(current_earthquake.x,current_earthquake.y,current_earthquake.d,current_earthquake.d);
		}
	}
}
function getValue(){

	var x = document.getElementById("search").value;
	console.log(x);

	times = [];

	for (var r = 0; r < earthquake_array.length; r++){
		// orig lat
		var city = earthquake_array[r].city;
		var compareTo = x;

		//check if the variable city has the compareTo in it
		//if yes, output the date in that row
		if(city.indexOf(compareTo)!= -1) {
			console.log(earthquake_array[r].time);
			times.push(earthquake_array[r].time);
		}		 
	}
	// document.getElementById("date").innerHTML = times;

	// var str = "ca";
	// var patt1 = /California/i;
	// var result = str.match(patt1);ß
	// var date = Date.parse(result);

	for (var i = 0; i < times.length; i++) {
		document.getElementById("date").innerHTML += "<p>"+times[i]+"</p>";

	}
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
   }

