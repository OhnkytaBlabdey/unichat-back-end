'use-strict';
const list = [
	'./user_model',
	'./group_model',
	// './message_model',
	'./channel_model',
	'./user_in_group_model',
	'./channel_in_group_model'
];
let models = [];
for (const model of list) {
	models.push(require(model));
}
for (const model of models) {
	model.sync({
		force: true
	});
}