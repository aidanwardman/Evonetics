var socket = io();
socket.on('message', function(data) {
  console.log(data);
});

socket.emit('new player');
/*
setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 60);
*/

var canvas = document.getElementById('canvas');
var upgrades = document.getElementById('upgrades');
var attack = document.getElementById('attack');
var defence = document.getElementById('defence');
var health = document.getElementById('health');
var speed = document.getElementById('speed');
var tracking = document.getElementById('tracking');
var replication = document.getElementById('replication');
var points = document.getElementById('points');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
socket.on('state', function(players) {
context.clearRect(0, 0, 800, 600);
 
for (var id in players) {
	var player = players[id];

	if(socket.id == id){
		attack.innerHTML = "Attack ("+player.attack+")";
		defence.innerHTML ="Defence ("+player.defence+")";
		health.innerHTML ="Health ("+player.health+")";
		speed.innerHTML = "Speed ("+player.speed+")";
		tracking.innerHTML = "Tracking ("+player.tracking+")";
		replication.innerHTML = "Replication ("+player.replication+")";
		points.innerHTML = player.points;
	}

	for (var unit=0; unit<player.units.length;unit++) {
		if(socket.id == id){
			context.fillStyle = 'green';
		}else{
			context.fillStyle = 'red';
		}
		context.beginPath();
		context.arc(player.units[unit].x, player.units[unit].y, player.health*5, 0, 2 * Math.PI);
		context.fill();
		
		//context = canvas.getContext("2d");
		context.font = '8pt Calibri';
		context.fillStyle = 'white';
		context.textAlign = 'center';
		context.fillText(player.units[unit].hp, player.units[unit].x, player.units[unit].y+3);
	}
  }
});

function upgrade(item){
	socket.emit('upgrade',item);
}