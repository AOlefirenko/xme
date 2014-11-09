var http = require('http'),
jwt = require('jwt-simple');
var server = http.createServer();
var client = require('mongodb').MongoClient;
server.listen(3000);

var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({server: server});

var activeUsers = {};
wss.on('connection', function(ws) {
    var token = ws.upgradeReq.url.replace('/?accessToken=','');
    try {
        var user = jwt.decode(token, "xxx");
        var nick = user.nick;
        if (!nick) throw new Error();
        activeUsers[nick] = ws;
        ws.on('message', function (message, a, b) {
            var data;
            try {
                data = JSON.parse(message);
                data.from = nick
                ws.send("sending message from "+nick);

                if(activeUsers[data.to]) {

                    ws.send("sending message to "+nick);
                    activeUsers[nick].send(data);

                }
                //save to db
            }
            catch(e){
                ws.send("incorrect message");
            }
        });
        ws.on('close', function () {
            delete activeUsers[user.nick];
            console.log(nick +' disconnected');
        });
    }
    catch(e){
        ws.send("Unauthorized");
    }
});
