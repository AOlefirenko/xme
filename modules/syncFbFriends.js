var https = require('https'),
    async = require('async'),
    ObjectId = require("mongodb").ObjectID,
    _ = require('lodash');

module.exports = function(db, id,token,contacts){

    async.waterfall([
        function(callback){
            var url = "https://graph.facebook.com/v2.2/me/friends?limit=1000&access_token="+token;
            https.get(url,function(d){
                var data = '';
                d.on('data', function (chunk){
                    data += chunk;
                });
                d.on('end',function(){
                    var obj = JSON.parse(data);
                    callback(null,obj);
                })
            });
        },
        function(result, callback){
            var ids = result.data.map(function(i){return {fbId:i.id};});
            var changed = false;
            ids.forEach(function(i){
                var res = _.find(contacts,function(c){return c.fb== i.fb;}) ;
                if(!res) {
                    changed=true;
                    contacts.push(i);
                }
            });
            if(changed)
            db.collection('users').update({_id:new ObjectId(id)},{$set:{contacts:contacts}});
        }
    ])
}