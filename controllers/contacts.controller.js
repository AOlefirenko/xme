var ObjectId = require("mongodb").ObjectID,
    https = require('https'),
    async = require('async'),
    errors = require('http-custom-errors');


exports.get = function(req, res) {

}

exports.addContact = function(req,res,next){
    var id = new ObjectId(req.user.id);
    req.db.collection('users').update({_id:id},{$push:{contacts:req.params.username}},function(err,res){
        if(err) return next(errors.InternalServerError(err.message));
        res.status(204).send()
    });
}