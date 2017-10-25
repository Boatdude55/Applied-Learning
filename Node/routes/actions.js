var express = require('express');
var sqlite3 = require('sqlite3');
var factorial = require('factorial');
var router = express.Router();
var db = new sqlite3.Database("splashes.db");

/* GET input page. */
router.get('/', function(req, res, next) {
	res.render('actions', {});
});

/* Compute data and return result. */
router.post('/compute', function(req, res) {
	result = 0;
	//TODO: Actually calculate result
	
	res.send({result: result});
});

/* TODO: endpoint to set splash screen. */

module.exports = router;
