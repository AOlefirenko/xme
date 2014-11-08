var client = require('mongodb').MongoClient;

module.exports =function(callback){
    var mongoOptions = {
        server: {auto_reconnect: true}
    };
    client.connect("mongodb://localhost:27017/xme-dev",mongoOptions, function(err, database) {
        if(err) throw err;
        console.log('mongodb: The connection is established.')
        callback(database);
    });
}