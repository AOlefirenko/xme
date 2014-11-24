var ObjectId = require("mongodb").ObjectID,
    errors = require('http-custom-errors');


exports.createSession = function(req, res) {
    var id = new ObjectId(req.user.id);
    var doc = {userId:id};
    req.db.collection('sessions').insert(doc,function(err, result){
        if(err) return next(errors.InternalServerError(err.message));
        req.db.collection('users').update({_id:id},{$addToSet:{sessions:doc._id}},function(err, result){
            res.send({id:doc._id});
        });
    });
}
exports.deleteSession = function(req, res) {
    var id = new ObjectId(req.user.id);
    var sessionId = new ObjectId(req.params.id);
    var doc = {userId:id,_id: sessionId};
    req.db.collection('sessions').remove(doc,function(err, result){
        if(err) return next(errors.InternalServerError(err.message));
        req.db.collection('users').update({_id:doc},{$pull:{sessions:sessionId}},function(err, result){
            res.send();
        });
    });
}
