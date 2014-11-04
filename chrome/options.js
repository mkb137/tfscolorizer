/**
 *
 *   Copyright (c) 2014 Entropa Software Ltd.  All Rights Reserved.    
 *
 */

function ColorLuminance(hex, lum) {
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

function pad(a,b){return([1e15]+a).slice(-b)}

function parseRgbColor(rgb) {
	var parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

	delete (parts[0]);
	for (var i = 1; i <= 3; ++i) {
	    parts[i] = parseInt(parts[i]).toString(16);
	    if (parts[i].length == 1) parts[i] = '0' + parts[i];
	}

	return parts.join('').toLowerCase();
}

function createRow( $tbody, setting ) {
	var backColor = "#e7dcf5";
	var borderColor = "#a29aac";

	if (setting) {
		backColor = "#" + pad(setting.backColor.toString(16), 6);
		borderColor = "#" + pad(setting.borderColor.toString(16), 6);
	}

	// Create a row
	var $colorRow = $( "<tr>" )
		.addClass( "color" )
		.appendTo( $tbody );

	// Add our color cell
	var $colorCell = $( "<td>" )
		.addClass( "color" )
		.appendTo( $colorRow );
	var $colorDiv = $( "<div>" )
		.addClass( "color" )
		.css({ "background-color": backColor, "border-color": borderColor })
		.ColorPicker({
			onShow: function(cp) {
				$(cp).fadeIn(500);
				return false;
			},
			onHide: function(cp) {
				$(cp).fadeOut(500);
				return false;
			},
			onChange: function (hsb, hex, rgb) {
				$(this.data('colorpicker').el).css({ 'backgroundColor': '#' + hex, 'borderLeftColor': '#' + pad(ColorLuminance(hex, -0.3), 6) });
			},
			onBeforeShow: function () {
				var bg = parseRgbColor( this.style.backgroundColor );
				$(this).ColorPickerSetColor( bg );
			}
		})
		.appendTo( $colorCell )

	// Add a cell containing a table of options
	var $patternsCell = $( "<td>" )
		.addClass( "patterns" )
		.appendTo( $colorRow );
	var $patternsTable = $( "<table>" )
		.addClass( "patterns" )
		.appendTo( $patternsCell );
	var $patternsBody = $( "<tbody>" )
		.appendTo( $patternsTable );

	// For each pattern...
	for ( var j = 0; j < 3; j++ ) {
		// Add a pattern row
		var $patternRow = $( "<tr>" )
			.addClass( "pattern" )
			.appendTo( $patternsBody );

		// Add the pattern types
		var $patternTypeCell = $( "<td>" )
			.addClass( "patternType" )
			.appendTo( $patternRow );
		var $select = $( "<select>" )
			.addClass( "patternType" )
			.appendTo( $patternTypeCell );

		$( "<option>" ).attr( "value", "startswith" ).text( "Starts With"	).appendTo( $select );
		$( "<option>" ).attr( "value", "endswith"	).text( "Ends With"		).appendTo( $select );
		$( "<option>" ).attr( "value", "contains"	).text( "Contains"		).appendTo( $select );
		$( "<option>" ).attr( "value", "regex"		).text( "RegEx"			).appendTo( $select );

		// Add the pattern text
		var $patternTextCell = $( "<td>" )
			.addClass( "patternText" )
			.appendTo( $patternRow );
		var $input = $( "<input>" )
			.addClass( "patternText" )
			.attr( "type", "text" )
			.attr( "maxlength", "50" )
			.appendTo( $patternTextCell );

		if (setting && setting.patterns.length > j) {
			var pattern = setting.patterns[j];
			$select.val( pattern.patternType );
			$input.val( pattern.patternText );
		}
	}
}

	// The entry point
	$( document ).ready(function() {
		//console.log( "document.ready" );
		// Initialize the page
		TfsOptions.initialize();
	});

	TfsOptions = {		
		/** 
		 * Gets the settings object from the UI
		 */
		getSettings : function() {
			//console.log( "TfsOptions.getSettings" );
			try {
				// Create a settings array
				var settings = new Array();
				// For each color row...
				$( "tr.color" ).each( function( index ) {
					//console.log( " - checking row " + index );
					// Set the row ID
					var id = index + 1;

					// Create an array for our patterns
					var patterns = new Array();

					var backColor = $( this ).find("div.color").first()
						.css('backgroundColor');

					var hexString = parseRgbColor(backColor);
					var borderColor = ColorLuminance(hexString, -0.3);
					
					// Create a setting object
					var setting = { "id": id, "backColor": parseInt(hexString.toUpperCase(), 16), "borderColor": parseInt(borderColor.substr(1).toUpperCase(), 16), "patterns" : patterns };
					settings.push( setting );
					
					// For each pattern row...
					$( this ).find( "tr.pattern" ).each( function( patternIndex ) {
						//console.log( " - checking pattern " + patternIndex );
						var $patternRow = $( this );
						// Get the pattern type and text
						var patternType = $patternRow.find( "select" ).val();
						var patternText = $patternRow.find( "input" ).val();
						// If there is text...
						if ( patternText.length > 0 ) {
							// Add the pattern object to the setting
							patterns.push( { "patternType": patternType, "patternText": patternText } );
						}
					} );

				} );
				// return the settings
				return settings;
			} catch( e ) {
				//console.log( "Error: " + e );
			}
			return null;
		},
		/** 
		 * Initializes the UI.
		 */
		initialize : function() {
			//console.log( "TfsOptions.initialize" );
			try {
				// Load the settings
//				var settings = TfsOptions.loadSettings();
				chrome.storage.sync.get( "settings", function( items ) {
					//console.log( " - items = " + items + ", type " + typeof(items) );
					var settings;
					if ( typeof items.settings !== "undefined" ) {
						settings = JSON.parse( items.settings );
					} else {
						settings = TfsDefaults.defaultSettings;
					}
					// Populate the table with the settings
					TfsOptions.populateTable( settings );
				} );
			} catch( e ) {
				//console.log( "Error: " + e );
			}
		},
		onAddButtonClicked : function() {
			try {
				createRow( $( "table.colors > tbody" ) );
			} catch( e ) {
			}
		},
		/** 
		 * Called when the reload button is clicked.
		 */
		onReloadButtonClicked : function() {
			//console.log( "TfsOptions.onReloadButtonClicked" );
			try {
				if ( !confirm( "Are you sure you want to reload the settings?" ) ) return;
				// Re-initialize the table
				TfsOptions.initialize();
			} catch( e ) {
				//console.log( "Error: " + e );
			}
		},
		/** 
		 * Called when the reset button is clicked.
		 */
		onResetButtonClicked : function() {
			//console.log( "TfsOptions.onResetButtonClicked" );
			try {
				if ( !confirm( "Are you sure you want to reset to the default settings?" ) ) return;
				// Clear the settings
//				localStorage.removeItem( "settings" );
				chrome.storage.sync.remove( "settings", function() {
					//console.log( " - setting removed" );
				} );
				// Re-initialize the table
				TfsOptions.initialize();
			} catch( e ) {
				//console.log( "Error: " + e );
			}
		},
		/** 
		 * Called when the save button is clicked.
		 */
		onSaveButtonClicked : function() {
			//console.log( "TfsOptions.onSaveButtonClicked" );
			try {
				// Get the settings from the table
				var settings = TfsOptions.getSettings();
				// Convert the settings to json
				var json = JSON.stringify( settings );
				// Save them in local storage
				localStorage["settings"] = json;
				chrome.storage.sync.set( { 'settings': json }, function() {
					//console.log( " - settings saved" );
				} );
			} catch( e ) {
				//console.log( "Error: " + e );
			}
		},
		/** 
		 * Populates the table from the settings.
		 * settings - the settings object.
		 */
		populateTable : function( settings ) {
			//console.log( "TfsOptions.populateTable" );
			try {
				// For each setting...
				var $container = $( '#options-container' );
				var patternsPerColor = 3;

				$container.empty();

				// Create a table
				var $table = $( "<table>" )
					.addClass( "colors" )
					.appendTo( $container );
				var $tbody = $( "<tbody>" )
					.appendTo( $table );

				for ( var i = 0; i < settings.length; i++ ) {
					createRow( $tbody, settings[i] );
				}

				// Add our row of buttons
				var $tfoot = $( "<tfoot>" )
					.appendTo( $table );
				var $buttonRow = $( "<tr>" )
					.addClass( "buttons" )
					.appendTo( $tfoot );

				var $buttonCell1 = $( "<td>" )
					.addClass( "buttons" )
					.appendTo( $buttonRow );
				var $addButton = $( "<button>" )
					.addClass( "addButton" )
					.text( "Add" )
					.click( TfsOptions.onAddButtonClicked )
					.appendTo( $buttonCell1 );

				var $buttonCell = $( "<td>" )
					.addClass( "buttons" )
					.appendTo( $buttonRow );
				var $resetButton = $( "<button>" )
					.addClass( "resetButton" )
					.text( "Reset" )
					.click( TfsOptions.onResetButtonClicked )
					.appendTo( $buttonCell );
				var $reloadButton = $( "<button>" )
					.addClass( "reloadButton" )
					.text( "Reload" )
					.click( TfsOptions.onReloadButtonClicked )
					.appendTo( $buttonCell );
				var $saveButton = $( "<button>" )
					.addClass( "saveButton" )
					.text( "Save" )
					.click( TfsOptions.onSaveButtonClicked )
					.appendTo( $buttonCell );
			} catch( e ) {
				//console.log( "Error: " + e );
			}
		}
	};
