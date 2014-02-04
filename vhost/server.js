var express = require('express');
var app = express();

app
    .use(express.vhost('www.jordanranson.com', require('./www/server.js').app))
    //.use(express.vhost('partyplay.jordanranson.com', require('./partyplay/server.js').app))
    //.use(express.vhost('blasteroids.jordanranson.com', require('./blasteroids/server.js').app))
    .listen(80);