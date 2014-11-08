var ObjectId = require("mongodb").ObjectID,
    https = require('https'),
    async = require('async'),
    errors = require('http-custom-errors');


exports.get = function(req, res,next) {
    var id = new ObjectId(req.user.id);
    req.db.collection('users').findOne({_id:id},function(err, doc){
        if(err) return next(errors.InternalServerError(err.message));
        req.db.collection('users').find({nick:{$in:doc.contacts}}).toArray(function(docs){
            var contacts = docs.map(function(d){
                return {id:d.id, pic: d.pic, nick: d.nick, firstName: d.firstName, lastName: d.lastName};
            });
            res.send(contacts);
        })
    });
}

exports.addContact = function(req,res,next){
    var id = new ObjectId(req.user.id);
    req.db.collection('users').update({_id:id},{$push:{contacts:req.params.username}},function(err,res){
        if(err) return next(errors.InternalServerError(err.message));
        res.status(204).send()
    });
}