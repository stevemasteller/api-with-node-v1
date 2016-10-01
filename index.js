'use strict';

var express = require('express');

var app = express();

// set up server on Port 3000
app.listen(3000, function() {
	console.log("The frontend server is running on port 3000!");
});
