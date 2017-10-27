#!/usr/bin/env nodejs
//Quick note: Some of this code (tagged "Boilerplate") was taken from a simple Node+Express sample
//somewhere on the internet, quite a while ago. So someone out there deserves credit for it!
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3');

// TODO: Set up database and table
var db = new sqlite3.Database("splashes.db");
db.serialize(function(){
	db.run("CREATE TABLE IF NOT EXISTS splashes (id INTEGER, content TEXT, PRIMARY KEY(`id`));");
});

// Boilerplate: general setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// TODO: Set up our routes
app.use('/', require('./routes/splash'));
app.use('/actions', require('./routes/actions'));

// Boilerplate: error handling
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});
app.use(function(err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
