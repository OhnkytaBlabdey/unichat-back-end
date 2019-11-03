"use-strict";
const list = ['./user_model', './group_model'];
let models = [];
for (const model of list) {
	models.push(require(model))
}
for (const model of models) {
	model.sync({
		force: true
	});
}