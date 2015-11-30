PIXI = require("pixi.js");
var PixiApp = require("pixiapp");
var inherits = require("inherits");
var TWEEN = require("tween.js");
var BundleLoader = require("bundleloader");
var BrowserUtil = require("./BrowserUtil");
var Turtle = require("./Turtle");

function PixiTurtle() {
	PixiApp.call(this, 1024, 768);

	this.on("frame", TWEEN.update);

	var script = BrowserUtil.getQueryStringParams().script;
	console.log("script: " + script);

	this.bundleLoader = new BundleLoader();
	this.bundleLoader.onload = function() {
		setTimeout(this.nextInstruction.bind(this), 1000);
	}.bind(this);

	this.bundleLoader.load(script);

	this.distance = 20;
	this.delay = 500;

	if (BrowserUtil.getQueryStringParams().size)
		this.distance = BrowserUtil.getQueryStringParams().size;

	this.turtle = new Turtle();
	this.turtle.distance = this.distance;
	this.turtle.delay = this.delay;
	this.addChild(this.turtle);
	this.turtle.x = 100;
	this.turtle.y = 100;
	this.instructions = [];
}

inherits(PixiTurtle, PixiApp);

PixiTurtle.prototype.nextInstruction = function() {
	this.delay -= 10;
	if (this.delay < 0)
		this.delay = 0;
	this.turtle.delay = this.delay;

	if (!this.instructions.length) {
		this.turtle.visible = false;
		console.log("done");
		return;
	}

	var instruction = this.instructions.shift();

	switch (instruction) {
		case "walk":
			this.turtle.walk().then(this.nextInstruction.bind(this));
			break;

		case "left":
			this.turtle.rotate(-90).then(this.nextInstruction.bind(this));
			break;

		case "right":
			this.turtle.rotate(90).then(this.nextInstruction.bind(this));
			break;

		case "put":
			var g = new PIXI.Graphics();
			g.beginFill(0x000000, 1);
			g.drawRect(-this.distance * .9 / 2, -this.distance * .9 / 2, this.distance * .9, this.distance * .9);
			this.addChildAt(g, 0);

			g.x = this.turtle.x;
			g.y = this.turtle.y;

			g.alpha = 0;

			var tween = new TWEEN.Tween(g);
			tween.to({
				alpha: 1
			}, this.delay);
			tween.onComplete(function() {
				this.nextInstruction();
			}.bind(this));
			tween.start();
			break;

		default:
			throw new Error("unknown instruction");
			break;
	}
}

PixiTurtle.prototype.addInstruction = function(instruction) {
	this.instructions.push(instruction);
}

pixiTurtle = new PixiTurtle();

window.left = function() {
	pixiTurtle.addInstruction("left");
}

window.right = function() {
	pixiTurtle.addInstruction("right");
}

window.walk = function() {
	pixiTurtle.addInstruction("walk");
}

window.put = function() {
	pixiTurtle.addInstruction("put");
}