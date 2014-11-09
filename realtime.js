var WebSocketServer = require('ws').Server;

module.exports = function(app){
    var wss = new WebSocketServer({server: app});
    wss.on('connection', function(ws) {
        console.log(ws);
        ws.on('message', function(message,a,b) {
            ws.send("reverse!");
            ws.send(message);
        });
        ws.send("Hello!!!!!");

    });
}


