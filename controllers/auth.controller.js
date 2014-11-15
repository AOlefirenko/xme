var passport = require('passport'),
    jwt = require('jwt-simple'),
    syncFbFriends = require('./../modules/syncFbFriends'),
    errors = require('http-custom-errors'),
    ObjectId = require("mongodb").ObjectID,
    async = require('async'),
    https = require('https');

exports.login = function(req, res,next) {
    passport.authenticate('local', { session: false  }, function(err, user, info) {
        if (err || !user) {
            res.status(400).send(info);
        } else {
            user.password = undefined;
            user.salt = undefined;
            var token = jwt.encode({id:user.id,nick:user.nick,provider:'local'}, "xxx");
            return res.send({token:token});
        }
    })(req, res, next);
}

exports.logout = function(req, res,next) {
    try {
        var data = jwt.decode(req.query.accessToken, 'xxx');
        if(data.provider=='facebook')
        {
            var id = new ObjectId(data.id);
            req.db.collection('users').findOne({_id: id}, function(err,doc){
                var url = "https://www.facebook.com/logout.php?next=http%3A%2F%2Fxme.cloudapp.net%2F&access_token="+doc.providerData.accessToken;
                res.redirect(url);
            });
        }
        else{
            res.send();
        }
    }
    catch(e){
        res.status(400).send("invalid token");
    }

}

exports.register = function(req, res,next) {
    var newUser = req.body;
	console.log("register",newUser);
    if(!newUser.nick || !newUser.password|| !newUser.email) {
        next(new errors.BadRequestError());
        return;
    }
    newUser.nick = newUser.nick.toLowerCase();
    req.db.collection("users").insertOne(newUser, function(err,r){
	console.log(arguments);
        passport.authenticate('local', { session: false  }, function(err, user, info) {
            if (err || !user) {
                res.status(400).send(info);
            } else {
                user.password = undefined;
                user.salt = undefined;
                var token = jwt.encode({id:user.id,nick:user.nick,provider:'local'}, "xxx");
                return res.send({token:token});
            }
        })(req, res, next);
    });
}

exports.oauthCallback = function(strategy) {
    return function(req, res, next) {
        passport.authenticate('facebook', { session: false,scope: ['email', 'public_profile','user_friends'],display:'touch'   }, function(err, user, redirectURL) {
            if (err) throw err;
            req.db.collection('users').findOneAndUpdate(
                {email: user.email },
                {$setOnInsert: user},
                {upsert: true},
                function(err, r) {
                    var id;
                    if(r.lastErrorObject.updatedExisting)  id=r.value._id;
                    else id = r.lastErrorObject.upserted
                    var token = jwt.encode({id:id,nick:user.nick,provider:'facebook'}, "xxx");
                    res.send(token);
                    console.log(r.value ,r.value.contacts);
                    var contacts = (r.value && r.value.contacts)|| [];
                    syncFbFriends( req.db,id,user.providerData.accessToken, contacts);
                }
            );
        })(req,res,next);
    };
};
