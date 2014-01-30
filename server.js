/**
 * Setup and module dependencies
 */

var PORT       = 3001,
    APP_KEY    = 'abc123',
    APP_SECRET = 'ssh-secret';

var express = require('express'),
    http    = require('http'),
    path    = require('path'),
    routes  = require('./routes/routes.js'),
    api     = require('./routes/api.js')(APP_KEY, APP_SECRET),
    app     = express();


/**
 * Express configuration
 */

app.configure(function() {
    app.set('port', PORT);

    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    app.use(app.router);
    app.use(express.static(__dirname + '/public'));

    app.set('view engine', 'ejs');

    // For development purposes only
    if (app.get('env') === 'development') {
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    }
});


/**
 * Routes
 */

// Public routes
app.get('/', routes.index);

// Internal API
app.get('/sam/stories', api.stories);
app.get('/sam/stories/:id', api.story);


/**
 * Initialization
 */

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
