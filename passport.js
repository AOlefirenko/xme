var passport = require("passport"),
	FacebookStrategy = require('passport-facebook').Strategy,
	LocalStrategy = require('passport-local').Strategy,
	BearerStrategy = require('passport-http-bearer').Strategy
	jwt = require('jwt-simple');
	
module.exports =function(app,db){

	app.use(passport.initialize());

	passport.use(new FacebookStrategy({
			clientID: '315270055323273',
			clientSecret: 'a7a9ced3631d204350f9dfc8c5f13796',
			callbackURL: '/auth/facebook/callback',
			passReqToCallback: true
		},
		function(req, accessToken, refreshToken, profile, done) {
			var providerData = profile._json;
			providerData.accessToken = accessToken;
			providerData.refreshToken = refreshToken;

			var providerUserProfile = {
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				email: profile.emails[0].value,
				nick: profile.username || profile.displayName,
                pic:'https://graph.facebook.com/{0}/picture?width=110&height=110'.replace('{0}',providerData.id),
				fbId:providerData.id,
				provider: 'facebook',
				providerIdentifierField: 'id',
				providerData: providerData
			};
            providerUserProfile.nick = providerUserProfile.nick.replace(/ /g,'').toLowerCase();
			done(null,providerUserProfile);
		}
	));
	passport.use(new LocalStrategy({
			usernameField: 'nick',
			passwordField: 'password'
		},
		function(username, password, done) {
			db.collection('users').findOne({nick:username},function(err, doc){
				done(null,{id:doc._id})
			})
		}
	));
	
	passport.use(new BearerStrategy({},
        function(token, done) {
            process.nextTick(function () {
				var user = jwt.decode(token, "xxx")
				done(null,user)
				});
			})
    );

	return passport;
}