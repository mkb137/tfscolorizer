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
				borderColor: "#99DCBF",
				patterns : [
					{ patternType : "startswith", patternText : "Development" },
					{ patternType : "regex", patternText : "[Ff]ix [Bb]ug" }
				]
			},
			{ 
				backColor: "#f5f4dc",
				borderColor: "#DCDA99",
				patterns : [
					{ patternType : "startswith", patternText : "Documentation" }
				]
			},
			{ 
				backColor: "#f5e8dc",
				borderColor: "#DCB999",
				patterns : [
					{ patternType : "startswith", patternText : "Test" },
					{ patternType : "startswith", patternText : "Confirm" }
				]
			},
			{ 
				backColor: "#f5dcdc",
				borderColor: "#DC9999",
				patterns : [
					{ patternType : "contains", patternText : "Blocked" }
				]
			},
			{ 
				backColor: "#f4dcee",
				borderColor: "#DC9BCB",
				patterns : [
					{ patternType : "contains", patternText : "Analysis" }
				]
			},
			{ 
				backColor: "#e7dcf5",
				borderColor: "#B799DC",
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
