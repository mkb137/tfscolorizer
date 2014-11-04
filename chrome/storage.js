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
				id : 1,
				backColor: 0xdcf5ea,
				borderColor: 0x9aaca4,
				patterns : [
					{ patternType : "regex", patternText : "DEV" },
					{ patternType : "regex", patternText : "[Ff]ix [Bb]ug" }
				]
			},
			{ 
				id : 2,
				backColor: 0xf5f4dc,
				borderColor: 0xacab9a,
				patterns : [
					{ patternType : "startswith", patternText : "Documentation" }
				]
			},
			{ 
				id : 3,
				backColor: 0xf5e8dc,
				borderColor: 0xaca29a,
				patterns : [
					{ patternType : "startswith", patternText : "Test" },
					{ patternType : "startswith", patternText : "Confirm" }
				]
			},
			{ 
				id : 4,
				backColor: 0xf5dcdc,
				borderColor: 0xac9a9a,
				patterns : [
					{ patternType : "contains", patternText : "Blocked" }
				]
			},
			{ 
				id : 5,
				backColor: 0xf4dcee,
				borderColor: 0xab9aa7,
				patterns : [
					{ patternType : "contains", patternText : "Analysis" }
				]
			},
			{ 
				id : 6,
				backColor: 0xe7dcf5,
				borderColor: 0xa29aac,
				patterns : [
				]
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
