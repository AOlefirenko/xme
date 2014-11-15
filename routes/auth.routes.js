'use strict';
var passport = require('passport'),
    controller =  require('../controllers/auth.controller');

module.exports  = function(app){

    app.route('/auth/login').post(controller.login);
    app.route('/auth/logout').get(controller.logout);
    app.route('/auth/register').post(controller.register);

    app.route('/auth/facebook').get(passport.authenticate('facebook', {scope: ['email'], session: false }));
    app.route('/auth/facebook/callback').get(controller.oauthCallback('facebook'));
}