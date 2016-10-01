'use strict';

var express = require('express');

var app = express();

//set view engine to serve middleware
app.set('view engine', 'jade');
//set where to look for templates
app.set('views', __dirname + '/templates');

app.get('/', function(req, res) {
	res.render('index.pug');
});

// set up server on Port 3000
app.listen(3000, function() {
	console.log("The frontend server is running on port 3000!");
});




//Twitter App
// Callback functions 
var error = function (err, response, body) {
    console.log('ERROR [%s]', JSON.stringify(err));
};

var success = function (data) {
    console.log('Data [%s]', data);
};

var Twitter = require('twitter-node-client').Twitter;

//Get this data from your twitter apps dashboard and put it in ./src/twitter-api-secrets.json
//    {
//        "consumerKey": "XXX",
//        "consumerSecret": "XXX",
//        "accessToken": "XXX",
//        "accessTokenSecret": "XXX",
//        "callBackUrl": "XXX"
//    }

var config = require( __dirname + '/config.json');

var twitter = new Twitter(config);
	
twitter.getUserTimeline({ screen_name: 'SteveRMasteller', count: '10'}, error, success);
	
