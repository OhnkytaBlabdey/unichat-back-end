"use-strict";

const connection = require('./db_config')

const define_model = (name) => {
	const model_path = './model/' + name + '_model.json';
	const fs = require('fs');
	let config = null;
	try {
		config = fs.readFileSync(model_path);
	} catch (err) {
		console.warn(err);
		return null;
	}
	const model_config = JSON.parse(config);
	const model = connection.define(
		't_' + name, model_config, {
			timestamps: true
		}
	);
	console.log('[created model] : ' + model);
	return model;
}

module.exports = define_model;