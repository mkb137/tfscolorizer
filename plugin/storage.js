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
				patterns : [
					{ patternType : "startswith", patternText : "Development" },
					{ patternType : "regex", patternText : "[Ff]ix [Bb]ug" }
				]
			},
			{ 
				id : 2,
				patterns : [
					{ patternType : "startswith", patternText : "Documentation" }
				]
			},
			{ 
				id : 3,
				patterns : [
					{ patternType : "startswith", patternText : "Test" },
					{ patternType : "startswith", patternText : "Confirm" }
				]
			},
			{ 
				id : 4,
				patterns : [
					{ patternType : "contains", patternText : "Blocked" }
				]
			},
			{ 
				id : 5,
				patterns : [
					{ patternType : "contains", patternText : "Analysis" }
				]
			},
			{ 
				id : 6,
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
