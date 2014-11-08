var passport = require('passport'),
    jwt = require('jwt-simple'),
    syncFbFriends = require('./../modules/syncFbFriends');

exports.login = function(req, res,next) {
    passport.authenticate('local', { session: false  }, function(err, user, info) {
        if (err || !user) {
            res.status(400).send(info);
        } else {
            user.password = undefined;
            user.salt = undefined;
            var token = jwt.encode({id:user.id,nick:user.nick}, "xxx");
            return res.send(token);
        }
    })(req, res, next);
}

exports.register = function(req, res,next) {
    var newUser = req.body;
	console.log("register",newUser);
    req.db.collection("users").insertOne(newUser, function(err,r){
	console.log(arguments);
        passport.authenticate('local', { session: false  }, function(err, user, info) {
            if (err || !user) {
                res.status(400).send(info);
            } else {
                user.password = undefined;
                user.salt = undefined;
                var token = jwt.encode({id:user.id,nick:user.nick}, "xxx");
                return res.send(token);
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
                    var token = jwt.encode({id:user.id,nick:user.nick}, "xxx");
                    res.send(token);
                    console.log(r.value ,r.value.contacts);
                    var contacts = (r.value && r.value.contacts)|| [];
                    syncFbFriends( req.db,id,user.providerData.accessToken, contacts);
                }
            );
        })(req,res,next);
    };
};
