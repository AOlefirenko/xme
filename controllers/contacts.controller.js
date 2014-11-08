var ObjectId = require("mongodb").ObjectID,
    https = require('https'),
    async = require('async'),
    errors = require('http-custom-errors');


exports.get = function(req, res) {
    async.waterfall([
        function(callback){
            var id = new ObjectId(req.user.id);
            req.db.collection('users').findOne({_id:id},callback);
        },
        function(doc, callback){
            var url = "https://graph.facebook.com/v2.2/me/friends?limit=1000&access_token="+doc.providerData.accessToken;
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
        }
    ],function(err, result){
        res.send(result.data)
    })
}

exports.addContact = function(req,res,next){
    var id = new ObjectId(req.user.id);
    req.db.collection('users').update({_id:id},{$push:{contacts:req.params.username}},function(err,res){
        if(err) return next(errors.InternalServerError(err.message));
        res.status(204).send()
    });
}