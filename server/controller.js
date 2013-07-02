/**
 * Parent Controller
 */

// Module dependencies
var fs = require('fs'),
		Model = Model || Object,
		Controller = Object;

	// read through the controllers directory
	fs.readdirSync(__dirname + '/../controllers').forEach(function(name){

		// Remove .js from controller file names 
		name = name.slice(0, -3);
		objectName = name.capitalize() + 'Controller';

		// Export Controller as an object literal
		Controller[objectName] = (function() {

			// Private attribute that holds the single instance
			var controllerInstance; 

			function constructor() {
				return require('../controllers/' + name);
			}

			return {
				getInstance: function() {
					if(!controllerInstance)
						controllerInstance = constructor();
					return controllerInstance;
				}
			}

		})();

});

module.exports = Controller;