var express = require('express');
var sqlite3 = require('sqlite3');
var router = express.Router();
var db = new sqlite3.Database("splashes.db");

function getSplashContent(id, after) {
	// TODO: Actually get content
	after(null);
}

/* GET home page. */
router.get('/', function(req, res, next) {
	getSplashContent(null, function(content){
		res.render('splash', {preload: content});
	});
});

/* TODO: endpoint to retrieve splash content */

module.exports = router;
