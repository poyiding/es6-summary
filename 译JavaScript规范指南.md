## javaScript编程指南

> 来自[airbnb / javascript](https://github.com/airbnb/javascript),主要是ECMAScript6一些规范指导。

#### type
* 原始类型： string、boole、Number、null、undefind、symbol
	* 直接存取基本类型值。
* 复杂类型： Object、Array、funciton
	* 通过引用的方式存取复杂类型值
	
#### References (引用)
* 所有的变量引用使用const,避免使用var

	>why? 这是确保避免你引用的变量重复赋值，这样容易导致bug和使代码难以理解。我的理解是:使用var声明变量是在全局作用域中，很容易被覆盖修改，在es6中变量在块级作用域中才生效，所以我们应该遵循这种原则，即使必须要重新赋值也是使用let,而不是使用var。下面两点有提到。
	
* If you must reassign references, use let instead of var. 
*  Note that both let and const are block-scoped.

		// bad
		var a = 1;
		var b = 2;
		
		// good
		const a = 1;
		const b = 2;
		-------------------------------
		// bad
		var count = 1;
		if (true) {
		  count += 1;
		}
		
		// good, use the let.
		let count = 1;
		if (true) {
		  count += 1;
		}
		----------------------------------
		{
		  let a = 1;
		  const b = 1;
		}
		console.log(a); // ReferenceError
		console.log(b); // ReferenceError	
	
#### Objects 
* 使用字面量来创建对象，不用new来创建对象

	> why? 我的理解是：通过new Object()来创建对象其实是实例化构造函数(constructor),等同于{};但底层处理了一些事，比如构造函数实例化，改变this的指向，所以直接用字面量创建对象应该性能更好，同理数组也一样。

		// bad
		const item = new Object();
		
		// good
		const item = {};
	
* 创建有动态属性名的对象时，使用可被计算的属性名称。
	>why?因为这样可以让你在一个地方定义所有的对象属性. 简单说就是直接在对象{}里面定义所有属性，不要在外面追加。

		function getKey(k) {
		  return `a key named ${k}`;
		}
		
		// bad
		const obj = {
		  id: 5,
		  name: 'San Francisco',
		};
		obj[getKey('enabled')] = true;
		
		// good
		const obj = {
		  id: 5,
		  name: 'San Francisco',
		  [getKey('enabled')]: true,
		};
* 使用对象的简写(缩写)模式

		// bad
		const atom = {
		  value: 1,
		
		  addValue: function (value) {
		    return atom.value + value;
		  },
		};
		
		// good
		const atom = {
		  value: 1,
		
		  addValue(value) {
		    return atom.value + value;
		  },
		};
* 使用属性值简写

		const lukeSkywalker = 'Luke Skywalker';
		
		// bad
		const obj = {
		  lukeSkywalker: lukeSkywalker,
		};
		
		// good
		const obj = {
		  lukeSkywalker,
		};
* 在对象字面量开始就放那些简写的属性。
	>why?它很容易就告诉了我们使用了哪些简写的属性
	
		const anakinSkywalker = 'Anakin Skywalker';
		const lukeSkywalker = 'Luke Skywalker';
		
		// bad
		const obj = {
		  episodeOne: 1,
		  twoJediWalkIntoACantina: 2,
		  lukeSkywalker,
		  episodeThree: 3,
		  mayTheFourth: 4,
		  anakinSkywalker,
		};
		
		// good
		const obj = {
		  lukeSkywalker,
		  anakinSkywalker,
		  episodeOne: 1,
		  twoJediWalkIntoACantina: 2,
		  episodeThree: 3,
		  mayTheFourth: 4,
		};
* 引号属性是无效的标示
	>why?一般来说我们考虑容易阅读。它改善语法高亮,也更容易被许多JS引擎优化。

		// bad
		const bad = {
		  'foo': 3,
		  'bar': 4,
		  'data-blah': 5,
		};
		
		// good
		const good = {
		  foo: 3,
		  bar: 4,
		  'data-blah': 5,
		}; 
* 不要直接调用Object.prototype,像hasOwnProperty(是否存在自有属性)、propertyIsEnumerable(属性是否可枚举),isPrototypeOf(实例对象是否在另一对象的原型链中)

	 >why: 这个方法可能存在性能问题，比如hasOwnProperty作为对象的一个属性{hasOwnProperty:false}或者创建一个空对象Object.create(null)

		// bad
		console.log(object.hasOwnProperty(key));
		
		// good
		console.log(Object.prototype.hasOwnProperty.call(object, key));
		
		// best
		const has = Object.prototype.hasOwnProperty; // cache the lookup once, in module scope.
		/* or */
		import has from 'has';
		// ...
		console.log(has.call(object, key));
* 浅拷贝一个对象，相比Object.assign()宁可用rest操作符(...)。

		// very bad
		const original = { a: 1, b: 2 };
		const copy = Object.assign(original, { c: 3 }); // 改变了 `original`
		delete copy.a; // so does this
		
		// bad
		const original = { a: 1, b: 2 };
		const copy = Object.assign({}, original, { c: 3 }); // copy => { a: 1, b: 2, c: 3 }
		
		// good
		const original = { a: 1, b: 2 };
		const copy = { ...original, c: 3 }; // copy => { a: 1, b: 2, c: 3 }
		
		const { a, ...noA } = copy; // noA => { b: 2, c: 3 }

#### Array
* 同样适用字面量语法创建数组，不要用new的方式

		// bad
		const items = new Array();
		
		// good
		const items = [];
* 使用数组的push的方式来追加元素，来代替直接赋值的方式。

		const someStack = [];

		// bad
		someStack[someStack.length] = 'abracadabra';
		
		// good
		someStack.push('abracadabra');
* 使用扩展运位符来复制数组，不要用循环方式。
		// bad
		const len = items.length;
		const itemsCopy = [];
		let i;
		
		for (i = 0; i < len; i += 1) {
		  itemsCopy[i] = items[i];
		}
		
		// good
		const itemsCopy = [...items];
* 使用 Array.from来将类数组对象转换成数组 
		
		举个栗子：
		function toArray(){
			return Array.prototype.slice.call(arguments) // es5
			// good 
			// Array.from(arguments) es6的方式
		}
		toArray('a','b','c') // ['a','b','c']
		
		// best
		[...arguments]

* 当map一个迭代数组使用Array.from替代...扩展操作符，因为它避免创建一个中间数组。

	// bad 
	const baz = [...foo].map(bar);

	// good
	const baz = Array.from(foo, bar);

* 在数组的回调方法中使用return语句，如果在function里面是单个语句可以省略return。

	// good
		[1, 2, 3].map((x) => {
		  const y = x + 1;
		  return x * y;
		});
		
		// good
		[1, 2, 3].map(x => x + 1);
		
		// bad
		const flat = {};
		[[0, 1], [2, 3], [4, 5]].reduce((memo, item, index) => {
		  const flatten = memo.concat(item);
		  flat[index] = flatten;
		});
		
		// good
		const flat = {};
		[[0, 1], [2, 3], [4, 5]].reduce((memo, item, index) => {
		  const flatten = memo.concat(item);
		  flat[index] = flatten;
		  return flatten;
		});
		
		// bad
		inbox.filter((msg) => {
		  const { subject, author } = msg;
		  if (subject === 'Mockingbird') {
		    return author === 'Harper Lee';
		  } else {
		    return false;
		  }
		});
		
		// good
		inbox.filter((msg) => {
		  const { subject, author } = msg;
		  if (subject === 'Mockingbird') {
		    return author === 'Harper Lee';
		  }
		
		  return false;
		});

* 如果一个数组有多行，用换行展开。

	// bad
	const arr = [
	  [0, 1], [2, 3], [4, 5],
	];

	const objectInArray = [{
	  id: 1,
	}, {
	  id: 2,
	}];

	const numberInArray = [
	  1, 2,
	];

	// good
	const arr = [[0, 1], [2, 3], [4, 5]];

	const objectInArray = [
	  {
	    id: 1,
	  },
	  {
	    id: 2,
	  },
	];

	const numberInArray = [
	  1,
	  2,
	];

#### Destructuring
* 当访问和使用一个对象的多个属性时，使用对象的解构方法
	>因为解构方式省去了创建临时引用属性(变量)。

		// bad
		function getFullName(user) {
		  const firstName = user.firstName;
		  const lastName = user.lastName;
		
		  return `${firstName} ${lastName}`;
		}
		
		// good
		function getFullName(user) {
		  const { firstName, lastName } = user;
		  return `${firstName} ${lastName}`;
		}
		
		// best
		function getFullName({ firstName, lastName }) {
		  return `${firstName} ${lastName}`;
		}
* 使用数组解构方式，同样可以省去创建临时变量

		const arr = [1, 2, 3, 4];
		
		// bad
		const first = arr[0];
		const second = arr[1];
		
		// good
		const [first, second] = arr;
* 要返回多个值时使用对象解构，不要使用数组解构
	>因为使用数组解构调用时候要考虑返回数据的顺序，而使用对象只要选择需要的数据就行。
	
		// bad
		function processInput(input) {
		  // then a miracle occurs
		  return [left, right, top, bottom];
		}
		
		// the caller needs to think about the order of return data
		const [left, __, top] = processInput(input);
		
		// good
		function processInput(input) {
		  // then a miracle occurs
		  return { left, right, top, bottom };
		}
		
		// the caller selects only the data they need
		const { left, top } = processInput(input);

#### string 
* 使用单引号字符串
		// bad
		const name = "Capt. Janeway";
		
		// bad - template literals should contain interpolation or newlines
		const name = `Capt. Janeway`;
		
		// good
		const name = 'Capt. Janeway';

* 超过100字节的字符串不要打断。

		// bad
		const errorMessage = 'This is a super long error that was thrown because \
		of Batman. When you stop to think about how Batman had anything to do \
		with this, you would get nowhere \
		fast.';
		
		// bad
		const errorMessage = 'This is a super long error that was thrown because ' +
		  'of Batman. When you stop to think about how Batman had anything to do ' +
		  'with this, you would get nowhere fast.';
		
		// good
		const errorMessage = 'This is a super long error that was thrown because of Batman. When you stop to think about how Batman had anything to do with this, you would get nowhere fast.';
* 通过编程建立字符串时，使用字符串模板来替拼接方式。
		
		// bad
		function sayHi(name) {
		  return 'How are you, ' + name + '?';
		}
		
		// bad
		function sayHi(name) {
		  return ['How are you, ', name, '?'].join();
		}
		
		// bad
		function sayHi(name) {
		  return `How are you, ${ name }?`;
		}
		
		// good
		function sayHi(name) {
		  return `How are you, ${name}?`;
		}
* 永远不要使用eval()方法来处理字符串，它有太多的性能和安全漏洞，处理字符串对象或字符串json时，使用eval()一定是不合理的，肯定有代替它的方法。

		* 字符串里不要有不必要的转义字符。
		// bad
		const foo = '\'this\' \i\s \"quoted\"';
		
		// good
		const foo = '\'this\' is "quoted"';
		const foo = `my name is '${name}'`;

#### Functions 
* 使用命名的函数表达式替代函数声明的方式

	>why？函数声明会被提前，所以他们在调用栈中更容易被识别，而函数表达式只会把函数的引用变量名提升。ps: 个人认为还有一个好处是在递归中比较清晰明白含义。

		// bad
		function foo() {
		  // ...
		}
		
		// bad
		const foo = function () {
		  // ...
		};
		
		// good
		const foo = function bar() {
		  // ...
		};

* 匿名函数自执行
*  永远不要在一个（if、while、etc）非函数代码块中声明一个函数，应该把那个函数赋给一个变量。浏览器允许你这么做，但它们的解析表现不一致
*  注意: ECMA-262 把 block 定义为一组声明。函数声明不是声明。(对上一点的解释)

		// bad
		if (currentUser) {
		  function test() {
		    console.log('Nope.');
		  }
		}
		
		// good
		let test;
		if (currentUser) {
		  test = () => {
		    console.log('Yup.');
		  };
		}
*  永远不要用arguments命名参数，这会把原来函数的arguments类数组对象替换掉

		// bad
		function foo(name, options, arguments) {
		  // ...
		}
		
		// good
		function foo(name, options, args) {
		  // ...
		}
*  不要用arguments形式传参，要用rest语法...形式
	
	>因为使用 ... 能明确你要传入的参数。另外 rest 参数是一个真正的数组，而 arguments 是一个类数组。

		// bad
		function concatenateAll() {
		  const args = Array.prototype.slice.call(arguments);
		  return args.join('');
		}
		
		// good
		function concatenateAll(...args) {
		  return args.join('');
		}

* 使用默认参数的语法而不要改变函数的arguments

		// really bad
		function handleThings(opts) {
		  // No! We shouldn't mutate function arguments.
		  // Double bad: if opts is falsy it'll be set to an object which may
		  // be what you want but it can introduce subtle bugs.
		  opts = opts || {};
		  // ...
		}
		
		// still bad
		function handleThings(opts) {
		  if (opts === void 0) {
		    opts = {};
		  }
		  // ...
		}
		
		// good
		function handleThings(opts = {}) {
		  // ...
		}
* 直接给函数参数赋值时需要避免副作用。

		var b = 1;
		// bad
		function count(a = b++) {
		  console.log(a);
		}
		count();  // 1
		count();  // 2
		count(3); // 3
		count();  // 3
* 默认的参数应该总是放在最后面

		// bad
		function handleThings(opts = {}, name) {
		  // ...
		}
		
		// good
		function handleThings(name, opts = {}) {
		  // ...
		} 
* 永远不要使用new的方式(Function构造函数)创建一个函数

		// bad
		var add = new Function('a', 'b', 'return a + b');
		
		// still bad
		var subtract = Function('a', 'b', 'return a - b');
* 函数名用空格来前后隔开

		// bad
		const f = function(){};
		const g = function (){};
		const h = function() {};
		
		// good
		const x = function () {};
		const y = function a() {};
* 不要改变参数
	
		// bad
		function f1(obj) {
		  obj.key = 1;
		}
		
		// good
		function f2(obj) {
		  const key = Object.prototype.hasOwnProperty.call(obj, 'key') ? obj.key : 1;
		}
		---------------------
		//bad
		function f2(a) {
		  if (!a) { a = 1; }
		  // ...
		}
		// good
		function f4(a = 1) {
		  // ...
		}
	
* 使用扩展操作符...来回调可变的方法
 		
		（todo）es6中变量不能重复声明，所以不能直接console.log(x),用...相对apply方式更加简单
		// bad
		const x = [1, 2, 3, 4, 5];
		console.log.apply(console, x);
		
		// good
		const x = [1, 2, 3, 4, 5];
		console.log(...x);
	
* 函数参数多行的情况,或者调用,应该缩进。就像这个指南里的每一个多行list，每一项跟在逗号后面与上一条线对齐。

		// bad
		function foo(bar,
		             baz,
		             quux) {
		  // ...
		}
		
		// good
		function foo(
		  bar,
		  baz,
		  quux,
		) {
		  // ...
		}
		
		// bad
		console.log(foo,
		  bar,
		  baz);
		
		// good
		console.log(
		  foo,
		  bar,
		  baz,
		);	

#### Arrow Functions
* 当你必须使用函数表达式（或传递一个匿名函数）时，使用箭头函数符号。

	>why?因为箭头函数在上下文指代的this创建了新的方式,通常情况下都能满足你的需求，而且这样的语法更加简洁。（注：箭头函数不创建自己的上下文，因此箭头函数this就是封闭的上下文，用bind也不能改变，这和es5函数this不一样）

		// bad
		[1, 2, 3].map(function (x) {
		  const y = x + 1;
		  return x * y;
		});
		
		// good
		[1, 2, 3].map((x) => {
		  const y = x + 1;
		  return x * y;
		});

* 如果函数由一个表达式，省略花括号和return,否则保持花括号和用return
	>why?语法糖，当函数链接一起可读性更好
		
		// bad
		[1, 2, 3].map(number => {
		  const nextNumber = number + 1;
		  `A string containing the ${nextNumber}.`;
		});
		
		// good
		[1, 2, 3].map(number => `A string containing the ${number}.`);
		
		// good
		[1, 2, 3].map((number) => {
		  const nextNumber = number + 1;
		  return `A string containing the ${nextNumber}.`;
		});
		
		// good
		[1, 2, 3].map((number, index) => ({
		  [index]: number,
		}));

* 万一表达式超过多行，为使可读性更好用括号包装在一起。
	>why?很明显的表示函数的开始和结尾  

		// bad
		['get', 'post', 'put'].map(httpMethod => Object.prototype.hasOwnProperty.call(
		    httpMagicObjectWithAVeryLongName,
		    httpMethod,
		  )
		);
		
		// good
		['get', 'post', 'put'].map(httpMethod => (
		  Object.prototype.hasOwnProperty.call(
		    httpMagicObjectWithAVeryLongName,
		    httpMethod,
		  )
		));

* 如果函数接受一个参数并且没用括号，就省略花括号，否则，当括号包住一个参数就使用花括表示清楚和一致性，（简单说就是，函数接收一个参数时，括号和花括号保持一致性)
	>why?少了视觉混乱

		// bad
		[1, 2, 3].map((x) => x * x);
		
		// good
		[1, 2, 3].map(x => x * x);
		
		// good
		[1, 2, 3].map(number => (
		  `A long string with the ${number}. It’s so long that we don’t want it to take up space on the .map line!`
		));
		
		// bad
		[1, 2, 3].map(x => {
		  const y = x + 1;
		  return x * y;
		});
		
		// good
		[1, 2, 3].map((x) => {
		  const y = x + 1;
		  return x * y;
		});

* 避免混淆箭头语法(= >)和比较运算符(< =、> =)。

		// bad
		const itemHeight = item => item.height > 256 ? item.largeSize : item.smallSize;
		
		// bad
		const itemHeight = (item) => item.height > 256 ? item.largeSize : item.smallSize;
		
		// good
		const itemHeight = item => (item.height > 256 ? item.largeSize : item.smallSize);
		
		// good
		const itemHeight = (item) => {
		  const { height, largeSize, smallSize } = item;
		  return height > 256 ? largeSize : smallSize;
		};

#### Classes & Constructors
* 使用class，避免直接操作prototype
	>why?class语法更加简单易读

		// bad
		function Queue(contents = []) {
		  this.queue = [...contents];
		}
		Queue.prototype.pop = function () {
		  const value = this.queue[0];
		  this.queue.splice(0, 1);
		  return value;
		};
		
		
		// good
		class Queue {
		  constructor(contents = []) {
		    this.queue = [...contents];
		  }
		  pop() {
		    const value = this.queue[0];
		    this.queue.splice(0, 1);
		    return value;
		  }
		}

* 使用extends来继承
	>why?它是一个内置继承原型的方法，不会破坏instanceof指向

		// bad
		const inherits = require('inherits');
		function PeekableQueue(contents) {
		  Queue.apply(this, contents);
		}
		inherits(PeekableQueue, Queue);
		PeekableQueue.prototype.peek = function () {
		  return this.queue[0];
		};
		
		// good
		class PeekableQueue extends Queue {
		  peek() {
		    return this.queue[0];
		  }
		}

* 可以通过return this的方式来帮助链式调用

		// bad
		Jedi.prototype.jump = function () {
		  this.jumping = true;
		  return true;
		};
		
		Jedi.prototype.setHeight = function (height) {
		  this.height = height;
		};
		
		const luke = new Jedi();
		luke.jump(); // => true
		luke.setHeight(20); // => undefined
		
		// good
		class Jedi {
		  jump() {
		    this.jumping = true;
		    return this;
		  }
		
		  setHeight(height) {
		    this.height = height;
		    return this;
		  }
		}
		
		const luke = new Jedi();
		
		luke.jump()
		  .setHeight(20);
* 自定义一个toString()方法是可以的，但要保证正常工作和没有副作用

		class Jedi {
		  constructor(options = {}) {
		    this.name = options.name || 'no name';
		  }
		
		  getName() {
		    return this.name;
		  }
		
		  toString() {
		    return `Jedi - ${this.getName()}`;
		  }
		}
* Classes如果没有显示定义constructor的话有个默认的constructor，空构造函数或者仅仅是调用父类是没必要的	

		// bad
		class Jedi {
		  constructor() {}
		
		  getName() {
		    return this.name;
		  }
		}
		
		// bad
		class Rey extends Jedi {
		  constructor(...args) {
		    super(...args);
		  }
		}
		
		// good
		class Rey extends Jedi {
		  constructor(...args) {
		    super(...args);
		    this.name = 'Rey';
		  }
		}
* 避免定义重复的类成员。
	>定义重复的类成员将默认指定最后一个。

		// bad
		class Jedi {
		  constructor() {}
		
		  getName() {
		    return this.name;
		  }
		}
		
		// bad
		class Rey extends Jedi {
		  constructor(...args) {
		    super(...args);
		  }
		}
		
		// good
		class Rey extends Jedi {
		  constructor(...args) {
		    super(...args);
		    this.name = 'Rey';
		  }
		}

#### Modules
* 使用(import/export)模块不要使用非标准的模块，你可以编译你想要的系统
	>why?模块化就是未来，现在就要使用 // todo? 

		// bad
		const AirbnbStyleGuide = require('./AirbnbStyleGuide');
		module.exports = AirbnbStyleGuide.es6;
		
		// ok
		import AirbnbStyleGuide from './AirbnbStyleGuide';
		export default AirbnbStyleGuide.es6;
		
		// best
		import { es6 } from './AirbnbStyleGuide';
		export default es6;
* 不要使用通配符引入模块
	> 确保你有一个默认的export
		
		// bad
		import * as AirbnbStyleGuide from './AirbnbStyleGuide';
		
		// good
		import AirbnbStyleGuide from './AirbnbStyleGuide';
* 不要在import立刻export导出。
	>虽然一行代码简洁明了，但让 import 和 export 各司其职让事情能保持一致。
		
		// bad
		// filename es6.js
		export { es6 as default } from './AirbnbStyleGuide';
		
		// good
		// filename es6.js
		import { es6 } from './AirbnbStyleGuide';
		export default es6;

* 只在一个地方的路径引入
	>why?有多个导入相同的路径可以使代码难以维护。

		// bad
		  import foo from 'foo';
		  // … some other imports … //
		  import { named1, named2 } from 'foo';
		
		  // good
		  import foo, { named1, named2 } from 'foo';
		
		  // good
		  import foo, {
		    named1,
		    named2,
		  } from 'foo';
* 不要导出可变的绑定
	>why?一般应该避免突变，尽管在特殊情况需要导出可变的绑定，一般只有常量引用才能导出
		
		 // bad
		  let foo = 3;
		  export { foo };
		
		  // good
		  const foo = 3;
		  export { foo };
* 模块里只有一个导出口时，用export default不要用export命名
		
		// bad
		  export function foo() {}
		
	    // good
	      export default function foo() {}
* 把所有import放在最上面
	>why?import提前引入，保持它们在最上面防止异常(主要是防止没有引入模块而去调用报错)

		 // bad
		  import foo from 'foo';
		  foo.init();
		
		  import bar from 'bar';
		
		  // good
		  import foo from 'foo';
		  import bar from 'bar';
		
		  foo.init();
* 多个引入应该缩进，就像多行文本数组和对象

		// bad
		import {longNameA, longNameB, longNameC, longNameD, longNameE} from 'path';
		
		// good
		import {
		  longNameA,
		  longNameB,
		  longNameC,
		  longNameD,
		  longNameE,
		} from 'path';
* 不允许webpack加载语法在模块的import语句里

		// bad
		  import fooSass from 'css!sass!foo.scss';
		  import barCss from 'style!css!bar.css';
		
		  // good
		  import fooSass from 'foo.scss';
		  import barCss from 'bar.css';

#### Iterators and Generators（遍历器和Generators函数）
* 这里都不推荐使用Iterators遍历数组不要使用for in 或者for of,使用forEach()、map()，主要是和性能有关吧。遍历对象用Object.keys() / Object.values() / Object.entries()。
* Generators是一个返回iterators对象的函数，没有去研究它。。。。

		const numbers = [1, 2, 3, 4, 5];
		
		// bad
		let sum = 0;
		for (let num of numbers) {
		  sum += num;
		}
		sum === 15;
		
		// good
		let sum = 0;
		numbers.forEach(num => sum += num);
		sum === 15;
		
		// best (use the functional force)
		const sum = numbers.reduce((total, num) => total + num, 0);
		sum === 15;
		
		// bad
		const increasedByOne = [];
		for (let i = 0; i < numbers.length; i++) {
		  increasedByOne.push(numbers[i] + 1);
		}
		
		// good
		const increasedByOne = [];
		numbers.forEach(num => increasedByOne.push(num + 1));
		
		// best (keeping it functional)
		const increasedByOne = numbers.map(num => num + 1);

#### Properties
* 使用'.'来访问属性

		const luke = {
		  jedi: true,
		  age: 28,
		};
		
		// bad
		const isJedi = luke['jedi'];
		
		// good
		const isJedi = luke.jedi;
* 当通过变量访问属性时使用中括号 [ ]

		const luke = {
		  jedi: true,
		  age: 28,
		};
		
		function getProp(prop) {
		  return luke[prop];
		}
		
		const isJedi = getProp('jedi');
#### Variables
* 使用 const 或 let来声明变量，如果不这样就会导致全局变量。我们需要避免全局命名空间的污染。
		
		// bad
		superPower = new SuperPower();
		
		// good
		const superPower = new SuperPower();
* 用const或者let为每个变量声明，不要像es5那样省略。

		// bad
		const items = getItems(),
		    goSportsTeam = true,
		    dragonball = 'z';
		
		// bad
		// (compare to above, and try to spot the mistake)
		const items = getItems(),
		    goSportsTeam = true;
		    dragonball = 'z';
		
		// good
		const items = getItems();
		const goSportsTeam = true;
		const dragonball = 'z';
* 所有用const和let声明的变量把它放在一起分组。

		// bad
		let i, len, dragonball,
		    items = getItems(),
		    goSportsTeam = true;
		
		// bad
		let i;
		const items = getItems();
		let dragonball;
		const goSportsTeam = true;
		let len;
		
		// good
		const goSportsTeam = true;
		const items = getItems();
		let dragonball;
		let i;
		let length;
* 在你需要的地方给变量赋值，但请把它们放在一个合理的位置。
	>why?let和const是块级作用域不是函数作用域

		// bad - unnecessary function call
		function checkName(hasName) {
		  const name = getName();
		
		  if (hasName === 'test') {
		    return false;
		  }
		
		  if (name === 'test') {
		    this.setName('');
		    return false;
		  }
		
		  return name;
		}
		
		// good
		function checkName(hasName) {
		  if (hasName === 'test') {
		    return false;
		  }
		
		  const name = getName();
		
		  if (name === 'test') {
		    this.setName('');
		    return false;
		  }
		
		  return name;
		}
* 不要用链式变量赋值
	> 链式变量赋值会创建隐式全局变量  

		// bad
		(function example() {
		  // JavaScript interprets this as
		  // let a = ( b = ( c = 1 ) );
		  // The let keyword only applies to variable a; variables b and c become
		  // global variables.
		  let a = b = c = 1;
		}());
		
		console.log(a); // ReferenceError: a is not defined
		console.log(b); // 1
		console.log(c); // 1
		
		// good
		(function example() {
		  let a = 1;
		  let b = a;
		  let c = a;
		}());
		
		console.log(a); // ReferenceError
		console.log(b); // ReferenceError
		console.log(c); // ReferenceError

* 避免使用(++,--)一元增量和减量
	>why?根据eslint文档，一元递增和递减语句在一个应用程序递增和递减值时有可能导致错误(倾向)。 所以应该用像num+=1这样的表达式来代替num++。


		const array = [1, 2, 3];
		let num = 1;
		num++;
		--num;
		
		let sum = 0;
		let truthyCount = 0;
		for (let i = 0; i < array.length; i++) {
		  let value = array[i];
		  sum += value;
		  if (value) {
		    truthyCount++;
		  }
		}
		
		// good
		
		const array = [1, 2, 3];
		let num = 1;
		num += 1;
		num -= 1;
		
		const sum = array.reduce((a, b) => a + b, 0);
		const truthyCount = array.filter(Boolean).length;

#### hosting(提升，主要指声明提前)
* var 声明会被提升至该作用域的顶部，但它们赋值不会提升。let 和 const 被赋予了一种称为[暂时性死区](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let)的概念。这对于了解为什么[type of 不再安全](http://es-discourse.com/t/why-typeof-is-no-longer-safe/15)相当重要。

		// 我们知道这样运行不了 
		// （假设 notDefined 不是全局变量）
		function example() {
		  console.log(notDefined); // => throws a ReferenceError
		}

		// 由于变量提升的原因，
		// 在引用变量后再声明变量是可以运行的。
		// 注：变量的赋值 `true` 不会被提升。
		function example() {
		  console.log(declaredButNotAssigned); // => undefined
		  var declaredButNotAssigned = true;
		}
		
		// 编译器会把函数声明提升到作用域的顶层，
		// 这意味着我们的例子可以改写成这样：
		function example() {
		  let declaredButNotAssigned;
		  console.log(declaredButNotAssigned); // => undefined
		  declaredButNotAssigned = true;
		}
		
		// 使用 const 和 let
		function example() {
		  console.log(declaredButNotAssigned); // => throws a ReferenceError
		  console.log(typeof declaredButNotAssigned); // => throws a ReferenceError
		  const declaredButNotAssigned = true;
		}
* 匿名函数表达式的变量名会被提前，但函数内容并不会

		function example() {
		  console.log(anonymous); // => undefined
		
		  anonymous(); // => TypeError anonymous is not a function
		
		  var anonymous = function () {
		    console.log('anonymous function expression');
		  };
		}
* 命名的函数表达式的变量名会被提升，但函数名和函数函数内容并不会。

		function example() {
		  console.log(named); // => undefined
		
		  named(); // => TypeError named is not a function
		
		  superPower(); // => ReferenceError superPower is not defined
		
		  var named = function superPower() {
		    console.log('Flying');
		  };
		}
		
		// the same is true when the function name
		// is the same as the variable name.
		function example() {
		  console.log(named); // => undefined
		
		  named(); // => TypeError named is not a function
		
		  var named = function named() {
		    console.log('named');
		  };
		}
* 函数声明的名称和函数体都会被提升

		function example() {
		  superPower(); // => Flying
		
		  function superPower() {
		    console.log('Flying');
		  }
		}

#### Comparison Operators & Equality(比较运算符和等号)
*  优先使用 === 和 !== 而不是 == 和 !=
*  条件表达式例如 if 语句通过ToBoolean 抽象方法会强制转换它们的表达式；遵守下面的规则：
	* 对象 被计算为 true
	* Undefined 被计算为 false
	* Null 被计算为 false
	* 布尔值 被计算为 布尔的值
	* 数字 如果是 +0、-0、或 NaN 被计算为 false, 否则为 true
	* 字符串 如果是空字符串 '' 被计算为 false，否则为 true

* 使用布尔计算快捷方式，除了明确的字符串和数字的比较

		// bad
		if (isValid === true) {
		  // ...
		}
		
		// good
		if (isValid) {
		  // ...
		}
		
		// bad
		if (name) {
		  // ...
		}
		
		// good
		if (name !== '') {
		  // ...
		}
		
		// bad
		if (collection.length) {
		  // ...
		}
		
		// good
		if (collection.length > 0) {
		  // ...
		}
* 在case和default条件语句包含(let、const、function、class)声明词语时，使用花括号创建块
		
		// bad
		switch (foo) {
		  case 1:
		    let x = 1;
		    break;
		  case 2:
		    const y = 2;
		    break;
		  case 3:
		    function f() {
		      // ...
		    }
		    break;
		  default:
		    class C {}
		}
		
		// good
		switch (foo) {
		  case 1: {
		    let x = 1;
		    break;
		  }
		  case 2: {
		    const y = 2;
		    break;
		  }
		  case 3: {
		    function f() {
		      // ...
		    }
		    break;
		  }
		  case 4:
		    bar();
		    break;
		  default: {
		    class C {}
		  }
		}
* 三目运算不应该嵌套，通常是一行表达式

		// bad
		const foo = maybe1 > maybe2
		  ? "bar"
		  : value1 > value2 ? "baz" : null;
		
		// better
		const maybeNull = value1 > value2 ? 'baz' : null;
		
		const foo = maybe1 > maybe2
		  ? 'bar'
		  : maybeNull;
		
		// best
		const maybeNull = value1 > value2 ? 'baz' : null;
		
		const foo = maybe1 > maybe2 ? 'bar' : maybeNull;

* 避免不必要的三目运算

		// bad
		const foo = a ? a : b;
		const bar = c ? true : false;
		const baz = c ? false : true;
		
		// good
		const foo = a || b;
		const bar = !!c;
		const baz = !c;
个人不建议使用三目运算，因为通常条件语句在代码压缩后会转成三目运算，而且用三目运算可读性不好


#### 其他

blocks(块)、Comments(注释)、Whitespace(空格)、Commas(逗号)、Semicolons(分号)、Naming Conventions（命名惯例）这些就不详细说明，可看引用的文档。可以通过eslint配置规则，需要说明的是，比如注释规则和命名规则等都应该遵循团队规范。

date：2017-03-12
