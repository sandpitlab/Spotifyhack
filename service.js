"use strict";

var express = require('express'),
  app = express(),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	symbol = require('log-symbols'),
	configFile = require('config'),
	symbols = require('log-symbols'),
	mongo = require('./lib/mongo.js')(),
	User = require('./models/user.js');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');

global.log = console.log.bind(console);

require('./lib/passport-config.js')(passport);

// middleware
app.use(methodOverride());
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));


// CONFIG
var config = configFile.get('Pitspot');
var PORT = config.service.port;

app.set('view engine', 'ejs'); // set up ejs for templating
app.use(express.static(__dirname + '/public'))

// required for passport
app.use(session({ secret: 'pitspot', saveUninitialized: true, resave: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./routes/routes')(app);
require('./routes/auth.js')(app, passport);


app.listen(PORT);
log(symbols.success, 'Magic happens on port:', PORT);
