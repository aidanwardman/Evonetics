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
		name: socket.id,
		score: 0,
		units:[{
			x: x,
			y: y,
			hp:7,
			path:{
				x:x,
				y:y
			}
		}],
		attack:1,
		defence:1,
		health:1,
		speed:1,
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
	socket.on('name', function(name) {
		players[socket.id].name = name;
	});
  
	socket.on('upgrade', function(item) {
		var p = players[socket.id].points;
		if(p > 0){
			switch(item){
				case 'attack':
					if(p >= players[socket.id].attack+1){
						players[socket.id].points -= players[socket.id].attack+1;
						players[socket.id].attack++;
					}
					break;
				case 'defence':
					if(p >= players[socket.id].defence+1){
						players[socket.id].points -= players[socket.id].defence+1;
						players[socket.id].defence++;
					}
					break;
				case 'health':
					if(p >= players[socket.id].health+1){
						players[socket.id].points -= players[socket.id].health+1;
						players[socket.id].health++;
					}
					break;
				case 'speed':
					if(p >= players[socket.id].speed*2){
						players[socket.id].points -= players[socket.id].speed*2;
						players[socket.id].speed++;
					}
					break;
				case 'tracking':
					if(p >= players[socket.id].tracking*4){
						players[socket.id].points -= players[socket.id].tracking*4;
						players[socket.id].tracking++;
					}
					break;
				case 'replication':
					if(p >= players[socket.id].replication*3){
						players[socket.id].points -= players[socket.id].replication*3;
						players[socket.id].replication++;
					}
					break;
			}
		}
	});
});

function intersects(x0,y0,r0,x1,y1,r1){
	//return Math.hypot(x0-x1, y0-y1) <= (r0 + r1);
	var dx = x0 - x1;
	var dy = y0 - y1;
	var distance = Math.sqrt(dx * dx + dy * dy);

	return distance < r0 + r1;
}

// Do unit movement
var lastUpdateTime = (new Date()).getTime();
setInterval(function() {
	var currentTime = (new Date()).getTime();
	var timeDifference = currentTime - lastUpdateTime;
	for(var id in players){
		var player = players[id];
		for(var unit in player.units){
			// Unit movement
			if(player.tracking <= 1){
				var max = player.speed;
				var min = player.speed*-1;
				var r = Math.floor(Math.random() * (max-min+1))+min;
				var s = Math.floor(Math.random() * (max-min+1))+min;
				if((player.units[unit].x + r) < 0 || (player.units[unit].x + r) > 800){r *= -1;}
				if((player.units[unit].y + s) < 0 || (player.units[unit].y + s) > 600){s *= -1;}
				player.units[unit].x += r; // * timeDifference
				player.units[unit].y += s;
			}else{
				if(intersects(player.units[unit].x,player.units[unit].y,player.units[unit].hp,player.units[unit].path.x,player.units[unit].path.y,5)){
					var x = Math.floor(Math.random()*(700-100)+1)+100;
					var y = Math.floor(Math.random()*(500-100)+1)+100;
					player.units[unit].path.x = x;
					player.units[unit].path.y = y;
				}
				if(player.units[unit].x < player.units[unit].path.x){
					player.units[unit].x += player.speed;
				}else if(player.units[unit].x > player.units[unit].path.x){
					player.units[unit].x -= player.speed;
				}
				if(player.units[unit].y < player.units[unit].path.y){
					player.units[unit].y += player.speed;
				}else if(player.units[unit].y > player.units[unit].path.y){
					player.units[unit].y -= player.speed;
				}
			}
			
			// Collision detection
			for(id2 in players){ // check all units for collision
				var player2 = players[id2];
				if(id != id2){ // dont check own units
					for(var unit2 in player2.units){
						if(player.units[unit].hp > 0 && player2.units[unit2].hp > 0){
							if(intersects(player.units[unit].x,player.units[unit].y,player.units[unit].hp,player2.units[unit2].x,player2.units[unit2].y,player2.units[unit2].hp)){
								player.units[unit].hp -= player2.attack;
								player2.units[unit2].hp -= player.attack;
								if(player.units[unit].hp <= 0){
									player2.points++;
									player2.score++;
								}
								if(player2.units[unit2].hp <= 0){
									player.points++;
									player.score++;
								}
							}
						}
					}
				}
			}
			lastUpdateTime = currentTime;
		}
	}
	
	// Remove any dead units
	for(var id in players){
		var removes = [];
		var player = players[id];
		for(var unit in player.units){
			if(player.units[unit].hp <= 0){
				removes.push(unit);
			}
		}
		for(var r in removes){
			player.units.splice(r,1);
		}
	}
}, 1000 / 60);

// Replication
setInterval(function() {
	var currentTime = (new Date()).getTime();
	var timeDifference = currentTime - lastUpdateTime;
	for(var id in players){
		var player = players[id];
		if(player.units.length < player.replication){
			var x = Math.floor(Math.random()*(700-100)+1)+100;
			var y = Math.floor(Math.random()*(500-100)+1)+100;
			var hp = 5+(player.health*2);
			player.units.push({x: x,y: y,hp:hp,path:{x:x,y:y}});
		}
	}
}, 5000 / 1);

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);