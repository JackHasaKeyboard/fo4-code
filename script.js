$(document).ready(async function() {
	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async function print(target, tag, str) {
		$(target).append('<' + tag + '></' + tag + '>');

		for (var i = 0; i < str.length; i++) {
			await sleep(20);

			$(target).find(tag + ':last-child').append(str[i]);
		}
	}


	await print('body', 'div', 'Welcome to ROBCO Industries (TM) Termlink');
	await print('body', 'div', ' ');


	$.getJSON('code.json', async function(item) {
		$('body').append('<div id="item"></div>');

		var list = Object.keys(item);

		async function splash() {
			$('#item').empty();

			for (let i = 0; i < list.length; i++) {
				await print('#item', 'a', list[i]);
			}
		}

		splash();

		async function query(cat) {
			$('#item').empty();

			await print('#item', 'div', '=== ' + cat + ' ===');
			await print('#item', 'div', ' ');

			var name = Object.keys(item[cat]);

			var pad = 0;

			for (let i = 0; i < name.length; i++) {
				var entry = name[i];

				if (entry.length > pad) {
					pad = entry.length;
				}
			}

			for (let i = 0; i < name.length; i++) {
				var entry = name[i];
				var code = item[cat][entry];

				await print('#item', 'div', entry + ' '.repeat((pad - entry.length) + 1) + code);
			}
		}


		var i = 0;

		function highlight(i) {
			$('#item a').removeAttr('id');
			$('#item a:nth-child(' + (i + 1) + ')').attr('id', 'active');
		}

		highlight(i);

		$(document).on('mouseover', '#item a', function() {
			var i = $(this).index();

			highlight(i);
		});

		$(document).on('click', 'a', function() {
			i = $(this).index();
			var cat = Object.keys(item)[i];

			query(cat);
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

					query(cat);

					break;

				case 27: // esc
					splash();

					break;
			}

			highlight(i);
		});
	});
});
