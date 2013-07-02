/**
 * User Controller
 */

// controller dependencies
var passport = require('passport');

var UserController = {
	login: {
		
		path: '/login',
		restricted: false,
		get: function(req, res){
			if(req.session.passport.user) {
				res.redirect('/dashboard');
			} else {
				res.render(
					'user/login', 
					{
					 	title: 'Vocada | Login',
					 	message: req.session.messages
					}
				);
			}
		},
		post: passport.authenticate('local', 
			{ 
				successRedirect: '/dashboard',
				failureRedirect: '/login',
				failureMessage: true 
			}
		)
	},

	logout: {

		path: '/logout',
		restricted: false,

		get: function(req, res) {
			req.session.destroy(function(){
			  res.redirect('/login');
			});
		}
	},

	create: {

		restricted: false,
		get: function(req, res) {
			res.render(
				'user/create', 
				{
			  	title: 'Vocada | Create User'
			 	}
			)
		},
		post: function(req, res, next) {
			Model.User.findOne({email: req.body.email}, function(err, user) {
				if (err) return next(err);
				if(!user) {
					var newUser = new Model.User({
						email: req.body.email,
						password: req.body.password
					});

					newUser.save(function(err){
						if (err) return next(err);
						req.login(newUser, function(err) {
						  if (err) return next(err);
						  res.redirect('/dashboard');
						});
					});
				} else {
					req.session.messages.push("This email is already registered");
					res.redirect('/user/create');
				}
			});		
		}
	},

	dashboard: {

		path: '/dashboard',
		get: function(req, res) {
			res.render(
				'user/dashboard', 
				{
			  	title: 'Vocada | User Dashboard'
			 	}
			)
		}
	},

	profile: {

		path: '/profile',
		get: function(req, res) {
			res.render(
				'user/profile', 
				{
			  	title: 'Vocada | User Profile'
			 	}
			)
		},
		put: function(req, res) {

		}
	},

	delete: {
		get: function(req, res) {
				res.send(req.session.passport.user);
		},
		delete: function(req, res) {
			if(req.session.passport.user) {
				var id = req.session.passport.user;
				Model.User.remove({ _id: id }, function (err) {
				  if (err) throw err;
				  req.session.destroy(function(){
					  res.redirect('/user/create');
					});
				});
			}
		}
	}
}

module.exports = UserController;