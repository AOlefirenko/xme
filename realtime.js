var http = require('http');
var server = http.createServer();
server.listen(8001);

var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({server: server});

wss.on('connection', function(ws) {
    ws.on('message', function(message,a,b) {
        ws.send("reverse!");
        ws.send(message);
    });
    ws.send("Hello!!!!!");

});