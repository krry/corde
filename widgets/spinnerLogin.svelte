<!--
	SPINNER LOGIN
	originally devsigned for Talk.Social
-->

<script>
	let spinnerEl;
	let formsShown = {};

	function distanceToElementCenter(event) {
		// animates an element faster as the pointer nears its center
		const elementRect = spinnerEl.getBoundingClientRect();
		const centerX = (elementRect.left + elementRect.right) / 2;
		const centerY = (elementRect.bottom + elementRect.top) / 2;
		const distanceX = event.clientX - centerX;
		const distanceY = event.clientY - centerY;
		const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
		return distance;
	}

	/* to use the whole spectrum of color dynamically */
	// function adjustHSLByPointer (event) {
	// 	const element = event.target;
	// 	const distance = distanceToElementCenter(element, event);
	// 	const hue = distance * 360 % 360;
	// 	const saturation = (distance * 100 % 20) + 60;
	// 	const lightness = 0.64;
	// 	const hsl = `hsl(${hue}, ${saturation * 100}%, ${lightness * 100}%)`;
	// 	return hsl;
	// }

	function chooseFromPaletteByPointer(event) {
		const distance = distanceToElementCenter(event);
		if (distance < window.innerWidth / 4) {
			// if distance is less than 1/4 of the screen width, color the element orange
			return 'var(--red)';
		} else if (distance < window.innerWidth / 3) {
			// if distance is less than 1/3 of the screen width, color the element yellow
			return 'var(--orange)';
		} else if (distance < window.innerWidth / 2) {
			// if distance is less than 1/2 of the screen width, color the element green
			return 'var(--green)';
		} else {
			// if distance is less than 1/1 of the screen width, color the element blue
			return 'var(--green)';
		}
	}

	function spinWithPointer(event) {
		const distance = distanceToElementCenter(event);
		const maxInterval = 999;
		const minInterval = 99;
		const tension = 70000 + distance;
		const interval = Math.max(Math.min(tension / distance, maxInterval), minInterval);
		if (distance > 100) {
			spinnerEl.style.animationDuration = `${interval}ms`;
		}
	}

	function colorWithPointer(event) {
		document.documentElement.style.setProperty('--color-accent', chooseFromPaletteByPointer(event));
	}

	function runAnimation(event) {
		spinnerEl.removeEventListener('mouseenter', runAnimation);
		spinnerEl.style.animationPlayState = 'running';
	}

	function pauseAnimation(event) {
		spinnerEl.style.animationPlayState = 'paused';
	}

	let growth = 1;

	function growSpinner(event) {
		const vector = event.currentTarget.getElementsByTagName('svg')[0];
		const spinning = spinnerEl.style.animationPlayState === 'running';

		event.preventDefault();

		if (growth < 5) {
			vector.style.transform = `scale(${growth})`;
			growth *= 1.0618;
		} else {
			vector.style.transform = 'scale(1)';
			growth = 1;
			document.documentElement.style.setProperty('--fg', 'var(--dark)');
			document.documentElement.style.setProperty('--bg', 'var(--color-accent)');
			document.documentElement.style.setProperty('--chalk', 'var(--light)');
			document.documentElement.style.setProperty('--link', 'var(--chalk)');
		}

		if (spinning) {
			decoupleSpinner();
			spinnerEl.style.animationPlayState = 'paused';
		} else {
			recoupleSpinner();
			spinnerEl.style.animationPlayState = 'running';
		}
	}

	function recoupleSpinner() {
		spinnerEl.style.animationDuration = '99ms';
		runAnimation(spinnerEl);
		document.body.addEventListener('mousemove', spinWithPointer);
	}

	function decoupleSpinner() {
		pauseAnimation(spinnerEl);
		document.body.removeEventListener('mousemove', spinWithPointer);
		spinnerEl.style.animationDuration = 'unset';
	}

	function toggleForm(event) {
		const target = event.currentTarget;
		const formName = target.dataset.form;
		const formEl = document.getElementById(formName);
		if (!formsShown[formName]) {
			formsShown[formName] = true;
			target.classList.add('active');
			formEl.classList.add('shown');
			decoupleSpinner(spinnerEl);
			setTimeout(() => {
				formEl.style.overflow = 'visible';
				const formScrollPoint = formEl.getBoundingClientRect().top + window.scrollY;
				console.log('form scroll point', formScrollPoint);
				document.documentElement.scrollTo(0, formScrollPoint);
				target.blur();
				formEl.getElementsByTagName('input')[0].focus();
			}, 618);
		} else {
			formsShown[formName] = false;
			formEl.style.overflow = 'hidden';
			target.classList.remove('active');
			formEl.classList.remove('shown');
			recoupleSpinner(spinnerEl);
			document.documentElement.scrollTop = 0;
			target.blur();
		}
	}

	// document.addEventListener('DOMContentLoaded', () => {
	window.onload = () => {
		spinnerEl = document.querySelector('#double_smiley');
		document.body.addEventListener('mousemove', spinWithPointer);
		document.body.addEventListener('mousemove', colorWithPointer);
		spinnerEl.addEventListener('mouseenter', runAnimation);
		// document.body.addEventListener('touchmove', runAnimation);
		spinnerEl.addEventListener('click', growSpinner);
		document.getElementById('login_btn').addEventListener('click', toggleForm);
		document.getElementById('signup_btn').addEventListener('click', toggleForm);
	};
</script>
// TODO: convert from erb to svelte
<div class="login-signup row justify-content-center">
  <div class="col-auto text-center">
    <button
      id="login_btn"
      class="btn btn-link btn-lg btn-camo my-2 breathe"
      data-form="login_form"
      title="Which is to say, are you ready to have some really real conversations with real people that you didn't know (or know that well) before?"
      >Returning?</button>
    <%= form_with(
      id: "login_form",
      url: login_url,
      class: "login-form",
      local: true,
    ) do %>
      <div class="row signup_row">
        <div class="col-auto mx-auto">
          <input
            class="form-control form-control-lg w-100 mt-4 mb-2"
            type="text"
            name="username"
            title="Either is fine. We'll send you a login code right away."
            placeholder="Enter your cell # or email"
            required
          />
          <%= submit_tag(
            "Send me a magic login code",
            class: "btn btn-primary btn-lg w-100 mb-2",
            title: "Enter your phone number or email above, and we'll send you a code."
            ) %>
        </div>
      </div>
      <hr class="w-50 my-4 mx-auto">
    <% end %>
  </div>
</div>
<div class="login-signup row justify-content-center mb-5">
  <div class="col-auto text-center">
    <button
      id="signup_btn"
      class="btn btn-link btn-md btn-camo my-3 breathe"
      data-form="signup_form"
      title="Sign up here. You're gonna make soooo many new friends you'll lose count."
      >New here?</button>
    <%= form_with(
      id: "signup_form",
      class: "login-form",
      url: signup_login_url,
      local: true,
      hidden: true,
      ) do %>
      <% unless @is_spark_session %>
        <div class="row">
          <div class="col">
            <input class="form-control form-control-lg" type="text" name="invite_code" placeholder="Invite code" required>
          </div>
        </div>
      <% end %>
      <div class="row mt-2 <%= @allow_guest_mode ? '' : 'floor'%>">
        <div class="col-auto mx-auto">
          <input
            type="text"
            name="user[phone]"
            class="form-control form-control-lg mb-2"
            id="phone_field"
            placeholder="Cell #"
            title="Your mobile number. Allows us to text you magic login codes."
            value="<%= @user&.phone %>"
          />
          <input
            type="text"
            name="user[email]"
            class="form-control form-control-lg mb-2"
            placeholder="Email"
            title="Your email address. No spam, we pinkie swear."
            value="<%= @user&.email %>"
          />
          <input
            type="text"
            name="user[name]"
            class="form-control form-control-lg mb-2"
            placeholder="First Name"
            title="Your first name. What do your friends call you?"
            value="<%= @user&.name %>"
          />
          <input
            type="text"
            name="user[last_name]"
            class="form-control form-control-lg mb-3"
            placeholder="Last Name"
            title="Your last name. Or an initial, if you prefer."
            value="<%= @user&.last_name %>"
          />
          <%= submit_tag(
            "Sign me up",
            class:"btn btn-primary btn-lg",
            title: "Submit sign up. We're so thrilled to have you join us!"
            ) %>
        </div>
      </div>
      <% if @allow_guest_mode %>
        <%= form_with(
          url: signup_login_url,
          id: "guest_form",
          class: "login-form",
          local: true
        ) do %>
          <div class="row mt-3 floor">
            <input type="hidden" name="guest_mode" value="guest">
            <div class="col" id="guest_btn">
              <%= submit_tag(
                "I'd rather join as a guest",
                class: "btn btn-link btn-camo btn-sm mb-4 mx-auto",
                title: "Sign up as a guest. You can always sign up later if you enjoy yourself."
                ) %>
            </div>
          </div>
        <% end %>
      <% end %>
    <% end %>
  </div>
</div>

<style lang="scss">
	@import './variables';

	$theme-colors: (
		'primary': saturate($we-blue, 1.75),
		'secondary': saturate($we-green, 1.5),
		'red': $we-red,
		'orange': $we-orange,
		'green': $we-green,
		'blue': $we-blue,
		'dark': $we-dark,
		'light': $we-light,
	);

	:root {
		@media (prefers-color-scheme: light) {
			--primary: saturate($we-blue, 1.75);
			--fg: var(--dark);
			--bg: var(--light);
		}

		@media (prefers-color-scheme: dark) {
			--primary: lighten(saturate($we-blue, 1.75), 50%);
			--bg: var(--dark);
			--fg: var(--light);
			--red: $we-red-pale;
			--orange: $we-orange-pale;
			--green: $we-green-pale;
			--blue: $we-blue-pale;
		}

		--color-accent: var(--blue);
		--chalk: var(--color-accent);
		--link: inherit;
		--bevel: 0.5em;
		--beat: 618ms;
		--ease: cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	@keyframes breathe {
		0% {
			transform: scale(1);
		}
		33% {
			transform: scale(1.125);
		}
		100% {
			transform: scale(1);
		}
	}

	@keyframes pinwheel {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	html {
		scroll-behavior: smooth;
	}

	body.no-nav {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background-color: var(--bg);
		color: var(--fg);
		filter: brightness(1);
		transition: background-color var(--beat) var(--ease);

		> * {
			z-index: 1;
		}

		a.navbar-brand {
			margin-right: unset;
			margin-top: 10vh;
			// color: var(--fg);
		}

		a.brand-name {
			color: var(--link);
			position: relative;
			z-index: 100;
			transition-property: text-decoration-color, color;
			transition-duration: var(--beat);
			transition-timing-function: var(--ease);
			text-decoration: solid underline;
			text-underline-offset: 4px;
			text-decoration-thickness: 4px;
			text-decoration-color: transparent;
			&:hover {
				color: var(--link);
				text-decoration-color: inherit;
			}
		}
	}

	.spinner {
		display: block;
		position: relative;
		z-index: 0;
		color: var(--chalk);
		transition-property: color, transform;
		transition-duration: var(--beat);
		transition-timing-function: var(--ease);
		animation-name: pinwheel;
		animation-duration: 618ms;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
		animation-direction: normal;
		animation-play-state: paused;
		transform: rotate(0deg);

		svg {
			width: 100%;
		}

		&:hover {
			animation-play-state: running;
		}

		&:hover,
		&:focus {
			color: var(--chalk);
		}
	}

	.breathe {
		animation-name: breathe;
		animation-iteration-count: infinite;
		animation-direction: alternate-reverse;
		animation-duration: 8.57142857s;
		transition-property: color, transform;
		transition-duration: 309ms;
		transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	.login-signup {
		hr {
			border-color: var(--fg);
			opacity: 0.5;
		}

		.btn,
		.btn-lg {
			padding: 0.375em 0.75em;
			border-radius: var(--bevel);
		}

		.btn.btn-camo {
			color: inherit;
			font-size: 32px;
			&.btn-sm {
				font-size: 18px;
			}
			border: 2px solid transparent;
			text-decoration: underline transparent;
			transition: all var(--beat) var(--ease);

			&:hover,
			&:focus {
				color: var(--primary);
				border-color: inherit;
			}

			&:active {
				text-decoration-color: transparent;
			}
		}

		.btn.btn-camo.breathe {
			color: var(--chalk);

			&:hover,
			&:focus {
				color: var(--primary);
				animation-duration: var(--beat);
			}

			&:active,
			&.active {
				background-color: var(--chalk);
				color: var(--bg);
				border-color: inherit;
				animation-play-state: paused;
				transform: scale(1) !important;
			}

			&.active:hover:not(:focus) {
				background-color: var(--primary);
			}
		}

		#signup_btn.breathe:hover,
		#signup_btn.breathe:focus {
			animation-duration: 412ms;
		}

		input.form-control {
			background: var(--bg) !important;
			color: var(--fg) !important;
			border-color: inherit;
			border-width: 2px;
			border-opacity: 0.5;
			border-radius: var(--bevel);
			&::placeholder {
				color: var(--fg) !important;
				opacity: 0.5;
			}
			&:focus {
				border-color: var(--chalk);
				box-shadow: 0 0 0.5em 0.25em var(--chalk);
			}
		}

		.btn-camo,
		.login-form {
			position: relative;
			z-index: 3;
		}

		.login-form {
			max-height: 0;
			overflow: hidden;
			transition-property: max-height;
			transition-duration: 618ms;
			transition-timing-function: cubic-bezier(0.445, 0.05, 0.55, 0.95);

			&.shown {
				max-height: 100vh;
				transition-duration: 927ms;
			}
		}

		.alert {
			position: fixed;
			top: 2rem;
			margin: auto;
			left: 0;
			right: 0;
			text-align: center;
			opacity: 0.9;
			@media screen and (min-width: $media-query-breakpoint-md-1) {
				max-width: 50%;
			}
			.close {
				margin-top: -0.125em;
				color: inherit;
			}
		}

		.floor {
			padding-bottom: 12vh;
		}
	}
</style>
