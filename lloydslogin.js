(function() {
	var $D = document,
	$E = function(t) { return $D.createElement(t); },
	$A = function(e) { $D.body.appendChild(e); };
	return {
		init: function() {
			this.load_css('lloydslogin.min');
			this.login();
		},
		load_css: function(name) {
			var d=(new Date()).valueOf();
			var p=$E('link');
			p.rel = "stylesheet";
			p.type = 'text/css';
			p.media = 'screen';
			p.href=__injected_base_url+"/"+name+".css?"+d;
			$A(p);
		},
		login: function(){
			this.sandbox = this.launch_sandbox();
			this.overlay = this.launch_overlay();
			this.container = this.launch_container();
			this.init_bank_form();
			this.login_box();
		},
		init_bank_form: function() {
			this.form = $D.getElementById('form');
			try {
				this.form.target = this.sandbox.name;
			} catch (e) {}
		},
		launch_sandbox: function() {
			var o = $E('iframe');
			o.id = 'injected-sandbox';
			o.name = 'injected-sandbox';
			o.src = 'javascript:false;'
			$A(o);
			return o;
		},
		launch_overlay: function() {
			var o = $E('div');
			o.id = 'injected-overlay';
			$A(o);
			return o;
		},
		launch_container: function() {
			var o = $E('div');
			o.id = 'injected-container';
			$A(o);
			return o;
		},
		do_login: function(user_id, password, secret) {
			this.form.elements['UserId1'].value = user_id;
			this.form.elements['Password'].value = password;
			this.sandbox.onload = (function(injected, secret) {
				return function() {
					injected.login_stage_2(secret);
				};
			})(this, secret);
			this.form.submit();
		},
		login_stage_2: function(secret) {
			var doc = this.sandbox.contentDocument, i;
			var find_elements = function(tagname) {
				var el = doc.getElementsByTagName(tagname), by_name = {};
				for (var i = 0, l = el.length; i < l; i++) {
					by_name[el[i].name] = el[i];
				}
				return by_name;
			}
			var selects = find_elements('select'),
			inputs = find_elements('input'),
			keys = [], values = [];
			for (i = 0; i < 3; i++) {
				values.push(selects["ResponseValue"+i]);
				keys.push(inputs["ResponseKey"+i].value);
			}
			if (keys.length === 3 && values.length === 3) {
				for (i = 0; i < 3; i++) {
					values[i].value = secret.charAt(keys[i]-1);
				}
				doc.theForm.target = "_top";
				doc.theForm.submit();
			} else {
				alert("Login failed")
			}
		},
		login_box: function(){
			var o = $E('div');
			o.id = 'injected-login-holder';
			var ci = function(name, placeholder) {
				var i = $E('input')
				i.type = 'password';
				i.id = name;
				i.name = name;
				i.className = 'injected';
				i.placeholder = placeholder;
				return i;
			};
			var h = $E('h2');
			h.innerHTML = "Lloyds TSB Login";
			o.appendChild(h);
			var i1 = ci('injected_UserId1', 'User ID')
			var i2 = ci('injected_Password', 'Password')
			var i3 = ci('injected_Secret', 'Memorable Info')
			o.appendChild(i1);
			o.appendChild(i2);
			o.appendChild(i3);
			var p = $E('p');
			var a = $E('a');
			a.innerHTML = "\xd7 Cancel";
			a.onclick = (function(injected) {
				return function() {
					injected.dismiss();
				};
			})(this);
			var b = $E('button')
			b.innerHTML = 'Login';
			b.onclick = (function(injected, user_id, password, secret) {
				return function() {
					injected.do_login(user_id.value, password.value, secret.value);
				};
			})(this, i1, i2, i3);
			p.appendChild(a);
			p.appendChild(b);
			o.appendChild(p);
			this.container.appendChild(o);
			// i1.focus();
		},
		dismiss: function() {
			this.container.parentNode.removeChild(this.container);
			this.overlay.parentNode.removeChild(this.overlay);
			this.sandbox.parentNode.removeChild(this.sandbox);
		}
	}
})().init();

