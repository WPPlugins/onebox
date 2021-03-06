// attempt to leverage the wp.mce api

( function( $ ) {
	wp.mce.views.register( 'onebox', {
		type: "onebox",

		overlay: true,

		View: {

			initialize: function(options) {
				this.shortcode = options.shortcode;
				this.url = options.shortcode.attrs.named.url;
				this.title = options.shortcode.attrs.named.title;
				this.description = options.shortcode.attrs.named.description;
				this.fetch();
			},

			loadingPlaceholder: function(){
				return '<a href="'+this.url+'">Link</a>';
			},

			fetch: function() {
				var data = '';
				if(this.title) data +=' data-title="'+this.title+'"';
				if(this.description) data +=' data-description="'+this.description+'"';

				this.onebox = $('<div class="onebox-container"'+data+'><a href="'+this.url+'">Link</a></div>').onebox();
				var t = this;
				this.onebox[0].dfd.done(function(){t.render(true);});
			},

			getHtml: function() {

				//console.log(this.onebox[0].state);
				if(this.onebox[0].state != "done") return '';
				return this.onebox.html();
			}
		},

		/**
		* Called when a TinyMCE view is clicked for editing.
		* - Parses the shortcode out of the element's data attribute
		* - Calls the `edit` method on the shortcode model
		* - Launches the model window
		* - Bind's an `update` callback which updates the element's data attribute
		*   re-renders the view
		*
		* @param {HTMLElement} node
		*/
		edit: function( node ) {
			var self = this,
				options = {},
				data = window.decodeURIComponent( $( node ).attr('data-wpview-text') ),
				type = $( node ).attr('data-wpview-type');
			var match = wp.shortcode.next( type, data );

			if ( match ) options = {
				url: match.shortcode.attrs.named.url,
				title: match.shortcode.attrs.named.title,
				description: match.shortcode.attrs.named.description
			};

			options.callback = function(shortcode){
				$( node ).attr( 'data-wpview-text', window.encodeURIComponent( shortcode ));
				wp.mce.views.refreshView( self, shortcode );
			};

			tinyMCE.activeEditor.execCommand('oneboxEditLink', true, options);
		}

	});
}(jQuery));