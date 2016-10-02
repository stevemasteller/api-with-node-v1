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

var Twitter = require('twitter');

//Get this data from your twitter apps dashboard and put it in ./src/twitter-api-secrets.json
//    {
//        "consumer_key": "XXX",
//        "consumer_secret": "XXX",
//        "access_token_key": "XXX",
//        "access_token_secret": "XXX",
//        "callBackUrl": "XXX"
//		  "screenName": "XXX"
//    }

var config = require( __dirname + '/config.json');

var twitter = new Twitter(config);

twitter.get('users/show',{screen_name: 'SteveRMasteller'}, function (error, userObj, response) {
	
	twitter.get('statuses/user_timeline',{screen_name: 'SteveRMasteller', count: '5'}, function (error, tweetsObj, response) {
		
		twitter.get('/friends/list.json',{screen_name: 'SteveRMasteller', count: '5'}, function (error, friendsObj, response) {

			twitter.get('direct_messages',{screen_name: 'SteveRMasteller', count: '5'}, function (error, messagesObj, response) {
				
				app.get('/', function (req, res) {
					
					res.render('index', {
						userObj: userObj,
						tweetsObj: tweetsObj,
						friendsObj: friendsObj.users,
						messagesObj: messagesObj
					});
				});
			});
		});
	});
});
	
