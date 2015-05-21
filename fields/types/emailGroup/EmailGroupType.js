/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	keystone = require('../../../'),
	querystring = require('querystring'),
	https = require('https'),
	util = require('util'),
	utils = require('keystone-utils'),
	super_ = require('../Type');

/**
 * Location FieldType Constructor
 * @extends Field
 * @api public
 */

function emailGroup(list, path, options) {

	this._fixedSize = 'full';

	if (!options.defaults) {
		options.defaults = {};
	}

	this.requiredPaths = [];

	emailGroup.super_.call(this, list, path, options);
}

/*!
 * Inherit from Field
 */

util.inherits(emailGroup, super_);


/**
 * Registers the field on the List's Mongoose Schema.
 *
 * @api public
 */

emailGroup.prototype.addToSchema = function() {
	var field = this,
		schema = this.list.schema,
		options = this.options;

	var paths = this.paths = {
		sendEmail: this._path.append('.sendEmail'),
		emailSubject: this._path.append('.emailSubject'),
		emailBody: this._path.append('.emailBody')
	};

	var getFieldDef = function(type, key, defaultVal) {
		var def = { type: type };

		def.default = defaultVal;

		return def;
	};

	var auxPath=this.path;

	keystone.list('EmailTemplate').model.findOne({name : 'newMeetup'}).exec(function(err, template) {
		console.log(err);
		console.log(template);
		schema.nested[auxPath] = true;
		schema.add({
			sendEmail: getFieldDef(Boolean, 'sendEmail', "false"),
			emailSubject: getFieldDef(String, 'emailSubject', template.subject),
			emailBody: getFieldDef(String, 'emailBody', template.content)
		}, auxPath + '.');
	});
};


/**
 * Detects whether the field has been modified
 *
 * @api public
 */

emailGroup.prototype.isModified = function(item) {
	return 
		item.isModified(this.paths.sendEmail) ||
		item.isModified(this.paths.emailSubject) ||
		item.isModified(this.paths.emailBody)
};


/**
 * Validates that a value for this field has been provided in a data object
 *
 * options.required specifies an array or space-delimited list of paths that
 * are required (defaults to emailSubject, suburb)
 *
 * @api public
 */

emailGroup.prototype.validateInput = function(data, required, item) {
	
	if (!required) {
		return true;
	}
	
	var paths = this.paths,
		nested = this._path.get(data),
		values = nested || data,
		valid = true;
	
	this.requiredPaths.forEach(function(path) {
		
		if (nested) {
			if (!(path in values) && item && item.get(paths[path])) {
				return;
			}
			if (!values[path]) {
				valid = false;
			}
		} else {
			if (!(paths[path] in values) && item && item.get(paths[path])) {
				return;
			}
			if (!values[paths[path]]) {
				valid = false;
			}
		}
		
	});
	
	return valid;
	
};


/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */

emailGroup.prototype.updateItem = function(item, data) {

	var paths = this.paths,
		fieldKeys = ['sendEmail','emailSubject', 'emailBody'],
		valueKeys = fieldKeys,
		valuePaths = valueKeys,
		values = this._path.get(data);

	if (data['notifyEmail.sendEmail']){
		data['notifyEmail.sendEmail']='true';
	}
	else{
		data['notifyEmail.sendEmail']='false';
	}


	if (!values) {
		// Handle flattened values
		valuePaths = valueKeys.map(function(i) {
			return paths[i];
		});
		values = _.pick(data, valuePaths);
	}
	
	// convert valuePaths to a map for easier usage
	valuePaths = _.object(valueKeys, valuePaths);
	
	var setValue = function(key) {
		if (valuePaths[key] in values && values[valuePaths[key]] !== item.get(paths[key])) {
			item.set(paths[key], values[valuePaths[key]] || null);
		}
	};

	_.each(fieldKeys, setValue);
};

/*!
 * Export class
 */

exports = module.exports = emailGroup;
