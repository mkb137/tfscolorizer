/**
 *
 *   Copyright (c) 2014 Entropa Software Ltd.  All Rights Reserved.    
 *
 */

	// The entry point
	$( document ).ready(function() {
		//console.log( "document.ready" );
		// Initialize the page
		TfsOptions.initialize();
	});

	TfsOptions = {		
		/** 
		 * Generates the options table.
		 */
		generateOptionsTable : function() {
			//console.log( "TfsOptions.generateOptionsTable" );
			try {
				// Get the container
				var $container = $( "#options-container" );
				// Clear the container just in case
				$container.empty();
				// Set some constants
				var colorCount = 6;
				var patternsPerColor = 3;
				// Create a table
				var $table = $( "<table>" )
					.addClass( "colors" )
					.appendTo( $container );
				var $tbody = $( "<tbody>" )
					.appendTo( $table );
				// For each color...
				for ( var i = 1; i <= colorCount; i++ ) {
					// Create a row
					var $colorRow = $( "<tr>" )
						.addClass( "color" )
						.addClass( "color-" + i )
						.appendTo( $tbody );
					// Add our color cell
					var $colorCell = $( "<td>" )
						.addClass( "color" )
						.appendTo( $colorRow );
					var $colorDiv = $( "<div>" )
						.addClass( "color" )
						.appendTo( $colorCell );
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
					for ( var j = 0; j < patternsPerColor; j++ ) {
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
					}					
				}
				// Add our row of buttons
				var $tfoot = $( "<tfoot>" )
					.appendTo( $table );
				var $buttonRow = $( "<tr>" )
					.addClass( "buttons" )
					.appendTo( $tfoot );
				var $buttonCell = $( "<td>" )
					.addClass( "buttons" )
					.attr( "colspan", "2" )
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
				// Return the table
				return $table;
			} catch( e ) {
				//console.log( "Error: " + e );
			}
			return null;
		},
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
					// Create a setting object
					var setting = { "id": id, "patterns" : patterns };
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
				// Generate the options table
				var $table = TfsOptions.generateOptionsTable();
				if ( $table == null ) return;
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
					TfsOptions.populateTable( $table, settings );
				} );
			} catch( e ) {
				//console.log( "Error: " + e );
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
		 * $table - the table
		 * settings - the settings object.
		 */
		populateTable : function( $table, settings ) {
			//console.log( "TfsOptions.populateTable" );
			try {
				// For each setting...
				for ( var i = 0; i < settings.length; i++ ) {
					var setting = settings[i];
					// Get the setting ID
					var id = setting.id;
					//console.log( " - id = " + id + ", type " + typeof ( id ) );
					// Get the row matching the id
					var $colorRow = $table.find( "tr.color-" + id );
					if ( $colorRow.length == 0 ) {
						//console.log( "WARNING - could not find row for color " + id );
					} else {
						//console.log( " - got row" );
						//console.log( " setting has " + setting.patterns.length + " patterns" );
						// Get the patterns table
						var $patternsTable = $colorRow.find( "table.patterns" );
						// For each pattern...
						for ( var j = 0; j < setting.patterns.length; j++ ) {
							var pattern = setting.patterns[j];
							// Get the row
							var $patternRow = $patternsTable.find( "tbody > tr:eq(" + j + ")");
							//console.log( " - got pattern type = " + pattern.patternType + ", text = " + pattern.patternText );
							// set the select value
							$patternRow.find( "select" ).val( pattern.patternType );
							$patternRow.find( "input"  ).val( pattern.patternText );
						}
					}
				}

			} catch( e ) {
				//console.log( "Error: " + e );
			}
		}
	};
