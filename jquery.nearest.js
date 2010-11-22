/*!
 * jQuery Nearest plugin v0,1
 *
 * Finds elements closest to a single point based on screen location and pixel dimensions
 *
 * Requires jQuery 1.4 or above
 */

/**
 * Method signatures:
 *
 * $.nearest({x, y}, selector) - find $(selector) closest to point
 * $(elem).nearest(selector) - find $(selector) closest to elem
 * $(elemSet).nearest({x, y}) - filter $(elemSet) and return closest to point
 */
;(function ($, undefined) {
	/**
	 * @return jQuery object - can be 0 length
	 */
	$.nearest = function (point, selector) {
		if (!point || point.x === undefined || point.y === undefined) {
			return $([]);
		}
		selector = selector || '*'; // I STRONGLY recommend passing in a selector
		var $all,
			filtered = [],
			minDist = Infinity,
			pointX = parseInt(point.x, 10) || 0,
			pointY = parseInt(point.y, 10) || 0;
		$all = $(selector);
		// TODO - speed improvement using Paul Irish's fast each implementation
		$all.each(function () {
			var $this = $(this),
				off = $this.offset(),
				x = off.left,
				y = off.top,
				w = $this.outerWidth(),
				h = $this.outerHeight(),
				x2 = x + w,
				y2 = y + h,
				compX = x > pointX ? x : x2,
				compY = y > pointY ? y : y2,
				distX = (x <= pointX && x2 >= pointX) ? 0 : Math.max(compX, pointX) - Math.min(compX, pointX),
				distY = (y <= pointY && y2 >= pointY) ? 0 : Math.max(compY, pointY) - Math.min(compY, pointY),
				distT = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
			if (distT < minDist) {
				filtered = [];
				minDist = distT;
			}
			if (distT == minDist) {
				filtered.push(this);
			}
		});
		return $(filtered);
	};

	$.fn.nearest = function (selector) {
		// TODO - don't forget to use pushStack for proper chaining
	};
})(jQuery);
