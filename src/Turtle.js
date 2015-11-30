PIXI = require("pixi.js");
var inherits = require("inherits");
var TWEEN = require("tween.js");
var Thenable = require("tinp");

function Turtle() {
	PIXI.Container.call(this);

	var g = new PIXI.Graphics();
	this.addChild(g);

	g.beginFill(0xff0000, 1);
	g.drawCircle(0, 0, 10);

	g.beginFill(0xff0000, 1);
	g.moveTo(0, -10);
	g.lineTo(20, 0);
	g.lineTo(0, 10);

	this.distance = 100;
}

inherits(Turtle, PIXI.Container);
module.exports = Turtle;

Turtle.prototype.walk = function() {
	var thenable = new Thenable();
	var tween = new TWEEN.Tween(this);
	tween.to({
		x: this.x + Math.cos(this.rotation) * this.distance,
		y: this.y + Math.sin(this.rotation) * this.distance
	}, this.delay);
	tween.onComplete(function() {
		thenable.resolve();
	});
	tween.easing(TWEEN.Easing.Quadratic.InOut);
	tween.start();

	return thenable;
}

Turtle.prototype.rotate = function(deg) {
	var rad = Math.PI * deg / 180;

	var thenable = new Thenable();
	var tween = new TWEEN.Tween(this);
	tween.to({
		rotation: this.rotation + rad
	}, this.delay);
	tween.onComplete(function() {
		thenable.resolve();
	});
	tween.easing(TWEEN.Easing.Quadratic.InOut);
	tween.start();

	return thenable;
}