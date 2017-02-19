//测试let命令
/*var a = 1;
let b= 2;
if (a === 1) {
  var a = 11; // the scope is global
  let b = 22; // the scope is inside the if-block

  console.log(a);  // 11
  console.log(b);  // 22
} 
console.log(a); // 11
console.log(b); // 2

var a = [];
for (let i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[6](); // 6
*/
const test = {
	//测试解构赋值
	Destructuring(){
		// let [a,b,c] = [1,2,3];
		// console.log(a+','+b+','+c);
		// let [x, y = 'b'] = ['a'];
		// console.log(x+','+y);
		// let n = 1;
		// let m = 3;
		// [a, b] = [n, m];
		// console.log(a+','+m); // 1,3
		function f() {
		  return [1, 2, 3];
		}

		let [a, , b] = f();
		console.log(a+','+b); // 1,3
	},
	object(){
		let o = {p: 42, q: true};
		let {p, q} = o;
		console.log(p+',',q);
	}
};
test.object();
//module.exports = test;



