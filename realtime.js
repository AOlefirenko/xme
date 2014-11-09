var WebSocketServer = require('ws').Server;


module.exports = function(app){
    var http = require('http');
    var server = http.createServer();
    server.listen(8001);
    var wss = new WebSocketServer({server: server});
    wss.on('connection', function(ws) {
        console.log(ws);
        ws.on('message', function(message,a,b) {
            ws.send("reverse!");
            ws.send(message);
        });
        ws.send("Hello!!!!!");

    });
}


