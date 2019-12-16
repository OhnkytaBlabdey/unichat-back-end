'use-strict';

const l = [{
	a: '1'
}, {
	a: '2'
}];
const l2 = l.map((it) => {
	return it.a;
});
console.log(l2);