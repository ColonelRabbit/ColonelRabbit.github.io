const DmSwitcher = {
	_PLACEHOLDER_TEXT: "DM Secret Password Box",


  LOGGED_IN: "logged-in",
  LOGGED_OUT: "logged-out",

  init: init = function() {
    //  DO I LOG IN AUTOMATICALLY OR SHOW LOGIN BOX
    //    DmSwitcher.currentStatus = DmSwitcher.loadLoginFromCookie();
    DmSwitcher.loadLoginFromCookie();

    if (DmSwitcher.cookie == DmSwitcher.LOGGED_OUT) {
      DmSwitcher.showLoginBox();
      //DmSwitcher.loginBox();
    } else {
      DmSwitcher.loggedIn();
    }
  },

  loadLoginFromCookie: loadLoginFromCookie = function () {
    DmSwitcher.cookie = DmSwitcher.readCookie();
    DmSwitcher.cookie = DmSwitcher.cookie ? DmSwitcher.cookie : DmSwitcher.LOGGED_OUT;
  },

  createCookie: createCookie = function (value) {
    Cookies.set("dm-login", value, {expires: 365});
  },

  readCookie: readCookie = function () {
    return Cookies.get("dm-login");
  },

  showingLoginBox: showingLoginBox = function() {
    return document.getElementById('dm-login-box') !== null;
  },

  showLoginBox: showLoginBox = function() {
  		const a = document.createElement('a');
  		a.href = '#';
  		a.className = 'loginBoxToggle';
      console.log(DmSwitcher.showingLoginBox());
      a.innerHTML = "Show Login";

  		a.setAttribute('onclick', "DmSwitcher.loginBox();");

  		const li = document.createElement('li');
  		li.id = 'loginBoxToggler';
  		li.setAttribute('role', 'presentation');
  		li.appendChild(a);

  		const appendBefore = document.getElementById('wrp-omnisearch-input');
  		appendBefore.parentNode.insertBefore(li, appendBefore);
  },


	loginBox: loginBox = function () {
    if (DmSwitcher.cookie == 'logged-in') {

      return null;
    } else if (DmSwitcher.showingLoginBox()) {
      const loginBox = document.getElementById(`dm-login-box`);
      loginBox.parentNode.removeChild(loginBox);

      const $loginBoxToggler = $(`.loginBoxToggle`);
      $loginBoxToggler.html(`Show Login`);

      return null;
    }
		const $nav = $(`#navbar`);
    $nav.append(`
  		<div class="input-group" id="dm-login-box">
  			<input id="dm-login-input" class="form-control" placeholder="${DmSwitcher._PLACEHOLDER_TEXT}" title="Don't even think about hacking in...">
  			<div class="input-group-btn">
  				<button onclick="" class="btn btn-default" id="dm-login-submit" ><span class="glyphicon glyphicon-log-in"></span></button>
  			</div>
  		</div>
  	`);

    const $loginBoxToggler = $(`.loginBoxToggle`);
    $loginBoxToggler.html(`Hide Login`);

		const $loginSubmit = $(`#dm-login-submit`);
    const $loginInput = $(`#dm-login-input`);

		$loginInput.on("keypress", (e) => {
			if (e.which === 13) {
				clickFirst = true;
        DmSwitcher.login($loginInput.val());
			}
			e.stopPropagation();
		});

		$loginSubmit.on("click", (e) => {
			e.stopPropagation();
      DmSwitcher.login($loginInput.val());
		});

	},

  login: login = function(password) {
    if (password == "pass") {
      const loginInput = document.getElementById(`dm-login-input`);
      loginInput.parentNode.removeChild(loginInput);
      const loginSubmit = document.getElementById(`dm-login-submit`);
      loginSubmit.parentNode.removeChild(loginSubmit);
      DmSwitcher.cookie = DmSwitcher.LOGGED_IN;
      DmSwitcher.loggedIn();
      const loginBoxToggler = document.getElementById(`loginBoxToggler`);
      loginBoxToggler.parentNode.removeChild(loginBoxToggler);
    } else {
      const loginInput = document.getElementById(`dm-login-input`);
      loginInput.value = '';
      loginInput.placeholder = 'Invalid Password';
    }
  },

  loggedIn: loggedIn = function() {
    DmSwitcher.LIdropdown('wrp-omnisearch-input', 'dms', 'dropdown');
    DmSwitcher.A('dms', 'dmOption', 'dropdown-toggle', 'dropdown', '#', 'button', 'true', 'false', "DM Tools <span class='caret'></span>");
    DmSwitcher.UL('dms', 'ul_dms', 'dropdown-menu');
    DmSwitcher.LI('ul_dms', 'adventures.html', 'Adventures');
    DmSwitcher.LI('ul_dms', 'crcalculator.html', 'CR Calculator');
    DmSwitcher.LI('ul_dms', 'cultsboons.html', 'Cults & Demonic Boons');
    DmSwitcher.LIspecial('ul_dms', 'https://kobold.club', 'Encounter Builder', '_blank', 'We could literally never build something better than Kobold Fight Club');
    DmSwitcher.LI('ul_dms', 'encountergen.html', 'Encounter Generator');
    DmSwitcher.LI('ul_dms', 'lootgen.html', 'Loot Generator');
    DmSwitcher.LI('ul_dms', 'objects.html', 'Objects');
    DmSwitcher.LI('ul_dms', 'trapshazards.html', 'Traps & Hazards');
    DmSwitcher.LI('ul_dms', 'prestigeclasses.html', 'Prestige Classes');
    DmSwitcher.LI('ul_dms', 'dmsecrets.html', 'DM World Info');
	DmSwitcher.LI('ul_dms', 'charsheet.html', 'Character Sheet Beta');
    DmSwitcher.LIlogout('ul_dms', 'Logout of DM Tools', 'Hides this toolbar from the website');
  },

  LIdropdown: LIdropdown = function (append_before_id, li_id, _class) {
  		const li = document.createElement('li');
  		li.id = li_id;
  		li.setAttribute('role', 'presentation');
  		li.className = _class;

  		const appendBefore = document.getElementById(append_before_id);
  		appendBefore.parentNode.insertBefore(li, appendBefore);
  },

  A: A = function (append_to_id, _id, _class, _datatoggle, _href, _role, _ariahaspop, _ariaexpanded, _text) {
  		const a = document.createElement('a');
  		a.id = _id;
  		a.className = _class;
  		a.setAttribute('data-toggle', _datatoggle);
  		a.href = _href;
  		a.setAttribute('role', _role);
  		a.setAttribute('aria-haspopup', _ariahaspop);
  		a.setAttribute('aria-expanded', _ariaexpanded);
  		a.innerHTML = _text;

  		const appendTo = document.getElementById(append_to_id);
  		appendTo.appendChild(a);
  },

  UL: UL = function (append_to_id, ul_id, _class) {
		const ul = document.createElement('ul');
		ul.id = ul_id;
		ul.className = _class;

		const appendTo = document.getElementById(append_to_id);
		appendTo.appendChild(ul);
	},

  LI: LI = function (append_to_id, a_href, a_text, a_hash) {
		const hashPart = a_hash ? `#${a_hash}`.toLowerCase() : "";
		$(`#${append_to_id}`)
			.append(`
				<li role="presentation" id="${a_text.toLowerCase().replace(/\s+/g, '')}" data-page="${a_href}${hashPart}">
					<a href="${a_href}${hashPart}">${a_text}</a>
				</li>
			`);
	},

  LIspecial: LIspecial = function (append_to_id, a_href, a_text, a_target, a_title) {
		const $li = `
			<li role="presentation">
				<a href="${a_href}" target="${a_target}" title="${a_title}" class="dropdown-ext-link">
					<span>${a_text}</span>
					<span class="glyphicon glyphicon-log-out"></span>
				</a>
			</li>
		`;

		const $appendTo = $(`#${append_to_id}`);
		$appendTo.append($li);
	},

  LIlogout: LIlogout = function (append_to_id, a_text, a_title) {
    const $li = `
      <li role="presentation">
        <a href="#" onclick="DmSwitcher.logout();" title="${a_title}" class="dropdown-ext-link">
          <span>${a_text}</span>
          <span class="glyphicon glyphicon-log-out"></span>
        </a>
      </li>
    `;

    const $appendTo = $(`#${append_to_id}`);
    $appendTo.append($li);

  },

  logout: logout = function() {
    DmSwitcher.loginBox();
    const dmDropdown = document.getElementById(`dms`);
    dmDropdown.parentNode.removeChild(dmDropdown);
    DmSwitcher.cookie = DmSwitcher.LOGGED_OUT;
    DmSwitcher.showLoginBox();
    return false;
  },

};

//window.addEventListener("load", DmSwitcher.loginBox);
window.addEventListener("load", DmSwitcher.init);

window.addEventListener("unload", function () {
	const title = DmSwitcher.cookie;
	DmSwitcher.createCookie(title);
});
