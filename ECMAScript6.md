#### ES6浅入浅出
虽然es6的标准在2015年已经出来，但一直没能总结一下，网上各种教程很多，这里个人总结一下常用的语法知识，具体还需参考各类文档。

#### 各种参考
* [learn ES2015](https://babeljs.io/learn-es2015/)
* [es6features](https://github.com/lukehoban/es6features#readme)
* [Mozilla开发者官网](https://developer.mozilla.org/zh-CN/)
* 阮一峰老师[es6入门](http://es6.ruanyifeng.com/ "es入门")

#### 环境
ES6目前浏览器不全部支持，需要bebal转换成标准的ES5才能被各浏览器支持，因此简单搭建了[es6运行环境](https://github.com/sam-dingkang/es6/tree/master/webpack-es6)


### let和const
ES6的let类似于var,只是var声明有全局作用域和局部作用域，而let声明只在块级作用域内有效

	var a = 1;
	let b= 2;
	if (a === 1) {
	  var a = 11; // the scope is global
	  let b = 22; // the scope is inside the if-block
	
	  console.log(a);  // 11
	  console.log(b);  // 22
	} 
	console.log(a); // 11
	console.log(b); // 2

	因此在for循环的计数器，就很合适使用let命令
	var a = [];
	for (var i = 0; i < 10; i++) {
	  a[i] = function () {
	    console.log(i);
	  };
	}
	a[6](); // 10
	在for循环完，数组a有10个function,i在全局作用域下，调用数组任一个方法得到的都是最后执行完循环的i=10;所以输出10
	var a = [];
	for (let i = 0; i < 10; i++) {
	  a[i] = function () {
	    console.log(i);
	  };
	}
	a[6](); // 6
	循环中var声明的变量在全局作用，每次都覆盖，而let仅在块级作用域有效，每次都是新的变量，最后输出6，具体见阮老师文章

* var声明会有变量提前，如果在声明前使用就是undefined，而let则避免这种现象，一定在let声明后使用，否则报ReferenceError
* 存在暂时性死区：在区块中使用let命令声明变量之前，该变量都是不可用的。因此，凡是在声明之前就使用这些变量，就会报错。
* let不允许在相同作用域内，重复声明同一个变量

#### const
* const声明一个只读的常量。一旦声明，常量的值就不能改变。因此，一旦声明const，就必须立即初始化，	不能留到以后赋值。
* 和let一样，只在声明所在的块级作用域内有效，同样存在"暂时性死区"，不允许在相同作用域内声明同一个变量

### Destructuring:解构赋值
>数组解构赋值

	1.基本用法(Basic variable assignment)
	let [a,b,c] = [1,2,3];
	console.log(a+','+b+','+c); // 1,2,3
	2.默认值(Default values)
	let [x, y = 'b'] = ['a'];
	console.log(x+','+y); // a,b
	3.交换变量(Swapping variables)
	let n = 1;
	let m = 3;
	[a, b] = [n, m];
	console.log(a+','+m); // 1,3
	4.从方法中返回数组（Parsing an array returned from a function），省略一些返回值(Ignoring some returned values)
	function f() {
	  return [1, 2, 3];
	}

	let [a, , b] = f();
	console.log(a+','+b); // 1,3
	5.将剩余数组赋值给一个变量
	const [a, ...b] = [1, 2, 3];
	console.log(a); // 1
	console.log(b); // [2, 3]
>对象解构赋值

	1.默认值
	let {a= 'aa',b,c} = {a: 1,b: 2,c: 3};
	a // 1
	b // 2
	c // 3
	2.给新的变量名赋值
	let obj = { h: 'hello', w: 'world' };
	let { h: hello, w: world } = obj;
	hello // 'hello'
	world // 'world'
	3.无申明赋值
	let a;
	let b;
	({a,b} = {a: 'aa',b: 'bb'})
	a // 'aa'
	b // 'bb' 
>函数参数的解构赋值

	function drawES5Chart(options) {
	  options = options|| {};
	  var size = options.size || 'big';
	  var radius = options.radius || 25;
	  console.log(size,radius);
	}

	drawES5Chart({
	  radius: 30
	});		

	ES6函数参数可通过解构赋值
	function drawES5Chart({size = 'big',radius = 25}) {
	  console.log(size,radius);
	}
	drawES5Chart({
	  radius: 30		
	});

### Default + Rest + Spread
简单理解为三种形式的参数：Default parameters,Rest parameters, Spread Operator


	function f(x, y=12) {
	  // y若果不传或传一个undefined，y会默认赋值12
	  return x + y;
	}
	f(3) // 15

	function f1(x, ...y) {
	  // y is an Array
	  return x * y.length;
	}
	f1(3,4,5,6) // 9

	function f2(x, y, z) {
	  return x + y + z;
	}
	f2(...[1,2,3]) // 6
	// 数组的每个元素对应为argument，而这之前，如果要将数组作为参数，需要用f2.apply(this,[1,2,3])


### Template Strings:模板字符串

模板字符串提供构建字符串的语法糖,使用反引号 (``) 来代替普通字符串中的用双引号和单引号.模板字符串可以包含特定语法(${expression})的占位符。

```
const name = "sam"; const knowledgeId=201602125401;
`Hello ${name}, how are you tody?`
<a href=`sddhttps://cshall.alipay.com/enterprise/knowledgeDetail.htm?knowledgeId=${knowledgeId}`>跳转链接</a>

const list = [{id:210,name:'sam'},{id:234,name:'coco'}];
let template = '';
list.map(function(item){
	tetemplate += `<li class="test">${item.name}</li>`
});
$('#ul').html(template);

```

### arrows and lexical this: 箭头函数和this的词法
箭头函数使用=>语法简写，定义了自己的 this 值。箭头函数的引入有两个方面的作用：一是更简短的函数书写，二是对 this的词法解析。
```
singleParam => { statements; }
// 正常函数写法
[1,2,3].map(function (x) {
  return x * x;
});

// 箭头函数写法
[1,2,3].map(x => x * x);

```
 >不绑定 this
 
```
var adder = {
  base : 1,
    
  add : function(a) {
    var f = v => v + this.base;
    return f(a);
  },

  addThruCall: function(a) {
    var f = v => v + this.base;
    var b = {
      base : 2
    };       
    return f.call(b, a);
  }
};

console.log(adder.add(1));         // 输出 2
console.log(adder.addThruCall(1)); // 仍然输出 2（而不是3）

```
### classes: 类
es6中class是基于原型的面向对象的简单写法(语法糖)，class支持基于原型的继承，super()调用，实例和静态方法，构造函数

```
class Rectangle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  } 
  get area() {
    return this.calcArea()
  }
  calcArea() {
    return this.height * this.width;
  }
}
const square = new Rectangle(10, 10);
console.log(square.area);

通过extends继承和使用super调用父对象的函数
class A {
  constructor() {
    this.x = 1;
  }
  print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  m() {
    super.print();
  }
}

let b = new B();
b.m() // 2

```
### promise
* Promise是抽象异步处理对象,它提供统一的API,各种异步操作都可以用同样的方法进行处理。
* 有了Promise对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。

```
var aPromise = new Promise(function(resolve, reject){
    setTimeout(function(){
        resolve("模拟异步"); 
    }, 500);
});

aPromise.then(function(message){

    console.log("test" + message);
});

**promise在异步请求的例子**

function getURL(URL) {
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('GET', URL, true);
        req.onload = function () {
            if (req.status === 200) {
                resolve(req.responseText);
            } else {
                reject(new Error(req.statusText));
            }
        };
        req.onerror = function () {
            reject(new Error(req.statusText));
        };
        req.send();
    });
}
var URL = "http://httpbin.org/get";
getURL(URL).then(function onFulfilled(value){
    console.log(value);
}).catch(function onRejected(error){
    console.error(error);
});

```
有关promise详细内容参考[promise迷你书](http://liubin.org/promises-book/#chapter1-what-is-promise)

### Math + Number + String + Array + Object APIs

```
[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number "Number API")
[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math "Math API")

"abcde".includes("cd") // true
"abc".repeat(3) // "abcabcabc"
"abcdef".startsWith("ab") // true
"abcdef".endsWith("ef") // true

Array.from(document.getElementsByTagName('div')) // 返回NodeList的数组
Array.of("a", 2, 3) // ["a",2,3]
[1, 4, -5, 10].find((n) => n < 0) // -5
[1,2,3].findIndex(x => x == 2) // 1
["a", "b", "c"].entries() // iterator [0, "a"], [1,"b"], [2,"c"]
["a", "b", "c"].keys() // iterator 0, 1, 2
["a", "b", "c"].values() // iterator "a", "b", "c"
数组的entries()、keys()、values()都返回的是一个遍历器，可以用for...of循环
for (let index of ['a', 'b'].keys()) {
  console.log(index);
}
// 0
// 1

for (let elem of ['a', 'b'].values()) {
  console.log(elem);
}
// 'a'
// 'b'

for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem);
}
// 0 "a"
// 1 "b"

Object.assig()方法
var obj = { a: 1 };
var copy = Object.assign({}, obj);
console.log(copy); // { a: 1 }
需要注意的是Object.assign()是浅拷贝，容易使目标对象也改变
var o1 = { a: 1 };
var o2 = { b: 2 };
var o3 = { c: 3 };

var obj = Object.assign(o1, o2, o3);
console.log(obj); // { a: 1, b: 2, c: 3 }
console.log(o1);  // { a: 1, b: 2, c: 3 }

```
