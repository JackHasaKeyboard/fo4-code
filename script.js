$(document).ready(function() {
	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async function print(c, i, t) {
		await sleep(20 * t);

		$('a:nth-child(' + (i + 1) + ')').append(c);
	}


	$('body').append('<header>Welcome to ROBCO Industries (TM) Termlink</header>');
	$('body').append('<header> </header>');

	$('body').append('<div id="item"></div>');


	$.getJSON('code.json', function(item) {
		function splash() {
			$('#item').empty();

			var l = 0;
			var t = 0;

			Object.keys(item).forEach(function(cat) {
				$('#item').append('<a></a>');

				for (var c = 0; c < cat.length; c++) {
					t += 1;

					print(cat[c], l, t);
				}

				l++;
			});
		}

		splash();


		function query(i) {
			var type = Object.keys(item)[i];
			var code = item[type];

			$('#item').empty();

			// $('#item').append('<a>=== ' + type +' ===</a>');
			// $('#item').append('<a> </a>');

			var maxLen = 0;

			$.each(code, function(el) {
				var len = el.length;

				if (len > maxLen) {
					maxLen = len;
				}
			});

			Object.keys(code).forEach(function(el, i) {
				$('#item').append('<a>' + el + ' <span>' + code[el] + '</span></a>');

				var len = el.length;

				for (s = 0; s < (maxLen - len); s++) {
					$('#item a:nth-child(' + (i + 1) + ') span').before(' ');
				}
			});
		}


		var i = 0;

		function highlight(i) {
			$('a').removeAttr('id');
			$('a:nth-child(' + (i + 1) + ')').attr('id', 'active');
		}

		highlight(i);


		$('a').mouseover(function() {
			var i = $(this).index();

			highlight(i);
		});

		$('a').click(function() {
			var i = $(this).index();

			query(i);
		});

		$(document).keydown(function(e) {
			switch(e.which) {
				case 40: // down arrow
					if (i < (Object.keys(item).length) - 1) {
						i++;
					}

					break;

				case 38: // up arrow
					if (i > 0) {
						i--;
					}

					break;

				case 13: // enter
					i = $('#active').index();
					query(i);

					break;

				case 27: // esc
					splash();

					break;
			}

			highlight(i);
		});
	});
});
