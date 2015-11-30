var fs = require("fs");
var PNG = require('pngjs2').PNG;

function pngReadPixelRgb(png, x, y) {
	return {
		r: png.data[(y * png.width + x) * 4],
		g: png.data[(y * png.width + x) * 4 + 1],
		b: png.data[(y * png.width + x) * 4 + 2],
	};
}

function pngReadPixelBool(png, x, y) {
	var rgb = pngReadPixelRgb(png, x, y);

	return ((rgb.r + rgb.g + rgb.b) / 3) < 128;
}

var data = fs.readFileSync("africa.png");
var image = PNG.sync.read(data);

var out = "";

var xx = null;
var yy = null;
var dir = 0;

function setDir(d) {
	var j = d - dir;

	if (j < 0)
		j += 4;

	switch (j) {
		case 0:
			break;

		case 1:
			out += "right();\n";
			break;

		case 2:
			out += "right();\n";
			out += "right();\n";
			break;

		case 3:
			out += "left();\n";
			break;
	}

	dir = d;
}

function walkToAndPut(x, y) {
	if (xx !== null) {
		if (x > xx) {
			setDir(0);
			for (var i = 0; i < x - xx; i++)
				out += "walk();\n";
		} else if (x < xx) {
			setDir(2);
			for (var i = 0; i < xx - x; i++)
				out += "walk();\n";
		}

		if (y > yy) {
			setDir(1);
			for (var i = 0; i < y - yy; i++)
				out += "walk();\n";
		} else if (y < yy) {
			setDir(3);
			for (var i = 0; i < yy - y; i++)
				out += "walk();\n";
		}
	}
	xx = x;
	yy = y;

	out += "put();\n";
}

for (y = 0; y < image.height; y++) {
	if (!(y % 2)) {
		for (x = 0; x < image.width; x++) {
			if (pngReadPixelBool(image, x, y))
				walkToAndPut(x, y);
		}
	} else {
		for (x = image.width - 1; x >= 0; x--) {
			if (pngReadPixelBool(image, x, y))
				walkToAndPut(x, y);
		}
	}
}

fs.writeFileSync("program2.js", out);