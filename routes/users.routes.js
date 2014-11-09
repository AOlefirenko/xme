var controller =  require('../controllers/users.controller');

module.exports  = function(app){
    app.get('/api/users/me',controller.getMe);
    app.patch('/api/users/me',controller.patch);

    app.get('/users/checker',controller.checkUser);
}
