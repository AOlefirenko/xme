var ObjectId = require("mongodb").ObjectID,
    errors = require('http-custom-errors');


exports.createSession = function(req, res) {
    var id = new ObjectId(req.user.id);
    var doc = {userId:id};
    req.db.collection('sessions').insert(doc,function(err, result){
        if(err) return next(errors.InternalServerError(err.message));
        res.send(doc._id);
    });
}
