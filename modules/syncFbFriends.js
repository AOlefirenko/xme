var https = require('https'),
    async = require('async'),
    ObjectId = require("mongodb").ObjectID,
    _ = require('lodash'),
    errors = require('http-custom-errors');

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
        function(result,callback){
            if(!result.data) callback(new errors.InternalServerError("facebook friends is not received"))
            var ids = result.data.map(function(i){return i.id});
            console.log("fb friends",ids);
            db.collection('users').find({fbId:{$in:ids}}).toArray(callback);
        },
        function(result, callback){
            if(!result) callback(new errors.InternalServerError("friends not found in db"))
            var ids = result.map(function(i){return i.nick});
            console.log("nicks",ids);
            console.log("my contacts",contacts);
            var changed = false;
            ids.forEach(function(i){
                var res = _.find(contacts,function(c){return c === i;}) ;
                if(!res) {
                    changed=true;
                    contacts.push(i);
                }
            });
            if(changed)
            db.collection('users').update({_id:new ObjectId(id)},{$addToset:{contacts:contacts}});
        }
    ])
}