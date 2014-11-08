var controller =  require('../controllers/users.controller');

module.exports  = function(app){
    app.get('/api/users/me',controller.getMe);

    app.get('/users/checker',controller.checkUser);
}
