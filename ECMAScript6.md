### 《深入理解的ES6》的总结
虽然es6的标准在2015年已经出来，网上各种学习资料很多，在看完《深入理解的ES6》这本书后，决定总结一下个人。
#### 各种学习参考
* 《深入理解ES6》
* [learn ES2015](https://babeljs.io/learn-es2015/)
* [es6features](https://github.com/lukehoban/es6features#readme)
* [Mozilla开发者官网](https://developer.mozilla.org/zh-CN/)
* 阮一峰老师[es6入门](http://es6.ruanyifeng.com/ "es入门")

#### 环境
ES6目前浏览器不全部支持，需要bebal转换成标准的ES5才能被各浏览器支持，因此简单搭建了[es6运行环境](https://github.com/sam-dingkang/es6/tree/master/webpack-es6)，或者直接在babel官网的[在线实验室](https://babeljs.io/repl)进行测试代码。

### 块级作用域的绑定
> let

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
	循环中var声明的变量会提升，相当于在当前作用域申明var i，每次循环都是引用相同的变量i,就会覆盖；
	而let仅在块级作用域有效，每次都会新创建变量i,并将其初始化当前值，所以函数能拿到当前i的副本，因此最后输出6。

* var声明会有变量提前，如果在声明前使用就是undefined，而let则避免这种现象，一定在let声明后使用，否则报ReferenceError
* 存在暂时性死区：在区块中使用let命令声明变量之前，该变量都是不可用的。因此，凡是在声明之前就使用这些变量，就会报错。
```
if(true){
  console.log(typeof a); // 报错：ReferenceError: a is not defined
  let a = '111';     
}	
```
* let不允许在相同作用域内，重复声明同一个变量

> const

* const声明一个只读的常量。一旦声明，常量的值就不能改变。因此，一旦声明const，就必须立即初始化，	不能留到以后赋值。
* 和let一样，只在声明所在的块级作用域内有效，同样存在"暂时性死区"，不允许在相同作用域内声明同一个变量

### 字符串和正则表达式扩展

#### 字符串扩展

> codePointAt()

在es6之前，所以的字符串是基于16位字符编码(UTF-16)构建，某些情况字符串的编码单元不能被一个 UTF-16 编码单元单独表示的情况下，只能匹配 Unicode 代理对的第一个编码单元，之前用charCodeAt()不能正确识别字符，因此es6增加了codePointAt().

```
let text = '𠮷';
console.log(text.charCodeAt(0)) // 55362
console.log(text.codePointAt(0)) // 134071
```
> String.fromCodePoint()

codePointAt()在字符串中检索一个字符串的码位，也可以使用String.fromCodePoint()根据指定的码位生成一个字符串。例如：

```
console.log(String.fromCodePoint(134071)) // '𠮷'
```

> normalize() 

es6添加了一个normalize()方法，它可以提供Unicode的标准化形式。这个方法接收一个可选的字符串参数来指名某种Unicode标准化形式(NFC、NFD、NFKC、NFKD)。
这4种形式差异我们不关心，只需记住一点：在对比字符串之前，一定要先把它们转换成标准化同一种形式。

```
let normalized = values.map(function(str) {
  return str.normalize('NFD');
});
normalized.sort(function(first, second) {
  retrun (first < second);
});
```

> 其他字符串的变更

* includes(): 如果字符串检测到指定文本返回true,否则返回false。
* startsWith(): 如果字符串起始部分检测到指定文本返回true，否则返回false。
* endsWith(): 如果字符的结束部分检测到指定文本返回true，否则返回false。

具体每个api可以去MND上查看，就不举例子。

> repeact()
repeat方法返回一个新字符串，表示将原字符串重复n次

```
'x'.repeat(3) // "xxx"
'hello'.repeat(2) // "hellohello"
```

> Template Strings:模板字符串

模板字符串提供构建字符串的语法糖,使用反引号 (``) 来代替普通字符串中的用双引号和单引号.模板字符串可以包含特定语法(${expression})的占位符。

```
// 字符串占位符场景
const name = "sam"; const knowledgeId=201602125401;
`Hello ${name}, how are you tody?`
<a href=`sddhttps://cshall.alipay.com/enterprise/knowledgeDetail.htm?knowledgeId=${knowledgeId}`>跳转链接</a>

// 多行字符串

let html = `
<div>
  <h3>title</h3>
</div>
`;
// 用于组装
const list = [{id:210,name:'sam'},{id:234,name:'coco'}];
list.map(function(item){
   return `<li class="test">${item.name}</li>`;
});
$('#ul').html(template);

```

#### 正则扩展

> 正则表达式u修饰符

当一个正则表达式增加了u修饰符时，它就从编码单元操作模式切换为字符模式，这样正则表达式就不会将代理对视为两个字符。

```
let text = '𠮷'; // text.length = 2
/^.$/.test(text) // false;
/^.$/u.test(text) // true;

```

> 正则表达式y修饰符

ES6 还为正则表达式添加了y修饰符，叫做“粘连”（sticky）修饰符。y修饰符的作用与g修饰符类似，也是全局匹配，后一次匹配都从上一次匹配成功的下一个位置开始。不同之处在于，g修饰符只要剩余位置中存在匹配就可，而y修饰符确保匹配必须从剩余的第一个位置开始。


```
let text = 'hello1 hello2 hello3',
  globalReg = /hello\d\s?/g,
	stickyReg = /hello\d\s?/y,
globalResult = globalReg.exec(text),
stickyResult = stickyResult = stickyReg.exec(text);

console.log(globalResult[0]); // hello1;
console.log(stickyResult[0]); // hello1;
此时，globalReg和stickyReg的lastIndex都为7，可以console看下。
如果我们改变正则的lastIndex;
globalReg.lastIndex = 1;
stickyReg.lastIndex = 1;
再进行匹配，看结果；
globalResult = globalReg.exec(text),
stickyResult = stickyResult = stickyReg.exec(text);
console.log(globalResult[0]); // hello2;
console.log(stickyResult[0]); // 报错，因为stickyResult为null

```
若要检测y修饰符是否存在，可以通过sticky属性
```
let pattern = /hello\d/y;
console.log(pattern.sticky) // true;
```

> flags属性

ES6 为正则表达式新增了flags属性，会返回正则表达式的修饰符
```
/abc/ig.source //返回 abc
/abc/ig.flags // 返回 gi
```
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

[Number API](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number)<br/>
[Math API](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math)

```
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
### Moudle

```
// lib/math.js
export function sum(x, y) {
  return x + y;
}
export var pi = 3.141593;
模块的整体加载:用（*）指定一个对象，所有输出值都加载在这个对象上面。
// app.js
import * as math from "lib/math";
console.log("2π = " + math.sum(math.pi, math.pi));
按模块加载
// app.js
import {sum, pi} from "lib/math";
console.log("2π = " + sum(pi, pi));

export default 命令:为模块指定默认输出。这样其他模块加载该模块时，import命令可以为该匿名函数指定任意名字。
// default.js 
export default function () {
  console.log('foo');
}

// app.js
import customName from './default';

当然export default命令用在非匿名函数前，也是可以的。

```