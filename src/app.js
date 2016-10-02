'use strict';

var express = require('express');

var app = express();

//set view engine to serve middleware
app.set('view engine', 'pug');
//set where to look for templates
app.set('views', __dirname + '/templates');

// set folder structure for middleware to be able to call stylesheets
app.use('/static', express.static(__dirname + '/public'));

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
//		  "screenName": "XXX"
//    }

var config = require( __dirname + '/config.json');

var twitter = new Twitter(config);

twitter.getUser({screen_name: 'SteveRMasteller'}, error, function (data) {
//	success(data);
	var userObj = JSON.parse(data);
	
	twitter.getUserTimeline( {screen_name: 'SteveRMasteller', count: '5'}, error, function (data) {
//		success(data);
		var tweetsObj = JSON.parse(data);
		
		twitter.getCustomApiCall('/friends/list.json',{screen_name: 'SteveRMasteller', count: '5'}, error, function (data) {
//			success(data);
			var friendsObj = JSON.parse(data);

			twitter.getCustomApiCall('direct_messages',{screen_name: 'SteveRMasteller', count: '5'}, error, function (data) {
				success(data);
				var messagesObj = JSON.parse(data);
				
				app.get('/', function (req, res) {
					
					res.render('index', {
						userObj: userObj,
						tweetsObj: tweetsObj,
						friendsObj: friendsObj,
						messagesObj: messagesObj
					});
				});
			});
		});
	});
});
	
