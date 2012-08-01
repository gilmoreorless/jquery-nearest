$(function () {
	function rand(min, max) {
		return Math.round(Math.random() * (max - min)) + min;
	}

	var elemCount = 30,
		minSize = 50,
		maxSize = 150,
		$menu = $('#menu'),
		$container = $('#container'),
		$blockWrap = $container.find('.block-wrap'),
		$footer = $('#footer'),
		menuWidth = $menu.outerWidth(),
		contWidth = $container.width(),
		contHeight = $container.height(),
		footerHeight = $footer.outerHeight(),
		corners = ['tl', 'tr', 'br', 'bl'],
		edgeBorders = {t: 'top', b: 'bottom', l: 'left', r: 'right'},
		size, $blocks, $corners;

	// Setup corner handles
	$.each(corners, function (i, corner) {
		corner = corner.split('');
		$('<div/>', {
			'class': ['corner', edgeBorders[corner[0]], edgeBorders[corner[1]]].join(' ')
		}).appendTo($container);
	});
	$corners = $container.find('.corner');

	// Setup random elements
	while (elemCount--) {
		size = rand(minSize, maxSize);
		$('<div class="block"><div></div></div>').css({
			width: size,
			height: size
		}).appendTo($blockWrap);
	}
	$blocks = $('.block');

	// Handle edge selector
	$('#dimension-select').on('click', 'input[name=dimension]', function (e) {
		var $this = $(this),
			val = $this.val(),
			dims = val.split(''),
			isMiddle = val === 'mm',
			isCorner = dims[0] !== 'm' && dims[1] !== 'm',
			isEdge = !isMiddle && !isCorner,
			border;

		$container.css('border-color', '#000');
		$corners.css('background-color', '#000');
		if (isEdge) {
			border = edgeBorders[dims[0]] || edgeBorders[dims[1]];
			$container.css('border-' + border + '-color', '#F00');
		} else if (isCorner) {
			border = [edgeBorders[dims[0]], edgeBorders[dims[1]]];
			$corners.filter('.' + border.join('.')).css('background-color', '#F00');
		} else {

		}
	});
});
