import Rectangle from './Rectangle.js';
import test from './test.js';
var body = document.querySelector('body');
const rectangle = new Rectangle(5,10);
document.write('矩形面积: '+rectangle.getArea());

// 和es5一样，w和h都是实例对象rectangle自身的属性,而calArea和getArea是Rectangle原型对象的属性