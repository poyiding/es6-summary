### 精读《深入理解的ES6》
虽然es6的标准在2015年已经出来，网上各种学习资料很多，之前学习完也没有总结，刚好在看《深入理解的ES6》这本书后，决定总结一下，同时也算自己的回顾。
#### 环境
ES6目前浏览器不全部支持，需要bebal转换成标准的ES5才能被各浏览器支持，因此简单搭建了[es6运行环境](https://github.com/sam-dingkang/es6/tree/master/webpack-es6)，或者直接在babel官网的[在线实验室](https://babeljs.io/repl)进行测试代码。

### 目录
* <a href='#scrop'>块级作用域的绑定</a>
* <a href='#string'>字符串和正则表达式扩展</a>
* <a href='#function'>函数</a>
* <a href="#obj">扩展对象的功能属性</a>
### <a name="scrop">块级作用域的绑定</a>
> let

ES6的let类似于var,只是var声明有全局作用域和局部作用域，而let声明只在块级作用域内有效
```
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
  循环中var声明的变量会提升，相当于在当前作用域申明var i;，每次循环都是引用相同的变量i,就会覆盖，而let仅在块级作用域有效，每次都会新创建变量i,并将其初始化当前值，所以函数能拿到当前i的副本，因此最后输出6。
```
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
### <a name="string">字符串和正则表达式扩展</a>
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
### <a name="function">函数</a>

#### 函数形参的默认值
> ES6默认参数值

<p>在ES6之前，我们如下方式给函数赋予默认值</p>

```
function request(url, timeout, callback) {
  timeout = timeout || 2000;
  callback = callback || function() {};
  // do something
}
这样其实是有缺陷的，比如timeout传入0，根据逻辑或操作，最终timeout赋值为200，因此，我么通常会用typeof检查参数类型.
function request(url, timeout, callback) {
  timeout = (typeof timeout !== 'undefind') ? timeout : 2000;
  callback = (typeof callback !== 'undefind') ? callback : function() {};
  // do something
}

```	
<p>ES6简化了为形参提供默认值的过程，如果参数没有传入一个值，则默认提供一个初始值，例如</p>

```
  function request(url, timeout = 200, callback = function(){}) {
    // do something
  }
  这个函数中url是总是要传入值的，其他两个都有默认值。调用request()方法例子：
  // 使用timeout和callback默认值
  request('/foo');
  // 使用callback默认值
  request('/foo', 500)
  // 不使用默认值
  requ(est('/foo', 500, function(body){
    // doSomething(body)
  })
  // 如果使用timeout默认值，不使用callback
  request('/foo', null, function(body){
    // doSomething(body)
  })

```
#### 使用默认参数值对arguments对象的影响
<p>我们直接举例子对比</p>

```
  function mixArgs(first, second) {
    // "use strict"; 
    console.log(first === arguments[0])
    console.log(second === arguments[1])
    first = 'c';
    second = 'd';
    console.log(first === arguments[0])
    console.log(second === arguments[1])
  }
  mixArgs('a', 'b');
  // 执行后会输出 4个 true
  然而我们使用严格模式('use strict'),调用mixArgs('a', 'b')，会输出下面内容：
  true
  true
  false
  false

  在ES6中，函数使用了默认参数值，那么无论是否定义了严格模式，arguments都将与ES5严格模式保持一致。看下面代码：
  function mixArgs(first, second = 'b') {
    console.log(arguments.length)
    console.log(first === arguments[0])
    console.log(second === arguments[1])
    first = 'c';
    second = 'd';
    console.log(first === arguments[0])
    console.log(second === arguments[1])
  }
  mixArgs('a');
  执行后输出：
  1
  true
  false
  false
  false

```
>默认参数暂时性死区
<p>前面我们讲了let和const都有暂时性死区，其实默认参数也有，我们通过例子来说明</p>

```
  function getValue(value) {
    return value+5;
  }
  function add(first, second = getValue(first)) {
    return first + second;
  }
  console.log(add(1, 1)) // 2
  console.log(add(1)) // 7
  // 调用add(1, 1)时，实际相当于：
  let first = 1;
  let second = 1;
  // 调用add(1)时，相当于：
  let first = 1;
  let second = getValue(1);

  由于初始化second时，first已经初始化，所以它可以访问first值，反过来就错了：
  function add(first = second, second ) {
    return first + second;
  }
  console.log(add(1, 1)) // 2
  console.log(add(undefined, 1)) // 报错
  // 调用add(undefined, 1) 时,相当于;
  let first = second;
  let second = 1 ;
  因为first初始化时，second尚未初始化，所以报错。
```
#### 函数不定参数
<p>在函数参数命名前加(...)表明这是一个不定参数，该参数为数组，包含自它之后传入的所有参数。</p>

```
function pick(object, ...keys) {
  let result = {};
  for(let i=0,len = keys.length; i< len; i++) {
    result[keys[i]] = object[keys[i]];
  }
  return result;
}
pick({
  title: 'understanding ES6',
  auther: 'sam',
  year: 2017
},'auther', 'year');
// {auther: "sam", year: 2017}
```
<p>不定参数有两个限制：一个是每个函数最多只能有一个不定参数，且只能放在所有参数的末尾，另一个是不定参数不能用于对象字面量setter中</p>

```
  // 语法错误，不定参数后面不能有其他命名参数
  function pick(object, ...keys, last) {
    // something
  }

  let object = {
    // 语法错误，不能在setter中使用不定参数
    set name(...value) {

    }
  };
```
#### 函数展开运算符

```
ES6之前，我们取数组数组中最大值通常是这样:
Math.max.apply(Math,[23,56,76,88]);
现在我们用ES6的展开运算符就无须再调用apply(),代码更容易阅读。
let arr = [23,56,76,88];
Math.max(...arr);
等价于：Math.max(23,56,76,88);
```
#### 明确函数的多重用途
* ES5中判断函数被调用的方法
```
ES5中判断一个函数是否通过new关键字调用(或者作为构造函数被调用)，通常是使用instanceof来判断。
function Person(name) {
  if(this instanceof Person) {
    this.name = name;
  }else {
    throw new Error('必须通过new关键字调用Person');
  }
}
但是这个方法也不完全可靠，比如：
var onePerson = new Person('sam');
var notPerson = Person.call(onePerson, 'snow'); // 有效
这是因为通过call()将Person 中this设为了onePerson实例。

```
* 元属性(Metaproperty)new.target
```
  为了解决上面例子判断函数是否通过new关键字调用问题，ES6引入了new.target这个元属性。
  function Person(name) {
    if(typeof new.target !== 'undefined') {
      this.name = name;
    }else {
      throw new Error('必须通过new关键字调用Person');
    }
  }
  var onePerson = new Person('sam');
  var notPerson = Person.call(onePerson, 'snow'); // 抛出错误
```
* 块级函数
<p>在ES5之前版本或ES5严格模式中，代码块内部声明函数时，程序会抛出错误</p>

```
  'use strict';
  if(true){
    // ES5中抛出语法错误，ES6中不报错
    function (){
      // doSomething
    }
  }
```

#### 箭头函数

箭头函数与传统javacript不同，箭头函数主要体现在以下几个方面

*  没有this、super、arguments和new.target 绑定。
*  不能通过new关键字调用
*  没有原型   
*  不可改变this的绑定
*  不支持arguments对象
*  不支持重复的命名参数

> 箭头函数语法
```
let fn = value => value;
// 相当于：
let fn = function(value) {
  return value
}
如果需要传两个或两个以上参数:
let fn = (num1, num2) => num1 + num2;
如果函数需要由表达式组成更传统的函数体，需要用花括号包裹函数体：
let fn = (num1, num2) => {
  return num1 + num2;
}
如果想在箭头函数外返回一个对象字面量：
let fn = id => ({
  id: id,
  name: 'sam'
});
``` 
> 箭头函数没有this绑定
<p>箭头函数没有this绑定，必须通过查找作用域链来决定其值。如果箭头函数被非箭头函数包含，那么this绑定的是最近一层非箭头函数的this,否则this为undefined。可以通过下面的代码来看</p>

```
const adder = {
  base : 1,
    
  add: function(a) {
    const f = v => v + this.base;
    return f(a);
  },

  addThruCall: function(a) {
    const f = v => v + this.base;
    const b = {
      base : 2
    };       
    return f.call(b, a);
  }
};

console.log(adder.add(1));         // 输出 2
console.log(adder.addThruCall(1)); // 仍然输出 2（而不是3）
```
<p>箭头函数可以调用call()、apply()、bind()方法，但是与之前不同的是箭头函数调用这些方法后,this的值不会改变。</p>

>箭头函数没有arguments绑定
<p>箭头函数没有自己的arguments对象,且函数不论在哪个上下文中执行，箭头函数始终可以访问外围函数的arguments对象。</p>

```
function returnArg() {
  return () => arguments[0];
}
const fn = returnArg(5);
console.log(fn()); // 5
```
#### 尾调用优化
> 尾调用：是指某个函数的最后一步是调用另一个函数。
```
function doSomething() {
  return doSomethingElse(); //尾调用
}
```
>ES6中尾调用优化

ES6在严格模式下会缩减调用栈(调用帧)的大小(非严格模式无效)，尾调用不会创建新的栈，而是清除并重用当前栈，但是它要满足尾调用的条件。
```
'use strict'
function doSomething() {
  // 引擎优化
  return doSomethingElse();
}
// 以下几种情况无法优化
function doSomething() {
  // 无法优化，因为没有返回
  doSomethingElse();
}

function doSomething() {
  // 无法优化，必须在返回值后添加其他操作
  return 1 + doSomethingElse();
}

function doSomething() {
  // 无法优化，调用不在尾部
  const result = doSomethingElse();
  return result;
}

function doSomething() {
  // 无法优化，调用不在尾部
  let num = 1,
      func = () => num;
  // 无法优化，该函数是个闭包   
  return func();    
}
```
>如何利用尾调用优化

尾调用优化主要是应用在递归场景中，通过尾递归优化效果最显著，通过例子来看：

```
function factorial(n) {
  if(n <= 1 ) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}
// 上面代码是一个阶乘函数，计算n的阶乘，最多需要保存n个调用记录，复杂度 O(n),容易出现‘栈溢出’。ES6 中只要使用尾递归，就可以优化内存。

function factorial(n, p = 1) {
  if(n <= 1 ) {
    return 1 * p;
  } else {
    let result = n * p;
    // 尾调用优化后
    return factorial(n - 1, result);
  }
}

```

### <a name="obj">扩展对象的功能属性</a>
#### 对象字面量语法扩展
> 属性初始值简写
```
function createPerson(name, age) {
  return {
    name: name,
    age: age
  };
}
// es6 改写如下
function createPerson(name, age) {
  return {
    name,
    age
  }
}
```
> 对象方法的简写语法
```
var person = {
  name: 'sam',
  sayName: function() {
    console.log(this.name);
  }
};
// es6 简写如下
var person = {
  name: 'sam',
  sayName() {
    console.log(this.name);
  }
};
```
> 可计算属性名
```
// es5想要计算得到属性名，需要用[]代替.记法
var person = {},
    lastName = 'last name';
person['first name'] = 'tony';
person[lastName] = 'allen';    

// 在es6中
var lastName = 'last name';
var person = {
  "first name": 'tony',
  [last]: 'allen'
};
// 属性名是可计算的
var name = "name";
var person = {
  ["first" + name]: 'tony',
  ["last" + name]: 'allen'
};
```
#### 新增方法
> Object.is()方法
```
console.log(+0 === -0); // true
consoel.log(Object.is(+0, -0)); // false

console.log(NaN == NaN); // false
console.log(NaN === NaN); // false
console.log(Object.is(NaN, NaN)); // true;

console.log(5 == "5"); // true;
console.log(5 === "5"); // false;
console.log(Object.is(5, "5")); // false;
```
> Object.assign()方法

对象的组合(合并)是javascript中最常用的一种模式，在jQuery中提供jQuery.extend()这个API来实现。ES6中，Object.assign()方法可以接受任意数量的源对象，并按指定位置的顺序将属性复制到接收对象中。所以，如果多个源对象具有同名属性，则排位靠后的源对象会覆盖排位靠前的，看下面代码：

```
const obj = Object.assign({},
  {
    type: 'js',
    name: 'file.js'
  },
  {
    type: 'css'
  }
);
console.log(obj) // {type: 'css', name: 'file.js'}

// 需要注意的是Object.assign()是浅拷贝，容易使目标对象也改变
var o1 = { a: 1 };
var o2 = { b: 2 };
var o3 = { c: 3 };

var obj = Object.assign(o1, o2, o3);
console.log(obj); // { a: 1, b: 2, c: 3 }
console.log(o1);  // { a: 1, b: 2, c: 3 }
```
#### 重复的对象字面量属性

在ES5中的严格模式中，对象同时存在多个同名属性时会抛出错误,而在ES6中，不管在严格模式还是非严格模式，重复的属性检查被移除，不会报错，它会选取最后一个取值：

```
"use strict;"
var person = {
  name: "sam",
  name: "coco" // ES5严格模式下会有语法错误
};
// 在ES6中没有错误
console.lo(person.name) // "coco"
```
#### 增强对象原型
> 改变对象的原型

正常情况下，无论是是通过构造函数还是 Object.create() 方法创建对象，其原型是在创建时被指定的。ES5中添加了 Object.getPrototypeOf() 方法来返回指定对象的原型，但是仍缺少对象在实例化后改变原型的标准方法。所以，在ES6中添加了 Object.setPrototypeOf() 方法，它可用来改变任意指定对象的原型，它接受两个参数：第一个是被改变原型的对象，第二个是指向的对象。

```
let person = {
  greet() {
    return "hello";
  }
};
let dog = {
  greet() {
    return "woof";
  }
};

// 以person对象为原型
let friend = Object.create(person);
console.log(friend.greet()); // "hello"
console.log(Object.getPrototypeOf(friend) === person); // true

// 将原型设置为dog
Object.setprototypeOf(friend, dog);
console.log(friend.greet()); // "woof"
console.log(Object.getPrototypeOf(friend) === dog); // true

```
> 访问原型 Super() 关键字
### Destructuring:解构赋值

>数组解构赋值

```
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
```

>对象解构赋值
```
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
```
>函数参数的解构赋值
```
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
```
### Default + Rest + Spread
简单理解为三种形式的参数：Default parameters,Rest parameters, Spread Operator
```

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

#### 其他参考
* [learn ES2015](https://babeljs.io/learn-es2015/)
* [es6features](https://github.com/lukehoban/es6features#readme)
* [Mozilla开发者官网](https://developer.mozilla.org/zh-CN/)
* 阮一峰老师[es6入门](http://es6.ruanyifeng.com/ "es入门")