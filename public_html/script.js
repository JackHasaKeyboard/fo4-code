$(document).ready(async function() {
	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async function print(target, tag, str) {
		$(target).append('<' + tag + '></' + tag + '>');

		for (var i = 0; i < str.length; i++) {
			if (crawl) {
				await sleep(20);
			}

			$(target).find(tag + ':last-child').append(str[i]);
		}
	}


	var mode;
	var crawl = true;

	await print('body', 'div', 'Welcome to ROBCO Industries (TM) Termlink');
	await print('body', 'div', ' ');


	$.getJSON('code.json', async function(item) {
		$('body').append('<div id="item"></div>');

		var list = Object.keys(item);

		async function splash() {
			mode = 'splash';

			$('#item').empty();

			crawl = true;

			for (let i = 0; i < list.length; i++) {
				if (mode == 'splash') {
					await print('#item', 'a', '[ ' + list[i] + ' ]');
				}
			}
		}

		splash();

		async function query(list) {
			mode = 'query';

			$('#item').empty();

			crawl = true;

			await print('#item', 'div', '=== ' + list + ' ===');
			await print('#item', 'div', ' ');

			var name = Object.keys(item[list]);

			var pad = 0;

			for (let i = 0; i < name.length; i++) {
				if (mode == 'query') {
					var entry = name[i];

					if (entry.length > pad) {
						pad = entry.length;
					}
				}
			}

			for (let i = 0; i < name.length; i++) {
				var entry = name[i];
				var code = item[list][entry];

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
			i = $(this).index();

			highlight(i);
		});

		$(document).on('click', 'a', function() {
			i = $(this).index();
			var list = Object.keys(item)[i];

			query(list);
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
					var list = Object.keys(item)[i];

					query(list);

					break;

				case 27: // esc
					splash();

					break;

				case 16: // shift
					crawl = false;

					break;
			}

			highlight(i);
		});
	});
});
