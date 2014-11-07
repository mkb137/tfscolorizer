/**
 *
 *   Copyright (c) 2014 Entropa Software Ltd.  All Rights Reserved.    
 *
 */
	TfsContent = {
		test : function () {
			console.log( "TfsContent.test");
			try {
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
