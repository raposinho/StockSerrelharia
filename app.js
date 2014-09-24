//external modules
var express = require('express'),
    mongoose = require('mongoose');

//external modules (middleware)
var flash = require('connect-flash'),
    bodyParser = require('body-parser'),
    morgan = require('morgan');

//custom modules
var routing = require('./config/routing'),
    envVariables = require('./config/env_variables'),
    logger = require('./logger');

//mongoose.connect(envVariables.dbConnectionString);

// create and configure express app
var app = express();
    
    app.use(flash());
    app.use(bodyParser());    
    app.use(express.static(__dirname + '/public'));

    //view related configs
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/view');


    //logging configuration
    logger.debug("Overriding 'Express' logger");
    app.use(morgan({ "stream": logger.stream }));

    var appRouter = express.Router();
    routing.applyRoutes(appRouter);
    app.use('/', appRouter);


app.listen(envVariables.port, function() {
    logger.info("Starting to listen on port %s", envVariables.port);
});
