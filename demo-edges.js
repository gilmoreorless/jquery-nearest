$(function () {
	function rand(min, max) {
		return Math.round(Math.random() * (max - min)) + min;
	}

	var elemCount = 30,
		minSize = 50,
		maxSize = 150,
		$document = $(document),
		$menu = $('#menu'),
		$dimSelect = $('#dimension-select'),
		$container = $('#container'),
		$blockWrap = $container.find('.block-wrap'),
		$output = $('#code-output'),
		$footer = $('#footer'),
		menuWidth = $menu.outerWidth(),
		contWidth = $container.width(),
		contHeight = $container.height(),
		footerHeight = $footer.outerHeight(),
		corners = ['tl', 'tr', 'br', 'bl'],
		edgeBorders = {t: 'top', b: 'bottom', l: 'left', r: 'right'},
		edgeLimits = {},
		detectionOptions = {
			edgeX: '',
			edgeY: ''
		},
		codeTemplate = "$('.block').nearest({\n/#props#/\n});",
		i, size, $blocks, $corners, curDrag;

	/*** Drag interactions ***/

	for (i in edgeBorders) if (edgeBorders.hasOwnProperty(i)) {
		edgeLimits[edgeBorders[i]] = {
			limit: parseFloat($container.css(edgeBorders[i])) || 0
		};
		edgeLimits[edgeBorders[i]].current = edgeLimits[edgeBorders[i]].limit;
	}

	// Prevent selecting text while resizing the container
	function noSelect(e) {
		if (curDrag) {
			e.preventDefault();
		}
	}

	// Basic handler for any mouse events on drag handles
	function handleCornerMouseEvents(e) {
		if (e.type === 'mousedown') {
			curDrag = {
				elem: this,
				corner: $(this).data('corner'),
				x: e.pageX,
				y: e.pageY
			};
			$document.on('mousemove', handleCornerMouseEvents);
			return;
		}
		if (e.type === 'mouseup') {
			if (curDrag && curDrag.elem === this) {
				curDrag = null;
				$document.off('mousemove', handleCornerMouseEvents);
			}
			return;
		}
		if (e.type === 'mousemove') {
			if (curDrag) {
				var dx = e.pageX - curDrag.x,
					dy = e.pageY - curDrag.y;

				moveContainerCorner(curDrag.corner, dx, dy);
				curDrag.x = e.pageX;
				curDrag.y = e.pageY;
			}
		}
	}

	// Make sure to catch mouseup outside the drag handles
	function handleDocumentMouseEvents(e) {
		if (e.type === 'mouseup' && curDrag && curDrag.elem !== this) {
			handleCornerMouseEvents.call(curDrag.elem, e);
		}
	}

	// Move a corner of the container by a certain amount
	// x/y are relative, not absolute
	function moveContainerCorner(corner, x, y) {
		var edgeY = edgeBorders[corner[0]],
			edgeX = edgeBorders[corner[1]];
		if (edgeX === 'right') {
			x = -x;
		}
		if (edgeY === 'bottom') {
			y = -y;
		}
		$container.css(edgeX, function (i, val) {
			var limiter = edgeLimits[edgeX];
			limiter.current += x;
			return (limiter.current < limiter.limit) ? limiter.limit : limiter.current;
		});
		$container.css(edgeY, function (i, val) {
			var limiter = edgeLimits[edgeY];
			limiter.current += y;
			return (limiter.current < limiter.limit) ? limiter.limit : limiter.current;
		});
		detectNearest();
	}


	/*** DOM setup ***/

	// Setup corner handles
	$.each(corners, function (i, corner) {
		var c = corner.split('');
		$('<div/>', {
			'class': ['corner', edgeBorders[c[0]], edgeBorders[c[1]]].join(' ')
		}).data('corner', c).appendTo($container);
	});
	$corners = $container.find('.corner');
	$corners.on('mousedown mouseup', handleCornerMouseEvents);
	$document.on({
		selectstart: noSelect,
		mouseup: handleDocumentMouseEvents
	});

	// Setup random elements
	for (i = 0; i < elemCount; i++) {
		size = rand(minSize, maxSize);
		$('<div class="block"><div>' + (i + 1) + '</div></div>').css({
			width: size,
			height: size
		}).appendTo($blockWrap);
	}
	$blocks = $('.block');


	/*** Options interactions ***/

	// Handle edge selector input clicks
	function handleEdgeSelection() {
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
			// TODO: Show middle point with sliders for percentage
		}
		detectionOptions.edgeX = dims[1];
		detectionOptions.edgeY = dims[0];
		detectNearest();
		showExampleCode();
	}

	// Highlight blocks that are nearest to current edge/point
	function detectNearest() {
		var edgeX = detectionOptions.edgeX,
			edgeY = detectionOptions.edgeY,
			opts = {
				container: $container,
				x: 0,
				y: 0,
				w: 0,
				h: 0
			};
		if (edgeX === 'm' && edgeY === 'm') {
			// TODO: Detect from middle point option
		} else {
			opts.x = edgeX === 'r' ? '100%' : 0;
			opts.y = edgeY === 'b' ? '100%' : 0;
			opts.w = edgeX === 'm' ? '100%' : 0;
			opts.h = edgeY === 'm' ? '100%' : 0;
		}
		$blocks.removeClass('nearest').nearest(opts).addClass('nearest');
	}

	// Setup detection handlers
	$dimSelect.on('click', 'input[name=dimension]', handleEdgeSelection);
	$(window).resize(detectNearest);

	// Set initial state based on default checked input
	var $defaultChecked = $dimSelect.find('input:checked');
	if ($defaultChecked.length) {
		handleEdgeSelection.call($defaultChecked[0]);
	}


	/*** Example code ***/

	function generateExampleCode(x, y, w, h) {
		var code = codeTemplate;
		var props = [
			['container', '#container'],
			['x', x],
			['y', y]
		];
		var prop;
		w && props.push(['w', w]);
		h && props.push(['h', h]);
		for (var i = 0, ii = props.length; i < ii; i++) {
			prop = props[i];
			// Really basic string encoding because we're working with known strings
			if (typeof prop[1] == 'string') {
				prop[1] = "'" + prop[1] + "'";
			}
			props[i] = '  ' + prop.join(': ');
		}
		code = code.replace('/#props#/', props.join(',\n'));
		return code;
	}

	function showExampleCode() {
		var edgeX = detectionOptions.edgeX,
			edgeY = detectionOptions.edgeY,
			x = edgeX === 'r' ? '100%' : 0,
			y = edgeY === 'b' ? '100%' : 0,
			w = edgeX === 'm' ? '100%' : 0,
			h = edgeY === 'm' ? '100%' : 0;
		$output.text(generateExampleCode(x, y, w, h));
	}

});
