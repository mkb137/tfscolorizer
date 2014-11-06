/**
 *
 *   Copyright (c) 2014 Entropa Software Ltd.  All Rights Reserved.    
 *
 */

	TfsColorizer = {
		/**
		 * The loaded settings.
		 */
		settings : null,
		/**
		 * Applies the given pattern to the board.
		 */
		applyPattern : function( $card, backColor, borderColor, foreColor, patternType, patternText ) {
			//console.log( "TfsColorizer.applyPattern - type = '" + patternType + "', text = '" + patternText + "', background = " + colors.background + ", border = " + colors.border );
			try {
				//console.log( " - card text = '" + $card.text() + "'" );
				var text = $card.text();
				switch ( patternType ) {
					case "startswith":
						//console.log( " - index of '" + patternText + "' = " + text.indexOf( patternText ) );
						if ( text.indexOf( patternText ) == 0 ) {
							TfsColorizer.applyStyle( $card, backColor, borderColor, foreColor );
						}
						break;
					case "endswith":
						if ( text.indexOf( patternText ) == ( text.length - patternText.length ) ) {
							TfsColorizer.applyStyle( $card, backColor, borderColor, foreColor );
						}
						break;
					case "contains":
						if ( text.indexOf( patternText ) >= 0 ) {
							TfsColorizer.applyStyle( $card, backColor, borderColor, foreColor );
						}
						break;
					case "regex":
						var regex = new RegExp( patternText, "g" );
						if ( regex.test( text ) ) {
							TfsColorizer.applyStyle( $card, backColor, borderColor, foreColor );
						}
						break;
					case "user":
						var userText = $card.parent().find("div.witAssignedTo").text();
						if (userText.toLowerCase() === patternText.toLowerCase()) {
							TfsColorizer.applyStyle( $card, backColor, borderColor, foreColor );
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

					// Get the color object for this id
					// For each pattern in the setting...
					for ( var j = 0; j < setting.patterns.length; j++ ) {
						var pattern = setting.patterns[j];
						var patternType = pattern.patternType;
						var patternText = pattern.patternText;

						var color = "";
						if ( Util.perceivedBrightness( setting.backColor ) <= 130 ) {
							color = "#ffffff";
						}

						//console.log( " - applying pattern type = '" + patternType + "', text = '" + patternText + "'" );
						TfsColorizer.applyPattern( $card, setting.backColor, setting.borderColor, color, patternType, patternText );
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
		applyStyle : function( $card, backColor, borderColor, foreColor ) {
			//console.log( "TfsColorizer.applyStyle" );
			try {
				$card.parent().css( {
					"background-color": backColor,
					"border-left-color": borderColor
				} );

				if (foreColor) {
					$card.parent().find(".witTitle, .witRemainingWork, .witAssignedTo")
						.css({ "color": foreColor });
				}
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
