'use-strict';

const connection = require('../db_config');
const Sequelize = require('sequelize');
const log = require('../../logger');

const define_model = (name) => {
	const model_path = 'src/db/model/' + name + '_model.json';
	const fs = require('fs');
	let config = null;
	try {
		config = fs.readFileSync(model_path);
	} catch (err) {
		log.warn(err);
		return config;
	}
	const json_config = JSON.parse(config);
	let model_config = {};
	const type_mapping = {
		'INT': Sequelize.INTEGER,
		'STRING': Sequelize.STRING
	};
	for (const col of json_config.cols) {
		const name = col.name;
		const type = col.type;
		model_config[name] = {
			allowNull: false,
			type: type_mapping[type],
			validate: {
				notNull: true
			}
		};
		let flag = false;
		if (col.type === 'ENUM') {
			model_config[name]['type'] = Sequelize.DataTypes.ENUM(
				col.restrict.in
			);
			model_config[name].validate['isIn'] = [col.restrict.in];
			flag = true;
		}
		if (col.default) {
			model_config[name].defaultValue = col.default;
		}
		if (col.unique) {
			model_config[name].unique = col.unique;
		}
		if (!col.restrict) continue;

		if (col.restrict.min_length || col.restrict.max_length) {
			model_config[name].validate['len'] = [
				col.restrict.min_length || 1,
				col.restrict.max_length || 255
			];
			flag = true;
		}
		if (col.restrict.is) {
			model_config[name].validate['is'] = col.restrict.is;
			flag = true;
		}
		if (col.restrict.property) {
			for (const prop of col.restrict.property) {
				model_config[name].validate[prop] = true;
			}
			flag = true;
		}
		if (!flag && JSON.stringify(col.restrict) != '{}')
			log.warn('[cannot recognize restriction]' + JSON.stringify(col.restrict));
	}
	log.info(model_config);
	const model = connection.define(
		't_' + json_config.name, model_config, {
			timestamps: true
		}
	);
	log.info('[created model] : ' + model);

	return model;
};

module.exports = define_model;