var controller =  require('../controllers/contacts.controller');

module.exports  = function(app){

    app.get('/api/contacts',controller.get);

    app.put('/api/contacts/:username',controller.addContact);
}