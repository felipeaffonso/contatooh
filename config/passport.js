// config/passport.js

var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var mongoose = require('mongoose');

module.exports = function() {

	var Usuario = mongoose.model('Usuario');

	passport.use(new GitHubStrategy({
			clientID: 'fcf66081978d2bb45abc',
			clientSecret: '8083d2518cf4ada72dced737310ac155a8bc71c2',
			callbackURL: 'http://localhost:3000/auth/github/callback'
		}, function(accessToken, refreshToken, profile, done) {
			Usuario.findOrCreate(
				{ "login" : profile.username} ,
				{ "nome" : profile.username}, 
				function(erro, usuario) {
					if(erro) {
						console.log(erro);
						return done(erro);
					}
					return done(null, usuario);
				}
			);
		}
		)
	);
	

	passport.serializeUser(function(usuario, done) {
		done(null, usuario._id);
	});

	passport.deserializeUser(function(id, done) {
		Usuario.findById(id).exec()
			.then(function(usuario) {
				done(null, usuario);
			});
	});
};