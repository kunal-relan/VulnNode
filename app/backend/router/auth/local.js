'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Remember = mongoose.model('Remember');
var User = mongoose.model('User');


module.exports = function (passport) {

	router.post('/signup',function (req, res) {
			var user = new User(req.body);
			user.save();
			res.json({'error':false,'msg':'User Created'})

	});


	router.post('/signin',function (req, res) {
			var user = User.findOne({'email':req.body.email,'password':req.body.password},{'password':0},function(err,doc){

				if(!doc){
					res.send('Sorry Not Found');
					console.log(err);
				}else{

					res.send(doc);
				}
			})
	});


	router.get('/signedin', function (req, res) {
		res.send(req.isAuthenticated() ? req.user : '0');
	});


	router.post('/signout', function (req, res) {
		Remember.findOne({login: req.user.email}, function (err, token) {
			if (err) {
				throw err;
			}
			if (token) {
				token.remove(function (err) {
					if (err) { throw err; }
				});
			}
			req.logOut();
			res.sendStatus(200);
		});
	});


	return router;

};