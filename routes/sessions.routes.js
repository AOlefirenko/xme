var controller =  require('../controllers/sessions.controller');

module.exports  = function(app){
    app.route('/api/sessions/').post(controller.createSession);
    app.route('/api/sessions/:id').delete(controller.deleteSession);
}
