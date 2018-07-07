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
    players[socket.id] = {
		units:[{x: 300,y: 300}],
		attack:1,
		defence:1,
		health:1,
		movement:1,
		tracking:1,
		replication:1
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
});

// Do unit movement
var lastUpdateTime = (new Date()).getTime();
setInterval(function() {
	var currentTime = (new Date()).getTime();
	var timeDifference = currentTime - lastUpdateTime;
	for(var id in players){
		var player = players[id];
		for(var unit in player.units){
			var r = Math.floor(Math.random() * 4 - 2);
			var s = Math.floor(Math.random() * 4 - 2);
			player.units[unit].x += r; // * timeDifference
			player.units[unit].y += s;
			lastUpdateTime = currentTime;
		}
	}
}, 1000 / 5);

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);