'use strict';

var express = require('express');

var app = express();

//set view engine to serve middleware
app.set('view engine', 'pug');
//set where to look for templates
app.set('views', __dirname + '/templates');

// set folder structure for middleware to be able to call stylesheets
app.use('/static', express.static(__dirname + '/public'));

app.use('/', indexPage);

var router = express.Router();

/* GET index page. */
router.get('/', function(req, res, next) {
  indexPage();
});

// set up server on Port 3000
app.listen(3000, function() {
	console.log("The frontend server is running on port 3000!");
});




//Twitter App

var Twitter = require('twitter');

//Get this data from your twitter apps dashboard and put it in ./src/twitter-api-secrets.json
//    {
//        "consumer_key": "XXX",
//        "consumer_secret": "XXX",
//        "access_token_key": "XXX",
//        "access_token_secret": "XXX",
//		  "screen_name": "XXX"
//    }

var config = require( __dirname + '/config.json');

var twitter = new Twitter(config);


function indexPage() {
	twitter.get('users/show',{screen_name: config.screen_nam}, function (error, userObj, response) {
		if (error) {
			errMasg;
		} else {
			
			twitter.get('statuses/user_timeline',{screen_name: config.screen_name, count: '5'}, function (error, tweetsObj, response) {
				if (error) {
					errMsg;
				} else {
					
					twitter.get('/friends/list.json',{screen_name: config.screen_name, count: '5'}, function (error, friendsObj, response) {
						if (error) {
							errMsg;
						} else {

							twitter.get('direct_messages/sent.json',{screen_name: config.screen_name, count: '5'}, function (error, messagesObj, response) {
								if (error) {
									errMsg;
								} else {
								
									app.get('/', function (req, res) {
										
										res.render('index', {
											userObj: userObj,
											tweetsObj: tweetsObj,
											friendsObj: friendsObj.users,
											messagesObj: messagesObj
										});
									});
								}
							});
						}
					});
				}
			});
		}
	});
}
