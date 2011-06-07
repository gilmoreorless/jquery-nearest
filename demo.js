// can be overwritten in console
var opts = {
	includeSelf: false,
	checkHoriz: true,
	checkVert: true
};

$(function () {
	function rand(min, max) {
		return Math.round(Math.random() * (max - min)) + min;
	}

	// Setup random elements
	var elemCount = 10,
		minSize = 50,
		maxSize = 150,
		$menu = $('#menu'),
		$container = $('#container'),
        menuWidth = $menu.outerWidth(),
		contWidth = $container.width(),
		contHeight = $container.height(),
		size, x, y, $blocks;
	while (elemCount--) {
		size = rand(minSize, maxSize);
		x = rand(menuWidth, contWidth - size);
		y = rand(0, contHeight - size);
		$('<div class="block" />').css({
			width: size,
			height: size,
			left: x,
			top: y
		}).appendTo($container);
	}
	$blocks = $('.block');

	// Controls
	$('#menu input').click(function () {
		opts[this.name] = this.checked;
	});

	// Demo for $.nearest
	//*
	$(document).mousemove(function (e) {
		var x = e.pageX,
			y = e.pageY,
			point = $.extend({x: x, y: y}, opts);
		$blocks.removeClass('nearestFilter nearestFind furthestFind').nearest(point).addClass('nearestFilter');
		$.nearest(point, $blocks).addClass('nearestFind');
		$.furthest(point, $blocks).addClass('furthestFind');
	});

	// Demo for $.fn.nearest
	$blocks.click(function () {
		var $this = $(this);
		$blocks.removeClass('nearestClick furthestClick').text('');
		$this.addClass('nearestClick').text('CLICKED');
		$this.nearest($blocks, opts).addClass('nearestClick').text('nearest');
		$this.furthest($blocks, opts).addClass('furthestClick').text('furthest');
	});
	//*/

	// Test for chaining
	/*
	$('<div/>').css({
		width:1,
		height:1,
		backgroundColor:'#900',
		position:'absolute',
		left:500,
		top:100
	}).appendTo('body');
	$blocks
		.css('backgroundColor','#066')
		.filter(':odd')
			.css('backgroundColor','#0FF')
			.nearest({x:500, y:100})
				.text('Nearest')
				.end()
			.css('color','#F90')
			.end()
		.css('opacity', 0.5);
	//*/
});
