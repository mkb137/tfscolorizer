/**
 *
 *   Copyright (c) 2014 Entropa Software Ltd.  All Rights Reserved.    
 *
 */
	TfsContent = {
		test : function () {
			console.log( "TfsContent.test");
			try {
//				console.log( " - testing content script" );
//				if ( typeof ( require ) !== "undefined" ) {
//					console.log( "require is defined" );
//				} else {
//					console.log( "require is not defined" );
//				}
//				var ss = require("sdk/simple-storage");
//				if ( typeof ( ss ) !== "undefined" ) {
//					console.log( "ss is defined" );
//				} else {
//					console.log( "ss is not defined" );
//				}
				if ( typeof ( self.port ) !== "undefined" ) {
					console.log( "self.port is defined" );
				} else {
					console.log( "self.port is not defined" );
				}
				TfsOptions.initialize();
				
			} catch ( e ) {
				console.error( e.message );
			}
		}
	};
