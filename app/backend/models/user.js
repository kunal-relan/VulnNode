'use strict';

var mongoose 		= require('mongoose');
var findOrCreate 	= require('mongoose-findorcreate');
var bcrypt 			= require('bcrypt-nodejs');

var userSchema 	= mongoose.Schema({
    fullname: {type: String},
	email: {type: String},
	password: {type: String},
	sessioncache: String
});

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

userSchema.plugin(findOrCreate);

mongoose.model('User', userSchema);
