var ObjectId = require("mongodb").ObjectID,
    https = require('https'),
    errors = require('http-custom-errors');
var async = require('async');

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
///"https://graph.facebook.com/v2.2/me/permissions?access_token=CAAEevIen5okBAIzgYNZCStbptBDWnXOngaZATS97R0baXpknJsx2Bp9U5WV1HsRG6gwO8hLlwuGHzTDpkpxGqmmUVq4ZBfZArULZCdXHv4Dujv902fNyGhdDYHwoZB2qzgzFsN1ZAZBH2kZBIEM2RKMEmjE6nZAND6ZC2wJkggvQ0qCZCY1U5oAS7e3u
exports.addContact = function(req,res,next){
    var id = new ObjectId(req.user.id);
    req.db.collection('users').update({_id:id},{$push:{contacts:req.params.username}},function(err,res){
        if(err) return next(errors.InternalServerError(err.message));
        res.status(204).send()
    });
}