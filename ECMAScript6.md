#### ES6浅入浅出

#### 参考

* [Mozilla开发者官网](https://developer.mozilla.org/zh-CN/)
* 阮一峰老师[es6入门](http://es6.ruanyifeng.com/ "es入门")

#### 环境
ES6目前浏览器支持不理想，需要bebal转换成标准的ES5才能被各浏览器支持，因此搭建webpack-es6环境,在test.js写es6代码即可测试.

不咯嗦，直入主题.....

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

##### const
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
	  // now finally do some chart drawing
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

### String： 字符串
> 模板字符串

```
	const list = [{id:210,name:'sam'},{id:234,name:'coco'}];
	let template = '';
	list.map(function(item){
		tetemplate += `<li class="test">${item.name}</li>`
	});
	$('#ul').append(template);
```

未完待续。。。。