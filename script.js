/**
 *
 *   Copyright (c) 2014 Entropa Software Ltd.  All Rights Reserved.    
 *
 */

	TfsColorizer = {	
		/**
		 * Our board colors, consisting of the pair of background and border colors.
		 */
		colors : [
			{
				"background": "#dcf5ea",
				"border": "#94d9bb"
			}, {
				"background": "#f5f4dc",
				"border": "#d9d694"
			}, {
				"background": "#f5e8dc",
				"border": "#d9b593"
			}, {
				"background": "#f5dcdc",
				"border": "#d99494"
			}, {
				"background": "#f4dcee",
				"border": "#d994c7"
			}, {
				"background": "#e7dcf5",
				"border": "#b194d9"
			}
		],
		/**
		 * The loaded settings.
		 */
		settings : null,
		/**
		 * Applies the given pattern to the board.
		 */
		applyPattern : function( $card, colors, patternType, patternText ) {
			//console.log( "TfsColorizer.applyPattern - type = '" + patternType + "', text = '" + patternText + "', background = " + colors.background + ", border = " + colors.border );
			try {
				//console.log( " - card text = '" + $card.text() + "'" );
				var text = $card.text();
				switch ( patternType ) {
					case "startswith":
						//console.log( " - index of '" + patternText + "' = " + text.indexOf( patternText ) );
						if ( text.indexOf( patternText ) == 0 ) {
							TfsColorizer.applyStyle( $card, colors );
						}
						break;
					case "endswith":
						if ( text.indexOf( patternText ) == ( text.length - patternText.length ) ) {
							TfsColorizer.applyStyle( $card, colors );
						}
						break;
					case "contains":
						if ( text.indexOf( patternText ) >= 0 ) {
							TfsColorizer.applyStyle( $card, colors );
						}
						break;
					case "regex":
						var regex = new RegExp( patternText, "g" );
						if ( regex.test( text ) ) {
							TfsColorizer.applyStyle( $card, colors );
						}
						break;
				}
			} catch( e ) {
				//console.log( "Error: " + e );
			}
		},
		/**
		 * Applies the settings to the board
		 */
		applySettings : function( settings ) {
			//console.log( "TfsColorizer.applySettings" );
			try {
				// Pull the user's name
				var userName = $( "li[command = 'user']" ).text();
				//console.log( "userName = " + userName );
				// Pull a list of all the cards on the board
				var $cards = $( "div.tbTile > div.tbTileContent" ).not( ".tile-dimmed" ).find( " > div.witTitle" );
				// For each card...
				$cards.each( function() {
					var $card = $( this );
					TfsColorizer.applySettingsToCard( $card, settings, userName );
				} );			
			} catch( e ) {
				//console.log( "Error: " + e );
			}
		},
		/**
		 * Applies the style to the card.
		 */
		applySettingsToCard : function( $card, settings, userName ) {
			//console.log( "TfsColorizer.applyStyle" );
			try {
				// For each setting...
				for ( var i = 0; i < settings.length; i++ ) {
					var setting = settings[i];
					var id = setting.id;
					//console.log( " - checking setting id = " + id );
					// Get the color object for this id
					var colors = TfsColorizer.colors[parseInt( id ) - 1];
					// For each pattern in the setting...
					for ( var j = 0; j < setting.patterns.length; j++ ) {
						var pattern = setting.patterns[j];
						var patternType = pattern.patternType;
						var patternText = pattern.patternText;
						//console.log( " - applying pattern type = '" + patternType + "', text = '" + patternText + "'" );
						TfsColorizer.applyPattern( $card, colors, patternType, patternText );
					}
				}
				// Apply the user name setting
				TfsColorizer.applyUserName( $card, userName );
			} catch( e ) {
				//console.log( "Error: " + e );
			}
		},
		/**
		 * Applies the style to the card.
		 */
		applyStyle : function( $card, colors ) {
			//console.log( "TfsColorizer.applyStyle" );
			try {
				$card.parent().css( {
					"background-color": colors.background,
					"border-left-color": colors.border
				} );
			} catch( e ) {
				//console.log( "Error: " + e );
			}
		},
		/**
		 * Applies the user name style to the card.
		 */
		applyUserName : function( $card, userName ) {
			//console.log( "TfsColorizer.applyUserName" );
			try {
				// Pull the card's user name
				var cardName = $card.parent().find( "div.witAssignedTo" ).text();
				//console.log( "cardName = '" + cardName + "', = username? " + (userName == cardName) );
				// If the card's name matches the user name...
				if ( userName == cardName ) {
					// Bold the card
					$card.parent().css( {
						"font-weight": "bold"
					} );
				}

			} catch( e ) {
				//console.log( "Error: " + e );
			}
		},
		/**
		 * Initializes the colorization.
		 */
		initialize : function() {
			//console.log( "TfsColorizer.initialize" );
			try {
				// Load the settings
				chrome.storage.sync.get( "settings", function( items ) {
					//console.log( " - items = " + items + ", type " + typeof(items) );
					//console.log( " - got settings '" + items.settings + "', type " + typeof items.settings );
					var settings;
					if ( typeof items.settings !== "undefined" ) {
						settings = JSON.parse( items.settings );
					} else {
						settings = TfsDefaults.defaultSettings;
					}
					// Save the settings
					TfsColorizer.settings = settings;
					//console.log( " - got settings = " + settings.length );
					// Apply the settings
					TfsColorizer.applySettings( settings );
					// Listen to when cards are changed by clicking on them
					$( document ).on( "focus", "div.tbTile",  TfsColorizer.onCardFocused );
				} );	
			} catch( e ) {
				//console.log( "Error: " + e );
			}			
		},
		/**
		 * Called when a card is focused upon.
		 */
		onCardFocused : function() {
			console.log( "TfsColorizer.onCardFocused" );
			try {
				// Pull the user's name
				var userName = $( "li[command = 'user']" ).text();
				var $this = $( this );
				var $card = $this.find( " > div.tbTileContent" ).not( ".tile-dimmed" ).find( " > div.witTitle" );
				console.log( " - got " + $card.length + " card" );
				TfsColorizer.applySettingsToCard( $card, TfsColorizer.settings, userName );
			} catch( e ) {
				//console.log( "Error: " + e );
			}			
		}
	};

	// The entry point
	$( document ).ready(function() {
		//console.log( "TfsColorizer.document.ready" );
		TfsColorizer.initialize();
	});
