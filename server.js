/**
 * Setup and module dependencies
 */

var PORT       = 3000,
    APP_KEY    = '1puqINX0vrCYGDL6',
    APP_SECRET = 'hfu3s2kvLvfdpU4tV3YINaaqm0Q72N58';

var express = require('express'),
    exphbs  = require('express3-handlebars'),
    http    = require('http'),
    path    = require('path'),
    api     = require('./routes/api.js')(APP_KEY, APP_SECRET),
    routes  = require('./routes/routes.js')(api.api, '52f07df74ba4c5962fc6366f'),
    app     = exports.app = express();


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

    //app.set('view engine', 'ejs');
    app.engine('handlebars', exphbs({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');

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
