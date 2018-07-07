// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));
// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});
// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

var players = {};
io.on('connection', function(socket) {
  socket.on('new player', function() {
	var x = Math.floor(Math.random()*(700-100)+1)+100;
	var y = Math.floor(Math.random()*(500-100)+1)+100;
    players[socket.id] = {
		units:[{x: x,y: y,hp:5}],
		attack:1,
		defence:1,
		health:1,
		movement:1,
		tracking:1,
		replication:1,
		points:5
	};
  });
  socket.on('disconnect', function() {
    // remove disconnected player
	delete players[socket.id];
  });
  /*
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
	
    if (data.left) {
      player.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
    }
    if (data.right) {
      player.x += 5;
    }
    if (data.down) {
      player.y += 5;
    }
  });
  */
	socket.on('upgrade', function(item) {
		if(players[socket.id].points > 0){
			switch(item){
				case 'attack':
					players[socket.id].points--;
					players[socket.id].attack++;
					break;
				case 'defence':
					players[socket.id].points--;
					players[socket.id].defence++;
					break;
				case 'health':
					players[socket.id].points--;
					players[socket.id].health++;
					break;
				case 'movement':
					players[socket.id].points--;
					players[socket.id].movement++;
					break;
				case 'tracking':
					players[socket.id].points--;
					players[socket.id].tracking++;
					break;
				case 'replication':
					players[socket.id].points--;
					players[socket.id].replication++;
					break;
			}
		}
	});
});

// Do unit movement
var lastUpdateTime = (new Date()).getTime();
setInterval(function() {
	var currentTime = (new Date()).getTime();
	var timeDifference = currentTime - lastUpdateTime;
	for(var id in players){
		var player = players[id];
		for(var unit in player.units){
			var max = player.movement;
			var min = player.movement*-1;
			var r = Math.floor(Math.random() * (max-min+1))+min;
			var s = Math.floor(Math.random() * (max-min+1))+min;
			if((player.units[unit].x + r) < 0 || (player.units[unit].x + r) > 800){r *= -1;}
			if((player.units[unit].y + s) < 0 || (player.units[unit].y + s) > 600){s *= -1;}
			player.units[unit].x += r; // * timeDifference
			player.units[unit].y += s;
			lastUpdateTime = currentTime;
		}
	}
}, 1000 / 60);

setInterval(function() {
	var currentTime = (new Date()).getTime();
	var timeDifference = currentTime - lastUpdateTime;
	for(var id in players){
		var player = players[id];
		console.log(player.units.length,player.replication);
		if(player.units.length < player.replication){
			var x = Math.floor(Math.random()*(700-100)+1)+100;
			var y = Math.floor(Math.random()*(500-100)+1)+100;
			player.units.push({x: x,y: y,hp:player.health*5});
			console.log("Adding Unit");
		}
	}
}, 5000 / 1);

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);