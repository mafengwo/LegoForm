/**
 * Created by mafengwo on 16/5/30.
 */

var express = require('express'),
    app = new express(), port = 3000,
    api = require('./api/index');


app.get("/", function (req, res) {
    res.sendFile(__dirname + '/index.html')
});
app.use(express.static('public/'));

api.routeConfig(app);

app.listen(port, function (error) {
    if (error) {
        console.error(error)
    } else {
        console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
    }
});