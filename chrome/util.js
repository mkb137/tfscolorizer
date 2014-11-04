function Util () {}

Util.perceivedBrightness = function (rgb) {
	var r = rgb >> 16;
	var g = (rgb >> 8) % 256;
	var b = rgb % 256;

	return Math.floor(Math.sqrt(
				r * r * .299 +
				g * g * .587 +
				b * b * .114));
}

Util.colorLuminance = function (hex, lum) {
	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}

Util.parseRgbColor = function (rgb) {
	var parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

	delete (parts[0]);
	for (var i = 1; i <= 3; ++i) {
	    parts[i] = parseInt(parts[i]).toString(16);
	    if (parts[i].length == 1) parts[i] = '0' + parts[i];
	}

	return "#" + parts.join('').toLowerCase();
}
