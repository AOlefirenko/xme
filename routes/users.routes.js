var controller =  require('../controllers/users.controller');

module.exports  = function(app){
    app.route('/api/users/me').get(controller.getMe)
        .patch(controller.patch);
    app.route('/api/users').get(controller.search)
    app.get('/users/checker',controller.checkUser);
}
