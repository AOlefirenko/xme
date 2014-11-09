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

console.log(require('./routes/core.routes'));
    require('./routes/core.routes')(app);
    require('./routes/auth.routes')(app);
    require('./routes/contacts.routes')(app);
    require('./routes/users.routes')(app);


	app.listen(process.env.PORT);
	
};



