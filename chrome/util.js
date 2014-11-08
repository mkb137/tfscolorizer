function Util () {}

Util.perceivedBrightness = function (hex) {
	var r = parseInt(hex.substr(1, 2), 16);
	var g = parseInt(hex.substr(3, 2), 16);
	var b = parseInt(hex.substr(5, 2), 16);

	return Math.floor(Math.sqrt(
				r * r * .299 +
				g * g * .587 +
				b * b * .114));
}

// Converts an rgb color (e.g. "rgb( 1, 2, 3 )" to a hex value
Util.parseRgbColor = function (rgb) {
	var parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

	delete (parts[0]);
	for (var i = 1; i <= 3; ++i) {
	    parts[i] = parseInt(parts[i]).toString(16);
	    if (parts[i].length == 1) parts[i] = '0' + parts[i];
	}

	return "#" + parts.join('').toLowerCase();
}
		
// Converts a hex (e.g. #RRGGBB) color to an object with r, g, and b components.
Util.hexToRgb = function( hex ) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

// Adjusts the given hex color by the given H, S, and V multipliers and returns the resulting hex value.
// Note: this depends on Colour.js
Util.adjustHSV = function( hex, hFactor, sFactor, vFactor ) {
	// Get the R,G,B values
	var rgbValues = Util.hexToRgb( hex );
	// Get an RGB object
	var rgb = new RGBColour( rgbValues.r, rgbValues.g, rgbValues.b );
	// Get the HSV values
	var hsvValues = rgb.getHSV();
	// Scale the HSV values
	hsvValues.h = Math.min( 359.0, hsvValues.h * hFactor );
	hsvValues.s = Math.min( 100.0, hsvValues.s * sFactor );
	hsvValues.v = Math.min( 100.0, hsvValues.v * vFactor );
	// Get and HSV object
	var hsv = new HSVColour( hsvValues.h, hsvValues.s, hsvValues.v );
	var out = hsv.getCSSHexadecimalRGB();
	return out;
}

