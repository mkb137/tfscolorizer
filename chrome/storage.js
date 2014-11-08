/**
 *
 *   Copyright (c) 2014 Entropa Software Ltd.  All Rights Reserved.    
 *
 */
	TfsDefaults = {		
		/**
		 * These are the default settings, used if we have none in storage.
		 * Acceptable pattern types: "startswith", "endswith", "contains", "regex".
		 */
		defaultSettings : [
			// We have one object for each color
			{ 
				backColor: "#dcf5ea",
				borderColor: "#9aaca4",
				patterns : [
					{ patternType : "regex", patternText : "DEV" },
					{ patternType : "regex", patternText : "[Ff]ix [Bb]ug" }
				]
			},
			{ 
				backColor: "#f5f4dc",
				borderColor: "#acab9a",
				patterns : [
					{ patternType : "startswith", patternText : "Documentation" }
				]
			},
			{ 
				backColor: "#f5e8dc",
				borderColor: "#aca29a",
				patterns : [
					{ patternType : "startswith", patternText : "Test" },
					{ patternType : "startswith", patternText : "Confirm" }
				]
			},
			{ 
				backColor: "#f5dcdc",
				borderColor: "#ac9a9a",
				patterns : [
					{ patternType : "contains", patternText : "Blocked" }
				]
			},
			{ 
				backColor: "#f4dcee",
				borderColor: "#ab9aa7",
				patterns : [
					{ patternType : "contains", patternText : "Analysis" }
				]
			},
			{ 
				backColor: "#e7dcf5",
				borderColor: "#a29aac",
				patterns : []
			}				
		]
	};

	if ( chrome.runtime ) {
		//console.log( "adding listener to chrome.runtime.onMessage" );
		chrome.runtime.onMessage.addListener( function( request, sender, sendResponse ) {
			//console.log( "onMessage - request.method = " + request.method + ", request.key = " + request.key );
			if ( request.method == "getLocalStorage" ) {
				sendResponse( { data: localStorage[request.key] } );
			} else {
				sendResponse({}); // snub them.
			}
		});
	}
