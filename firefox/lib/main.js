var pageMod	= require( "sdk/page-mod" );
var self	= require( "sdk/self" );
var widget	= require('sdk/widget');
var buttons = require('sdk/ui/button/action');
var tabs	= require("sdk/tabs");
var ss		= require("sdk/simple-storage");

/**
 * This will handle storage requests and responses.
 */
TfsStorage = {
	worker : null,
	initialize : function ( worker ) {
		TfsStorage.worker = worker;
		worker.port.on( "loadSettingsRequest",  TfsStorage.onLoadSettingsRequest  );
		worker.port.on( "saveSettingsRequest",  TfsStorage.onSaveSettingsRequest  );
		worker.port.on( "clearSettingsRequest", TfsStorage.onClearSettingsRequest );
	},
	onLoadSettingsRequest : function () {
		console.log( "TfsStorage.onLoadSettingsRequest" );
		// Pull the settings from storage
		var json = ss.storage.settings;
		// Parse the json
		var settings;
		if ( null != json ) {
			settings = JSON.parse( json );
		} else {
			settings = null;
		}
		// Send the response
		TfsStorage.worker.port.emit( "loadSettingsResponse", settings );
	},
	onSaveSettingsRequest : function ( settings ) {
		console.log( "TfsStorage.onSaveSettingsRequest" );
		// JSON-ify the settings
		var json;
		if ( null != settings ) {
			json = JSON.stringify( settings );	
		} else {
			json = null;
		}
		// Save them to storage
		ss.storage.settings = json;
		// There is no response
	},
	onClearSettingsRequest : function ( settings ) {
		console.log( "TfsStorage.onClearSettingsRequest" );
		// Clear the settings in storage
		ss.storage.settings = null;
		// There is no response
	}	
};

// Set up our toolbar button
var button = buttons.ActionButton( {
	id: "colorizer-options",
	label:	"TFS Colorizer",
	icon: {
		"16": "./icon_16.png",
		"32": "./icon_32.png",
		"64": "./icon_64.png"
	},
	/**
	 * This is called when our toolbar button is clicked.
	 */ 
	onClick: function ( state ) {
		try {
			// Get the options URL
			var url = self.data.url( "options.html" );
			// For each open tab...
			console.log( " - got " + tabs.length + " tabs" );
			for ( var i = 0; i < tabs.length; i++ ) {
				var tab = tabs[i];
				// If this is our options tab...
				if ( tab.url == url ) {
					// Activate the tab
					tab.activate();
					// We're done
					return ;
				}
			}
			// We didn't find the options page open, above, so open it.
			tabs.open( url );
		} catch ( e ) {
			console.error( e.message );
		}
	}
});

// Modify our options page
pageMod.PageMod( {
	include: self.data.url( "options.html" ),
	contentScriptFile: [
		self.data.url("jquery-2.1.0.min.js"),
		self.data.url("common.js"),
		self.data.url("options.js")
	],
	contentScript: "TfsOptions.initialize();",
	onAttach: function ( worker ) {
		TfsStorage.initialize( worker );
	}
});

// Modify any TFS boards
pageMod.PageMod( {
	include: /.*\/tfs\/.*_boards.*/,
	contentScriptFile: [
		self.data.url("jquery-2.1.0.min.js"),
		self.data.url("common.js"),
		self.data.url("script.js")
	],
	onAttach: function (worker) {
		TfsStorage.initialize( worker );
	}
} );
