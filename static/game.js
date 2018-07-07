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
var movement = document.getElementById('movement');
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
	//console.log(player,player.units);
	if(socket.id == id){
		context.fillStyle = 'green';
		attack.innerHTML = "Attack ("+player.attack+")";
		defence.innerHTML ="Defence ("+player.defence+")";
		health.innerHTML ="Health ("+player.health+")";
		movement.innerHTML = "Movement ("+player.movement+")";
		tracking.innerHTML = "Tracking ("+player.tracking+")";
		replication.innerHTML = "Replication ("+player.replication+")";
		points.innerHTML = player.points;
	}else{
		context.fillStyle = 'red';
	}
	for (var unit in player.units) {
		context.beginPath();
		context.arc(player.units[unit].x, player.units[unit].y, 10, 0, 2 * Math.PI);
		context.fill();
		
		context = canvas.getContext("2d");
		context.font = '8pt Calibri';
		context.fillStyle = 'white';
		context.textAlign = 'center';
		context.fillText('0', player.units[unit].x, player.units[unit].y+3);
	}
  }
});

function upgrade(item){
	socket.emit('upgrade',item);
}