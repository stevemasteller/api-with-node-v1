/**
 * api-with-node-v1
 *
 * Implements a twitter interface that displays tweets, friends, and direct messages. Also, posts
 * tweets. Implements server side authentication using node and express. Uses pug for templating.
 * Also, implements error handling.
 *
 * @author Steve Masteller
*/
(function(){
'use strict';

/** Used as a routing framework */
var express = require('express');

var app = express();

/** Parses incoming request bodies in middleware */
var bodyParser = require('body-parser');

/** Creates HTTP errors for express */
var createError = require('http-errors');

/** An asynchronous client library for the Twitter REST and Streaming API's. */
var Twitter = require('twitter');

/** Get this data from your twitter apps dashboard and put it in ./src/config.json
 *    {
 *        "consumer_key": "XXX",
 *        "consumer_secret": "XXX",
 *        "access_token_key": "XXX",
 *        "access_token_secret": "XXX",
 *		  "screen_name": "XXX"
 *    }
*/
var config = require( __dirname + '/config.json');
var twitter = new Twitter(config);

/** Set view engine to pug. Jade deprecated. */
app.set('view engine', 'pug');

/** Look for templates in src/templates. */
app.set('views', __dirname + '/templates');

/** Look for static content in src/public. */
app.use('/static', express.static(__dirname + '/public'));

/** Set up server on Port 5000. */
app.listen(5000, function() {
	console.log("The frontend server is running on port 5000!");
});

/** Parse incoming request bodies. */
app.use(bodyParser.urlencoded({
	extended: true
}));

/** Route / posts twitter post. Displays index template. */
app.post('/', function(req, res, next) {
	
	/** Call to twitter API. Post a tweet. */
	twitter.post('statuses/update', {status: req.body.tweetText} , function (err, req, response) {
		if (!err) {
			
			/** Display screen after performing a post */
			twitterApp(req, res, next);
			
		} else {
			
			/** twitter.post failed */
			return next(createError(500, 'Failed to post message.'));
		}
	});
});

/** Route / gets to twitterApp. Displays 'index' template. */
app.get('/', function(req, res, next) {
	twitterApp(req, res, next);
});

/** Error Handler. Displays 'error' template. */
app.use( function(err, req, res, next) {
	console.log(err);
	res.render('error', {err: err});
});


/** 
 * twitterApp 
 *
 * Displays twitter data to screen. Displays 'index' template. 
 *
 * @param {Object} req    - contains http request object
 * @param (Object) res    - contains http response object
 * @param {function} next - callback for error propogation
 * @returns {Object} err  - express error object
*/
function twitterApp (req, res, next) {
	
	/** Call to twitter API. Get user data */
	twitter.get('users/show',{screen_name: config.screen_name}, function (err, userObj, response) {
		if (!err) {
			
			/** Call to twitter API. Get 5 user tweets. */
			twitter.get('statuses/user_timeline',{screen_name: config.screen_name, count: '5'}, function (err, tweetsObj, response) {
				if (!err) {
					
					/** Call to twitter API. Get 5 user friends. */
					twitter.get('/friends/list.json',{screen_name: config.screen_name, count: '5'}, function (err, friendsObj, response) {
						if (!err) {

							/** Call to twitter API. Get 5 user direct messages. */
							twitter.get('direct_messages/sent.json',{screen_name: config.screen_name, count: '5'}, function (err, messagesObj, response) {
								if (!err) {
								
									/**
									 * Call render function of http response object.
									 * Pass user data, tweets, friends, and direct messages
									 * to 'index' view.
									*/
									res.render('index', {
										userObj: userObj,
										tweetsObj: tweetsObj,
										friendsObj: friendsObj.users,
										messagesObj: messagesObj
									});
								} else {
									
									/** twitter.get failed */
									return next(createError(500, 'Failed to get direct messages.'));
								}
							});
						} else {
							
							/** twitter.get failed */
							return next(createError(500, 'Failed to get friends list.'));						
						}
					});
				} else {
					
					/** twitter.get failed */
					return next(createError(500, 'Failed to get tweets.'));							
				}
			});
		} else {
			
			/** twitter.get failed */
			return next(createError(500, 'Failed to get user info.'));
		}
	});
}

})();
