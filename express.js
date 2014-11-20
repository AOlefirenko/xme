var express = require("express"),
	bodyParser = require('body-parser'),
	initPassport = require("./passport");

module.exports =function(db){
	var app = express();
	
	initPassport(app,db);
	
	app.use(function (req, res, next) {
        req.db = db;
        next();
    });

	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());
	app.use(express.static(path.resolve('./public')));
console.log(require('./routes/core.routes'));
    require('./routes/core.routes')(app);
    require('./routes/auth.routes')(app);
    require('./routes/contacts.routes')(app);
    require('./routes/users.routes')(app);
    require('./routes/sessions.routes')(app);

    app.use(function (err, req, res, next) {
        // If the error object doesn't exists
        if (!err) return next();
        // Error page
        res.status(err.code).send(err.message);
    });

// Assume 404 since no middleware responded
    app.use(function (req, res) {
        res.status(404).send();
    });
    
	app.listen(process.env.PORT);
	
};



