var express = require('express')
var app = express()

app.get('/', function(req, res) {
	res.render('index', {title: 'Welcome To HTC ADD Employee Dasboard Screen Kindly Click the Add HTC Employee link'})
})

module.exports = app;
