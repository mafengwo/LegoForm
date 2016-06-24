var legoDef = require('./json/legoDef.json'),
    formData = require('./json/formData.json'),
    controller;

controller = {

    getLegoDef: function (req, res) {
        res.send(legoDef);
    },

    getFormData: function (req, res) {
        res.send(formData);
    }
};


module.exports = {

    routeConfig: function (app) {
        app.get('/api/legoDef', controller.getLegoDef);
        app.get('/api/formData', controller.getFormData);
    }
};