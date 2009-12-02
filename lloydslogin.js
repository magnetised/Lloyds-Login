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
			// append the css file
			var d=(new Date()).valueOf();
			var p=$E('link');
			p.rel = "stylesheet";
			p.type = 'text/css';
			p.media = 'screen';
			p.href=__injected_base_url+"/"+name+".css?"+d;
			$A(p);
		},
		login: function(){
			// set things up then show the new login box
			this.sandbox = this.launch_sandbox();
			this.overlay = this.launch_overlay();
			this.container = this.launch_container();
			this.init_bank_form();
			this.login_box();
		},
		init_bank_form: function() {
			// find the original form and set its target to our 
			// iframe
			this.form = $D.getElementById('form');
			try {
				this.form.target = this.sandbox.name;
			} catch (e) {}
		},
		launch_sandbox: function() {
			//  create the invisible iframe that is used to load the
			//  stage II form
			var o = $E('iframe');
			o.id = 'injected-sandbox';
			o.name = 'injected-sandbox';
			o.src = 'javascript:false;'
			$A(o);
			return o;
		},
		launch_overlay: function() {
			// hides the original form
			var o = $E('div');
			o.id = 'injected-overlay';
			$A(o);
			return o;
		},
		launch_container: function() {
			// container div for new login form
			var o = $E('div');
			o.id = 'injected-container';
			$A(o);
			return o;
		},
		do_login: function(user_id, password, secret) {
			// take the entered values and put them in the right places in
			// the original Lloyds provided login form
			this.form.elements['UserId1'].value = user_id;
			this.form.elements['Password'].value = password;
			// set up the callback that does stage II
			this.sandbox.onload = (function(injected, secret) {
				return function() {
					injected.login_stage_2(secret);
				};
			})(this, secret);
			this.form.submit();
		},
		login_stage_2: function(secret) {
			// Memorable info entry page has been loaded into our invisible
			// iframe. This is the onload callback for that frame
			// which is passed the memorable info string and uses it
			// to set the values of the pulldowns
			var doc = this.sandbox.contentDocument, i;

			var find_elements = function(tagname) {
				var el = doc.getElementsByTagName(tagname), by_name = {};
				for (var i = 0, l = el.length; i < l; i++) {
					by_name[el[i].name] = el[i];
				}
				return by_name;
			};
			var selects = find_elements('select'),
				inputs = find_elements('input'),
				keys = [], values = [];
			// save the selects into 'values' and the required char into keys
			// the "ResponseKey" fields hold the position within the secret
			// that must be entered (starting at 1)
			for (i = 0; i < 3; i++) {
				values.push(selects["ResponseValue"+i]);
				keys.push(inputs["ResponseKey"+i].value);
			}
			// set the values of the three selects to be the relevant
			// char in the secret phrase
			// if we haven't found 3 inputs and 3 selects then we're probably
			// not looking at the right page and the login has most likely failed
			if (keys.length === 3 && values.length === 3) {
				for (i = 0; i < 3; i++) {
					// set the values of the selects
					values[i].value = secret.charAt(keys[i]-1);
				}
				// make the form target the top so that the account page will
				// load and replace the obscured login page then submit the form
				doc.theForm.target = "_top";
				doc.theForm.submit();
			} else {
				alert("Login failed")
			}
		},
		login_box: function(){
			// Build login form
			var o = $E('div');
			o.id = 'injected-login-holder';
			var ci = function(container, name, placeholder) {
				// little function to create an input and give it
				// an inline label
				var i = $E('input'), p = $E('p'), l = $E('label');
				i.type = 'password';
				i.id = name;
				i.name = name;
				i.className = 'injected';
				l['for']= i.id;
				l.innerHTML = placeholder;
				p.appendChild(l);
				p.appendChild(i);
				container.appendChild(p);
				i.onfocus = function() {
					l.style.display = 'none';
				}
				i.onblur = function() {
					if (this.value === '') {
						l.style.display = 'block';
					}
				}
				return i;
			};
			var h = $E('h2');
			h.innerHTML = "Lloyds TSB Login";
			o.appendChild(h);
			var i1 = ci(o, 'injected_UserId1', 'User ID')
			var i2 = ci(o, 'injected_Password', 'Password')
			var i3 = ci(o, 'injected_Secret', 'Memorable Info')
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
			// close the overlay and remove all the added elements
			// this is clean enough that a second use of the bookmarklet
			// will work without problems
			this.container.parentNode.removeChild(this.container);
			this.overlay.parentNode.removeChild(this.overlay);
			this.sandbox.parentNode.removeChild(this.sandbox);
		}
	}
})().init();

