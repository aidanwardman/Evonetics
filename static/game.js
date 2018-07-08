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

var attackl = document.getElementById('attacklevel');
var defencel = document.getElementById('defencelevel');
var healthl = document.getElementById('healthlevel');
var speedl = document.getElementById('speedlevel');
var trackingl = document.getElementById('trackinglevel');
var replicationl = document.getElementById('replicationlevel');

var attackc = document.getElementById('attackcost');
var defencec = document.getElementById('defencecost');
var healthc = document.getElementById('healthcost');
var speedc = document.getElementById('speedcost');
var trackingc = document.getElementById('trackingcost');
var replicationc = document.getElementById('replicationcost');

var points = document.getElementById('points');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
socket.on('state', function(players) {
context.clearRect(0, 0, 800, 600);
var leaderboard = document.getElementById('leaderboard');
var leaders = "";
for (var id in players) {
	
	var player = players[id];
	leaders += "<td>"+player.name+"</td><td>"+player.score+"</td>";
	
	if(socket.id == id){
		attackc.innerHTML = player.attack+1;
		defencec.innerHTML = player.defence+1;
		healthc.innerHTML = player.health+1;
		speedc.innerHTML = player.speed*2;
		trackingc.innerHTML = player.tracking*4;
		replicationc.innerHTML = player.replication*3;
		
		attackl.innerHTML = player.attack;
		defencel.innerHTML = player.defence;
		healthl.innerHTML = player.health;
		speedl.innerHTML = player.speed;
		
		switch(player.tracking){
			case 1:
				trackingl.innerHTML = "Random";
				break;
			case 2:
				trackingl.innerHTML = "Pathing";
				break;
			case 3:
				trackingl.innerHTML = "Weak Hunting";
				break;
			case 4:
				trackingl.innerHTML = "Strong Hunting";
				break;
			default:
				trackingl.innerHTML = "Unknown";
				break;
		}
		replicationl.innerHTML = player.replication;
		
		points.innerHTML = player.points;
		units.innerHTML = player.units.length;
	}

	for (var unit=0; unit<player.units.length;unit++) {
		if(socket.id == id){
			context.fillStyle = 'green';
		}else{
			context.fillStyle = 'red';
		}
		if(player.units[unit].hp > 0){
			context.beginPath();
			context.arc(player.units[unit].x, player.units[unit].y, player.units[unit].hp, 0, 2 * Math.PI);
			context.fill();
			
			//context = canvas.getContext("2d");
			context.font = '8pt Calibri';
			context.fillStyle = 'white';
			context.textAlign = 'center';
			context.fillText(player.units[unit].hp, player.units[unit].x, player.units[unit].y+3);
		}
	}
  }
  leaderboard.innerHTML = leaders;
});

function upgrade(item){
	socket.emit('upgrade',item);
}

function nameupdate(n){
	var name = n.value;
	socket.emit('name',name);
}