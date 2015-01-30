var controller =  require('../controllers/contacts.controller');

module.exports  = function(app){

    app.get('/api/contacts',controller.get);

    app.put('/api/contacts/:username',controller.addContact);

    app.put('/api/contacts/:username/lock',controller.lockContact);
    app.put('/api/contacts/:username/unlock',controller.unlockContact);
    app.put('/api/appeals/:username/unlock',controller.unlockContact);
}