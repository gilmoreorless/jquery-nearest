// can be overwritten in console
var opts = {
	includeSelf: false,
	checkHoriz: true,
	checkVert: true,
    showGuides: true
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
    
    var $guidePointHoriz = $('#pointHoriz'),
        $guidePointVert  = $('#pointVert'),
        $guidePointDiag  = $('#pointDiag'),
        $guideBlockHoriz = $('#blockHoriz'),
        $guideBlockVert  = $('#blockVert'),
        $guidePointAll   = $('.guidePoint'),
        $guideBlockAll   = $('.guideBlock');
    
    function updatePointGuideDisplay() {
        if (opts.showGuides) {
            $guidePointHoriz.toggle(opts.checkHoriz);
            $guidePointVert.toggle(opts.checkVert);
			$guidePointDiag.toggle(opts.checkHoriz && opts.checkVert);
            opts.checkHoriz || $guideBlockHoriz.hide();
            opts.checkVert  || $guideBlockVert.hide();
        } else {
            $guidePointAll.hide();
            $guideBlockAll.hide();
        }
    }

	// Controls
	$('#menu input').click(function () {
		opts[this.name] = this.checked;
        updatePointGuideDisplay();
	});
    updatePointGuideDisplay();

	// Demo for $.nearest
	//*
	$(document).mousemove(function (e) {
		var x = e.pageX - 1,
			y = e.pageY - 1,
			point = $.extend({x: x, y: y}, opts);
        if (opts.showGuides) {
            opts.checkHoriz && $guidePointHoriz.css({top: y});
            opts.checkVert && $guidePointVert.css({left: x});
        }
		var $nearest = $blocks.removeClass('nearestFilter nearestFind furthestFind')
			.nearest(point)
			.addClass('nearestFilter');
		$.nearest(point, $blocks).addClass('nearestFind');
		$.furthest(point, $blocks).addClass('furthestFind');
		
		// Add an indicator line
		if (opts.showGuides && opts.checkHoriz && opts.checkVert) {
			var $n = $nearest.eq(0),
				off = $n.offset(),
				nx1 = off.left,
				ny1 = off.top,
				nx2 = nx1 + $n.outerWidth(),
				ny2 = ny1 + $n.outerHeight(),
				maxX1 = Math.max(x, nx1),
				minX2 = Math.min(x, nx2),
				maxY1 = Math.max(y, ny1),
				minY2 = Math.min(y, ny2),
				intersectX = minX2 >= maxX1,
				intersectY = minY2 >= maxY1,
				from = {x:x, y:y},
				to = {
					x: intersectX ? x : nx2 < x ? nx2 : nx1,
					y: intersectY ? y : ny2 < y ? ny2 : ny1
				};
			$.line(from, to, {elem:'#pointDiag', lineColor:'red', lineWidth:3}).show();
		}
	});

	// Demo for $.fn.nearest
	$blocks.click(function () {
		var $this = $(this);
        if (opts.showGuides) {
            opts.checkHoriz && $guideBlockHoriz.css({top: $this.css('top'), height: $this.outerHeight()}).show();
            opts.checkVert && $guideBlockVert.css({left: $this.css('left'), width: $this.outerWidth()}).show();
        }
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
