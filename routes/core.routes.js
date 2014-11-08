var passport = require('passport');

module.exports  = function(app){
    app.get('/',function(req,res,next){
        res.send("X messenger");
    });

    app.all('/api/*',passport.authenticate('bearer', { session: false }));
}
