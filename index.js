(function ($) {
	var $doc = $(document);
	var $body = $('body');
	var $demoElems = $('pre, code').filter(':not(pre code)');
	var $demoOverlay;

	var demoInited = false;
	var demoEnabled = false;
	var demoClass = 'demo-nearest';

	function handleMouseMove(e) {
		var point = {
			x: e.pageX,
			y: e.pageY
		};
		$demoElems
			.removeClass(demoClass)
			.nearest(point)
				.addClass(demoClass);
	}

	function toggleDemo(e) {
		demoEnabled = !demoEnabled;
		$doc[demoEnabled ? 'on' : 'off']('mousemove', handleMouseMove);
		if (demoEnabled) {
			if (!demoInited) {
				$headers = $('h1, h2, h3, h4, h5, h6').map(function (i, elem) {
					return $(elem).wrapInner('<span/>').children('span').get();
				});
				$demoElems = $demoElems.add($headers).addClass('demo-set');
				$demoOverlay = $('<div class="demo-overlay"/>').appendTo('#wrapper');
				demoInited = true;
			}
			setTimeout(function(){
				$body.addClass('demo-enabled');
			}, 0);
			if (e) {
				handleMouseMove(e);
			}
		} else {
			$demoElems.removeClass(demoClass);
			$body.removeClass('demo-enabled');
		}
	}

	$doc.on('dblclick', toggleDemo);
})(jQuery);