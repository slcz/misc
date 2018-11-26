"use strict";

var websocket = require('websocket').server;
var express = require('express');
var app = express();

app.get('/', function(req, res) {
	res.sendFile(__dirname + "/" + "chart.html");
})

var server = app.listen(5000, function() {
	var host = server.address().address;
	var port = server.address().port
	console.log("listen at http://%s:%s", host, port);
})

var wsserver = new websocket({
	httpServer: server
});

var clients = [];

wsserver.on('request', function(request) {
	console.log((new Date()) + ' Connection from '
		+ request.origin + '.');
	var connection = request.accept(null, request.origin);
	clients.push(connection);
	console.log('connection accepted');
	var ts = 0;
	var interval = setInterval(function() {
		if (ts === 10)
			clearInterval(interval);
		else {
			ts ++;
			var obj = {
				timestamp: ts,
				dataset: Math.trunc(Math.random() * 100),
			};
			var json = JSON.stringify({type: 'message', data:obj});
			for (var i = 0; i < clients.length; i ++) {
				clients[i].sendUTF(json);
			}
		}
	}, 1000);
});
