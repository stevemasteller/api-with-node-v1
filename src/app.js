'use strict';

var express = require('express');

var app = express();

var Twitter = require('twitter');

//Get this data from your twitter apps dashboard and put it in ./src/config.json
//    {
//        "consumer_key": "XXX",
//        "consumer_secret": "XXX",
//        "access_token_key": "XXX",
//        "access_token_secret": "XXX",
//		  "screen_name": "XXX"
//    }

var config = require( __dirname + '/config.json');

var twitter = new Twitter(config);

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

//Error handler
app.on('uncaughtException', function (err) {
    console.log(err);
	res.render('error', err);
}); 

//Twitter App
app.get('/', function(req, res) {
	twitter.get('users/show',{screen_name: config.screen_name}, function (err, userObj, response) {
		if (!err) {
			
			twitter.get('statuses/user_timeline',{screen_name: config.screen_name, count: '5'}, function (err, tweetsObj, response) {
				if (!err) {
					
					twitter.get('/friends/list.json',{screen_name: config.screen_name, count: '5'}, function (err, friendsObj, response) {
						if (!err) {

							twitter.get('direct_messages/sent.json',{screen_name: config.screen_name, count: '5'}, function (err, messagesObj, response) {
								if (!err) {
								
									res.render('index', {
										userObj: userObj,
										tweetsObj: tweetsObj,
										friendsObj: friendsObj.users,
										messagesObj: messagesObj
									});
								}
							});
						}
					});
				}
			});
		}
	});
});
