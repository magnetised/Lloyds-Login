(function() {
	var doc = document;
	return {
		init: function() {
			this.load_css('lloydslogin');
			this.load_script('lloydslogin');
		},

		load_script: function(script_name, callback) {
			callback = callback || function() {};
			var d=(new Date()).valueOf();
			var p=doc.createElement('script');
			p.type='text/javascript';
			p.src=__injected_base_url+"/"+script_name+".js?"+d;
			p.onload = callback;
			doc.body.appendChild(p)
		},
		load_css: function(name) {
			var d=(new Date()).valueOf();
			var p=doc.createElement('link');
			p.rel = "stylesheet";
			p.type = 'text/css';
			p.media = 'screen';
			p.href=__injected_base_url+"/"+name+".css?"+d;
			doc.body.appendChild(p)
		}
	}
})().init();
