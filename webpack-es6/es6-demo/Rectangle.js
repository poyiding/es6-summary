class Rectangle {
	constructor(width,height){
		this.w = width;
		this.h = height;
	}
	calArea(){
		return this.w * this.h;
	}
	getArea(){
		return this.calArea();
	}
}
module.exports = Rectangle;