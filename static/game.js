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
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
socket.on('state', function(players) {
  context.clearRect(0, 0, 800, 600);
 
  for (var id in players) {
    var player = players[id];
	//console.log(player,player.units);
	for (var unit in player.units) {
		context.beginPath();
		if(socket.id == id){
			 context.fillStyle = 'green';
		}else{
			 context.fillStyle = 'red';
		}
		context.arc(player.units[unit].x, player.units[unit].y, 10, 0, 2 * Math.PI);
		context.fill();
	}
  }
});