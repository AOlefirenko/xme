var ObjectId = require("mongodb").ObjectID,
    errors = require('http-custom-errors');


exports.getMe = function(req, res) {
    var id = new ObjectId(req.user.id);
    req.db.collection('users').findOne({_id:id},function(err, doc){
        if(err) return next(errors.InternalServerError(err.message));
        res.send(doc);
    });
}

exports.checkUser = function(req, res,next) {
    req.db.collection('users').findOne(req.query,function(err, doc){
        if(err) return next(errors.InternalServerError(err.message));
		console.log(doc);
        res.send(!!doc);
    });
}

exports.patch = function(req, res,next) {
    console.log("patch user");
    var query = {_id:new ObjectId(req.user.id)};
    var update = {$set:req.body};
    console.log('PATCH',query,update);
    req.db.collection('users').update(query,update,function(err,doc){
        if(err) {
            next(errors.InternalServerError(err.message));
            return;
        }
        res.status(204).send();
    });
}
