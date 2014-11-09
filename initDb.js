var client = require('mongodb').MongoClient;

module.exports =function(callback){
    var mongoOptions = {
        server: {auto_reconnect: true}
    };
    client.connect("mongodb://xmen:marcopolo@ds033380.mongolab.com:33380/xme-dev",mongoOptions, function(err, database) {
        if(err) throw err;
        console.log('mongodb: The connection is established.')
        callback(database);
    });
}