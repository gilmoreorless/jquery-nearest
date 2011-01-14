/*!
 * jQuery Nearest plugin v0.1
 *
 * Finds elements closest to a single point based on screen location and pixel dimensions
 *
 * Requires jQuery 1.4 or above
 *
 * Also supports Ben Alman's "each2" plugin for faster looping
 */

/**
 * Method signatures:
 *
 * $.nearest({x, y}, selector) - find $(selector) closest to point [DONE]
 * $(elem).nearest(selector) - find $(selector) closest to elem
 * $(elemSet).nearest({x, y}) - filter $(elemSet) and return closest to point [DONE]
 */
;(function ($, undefined) {
	function nearest(dimensions, selector) {
		selector = selector || '*'; // I STRONGLY recommend passing in a selector
		var $all = $(selector),
			filtered = [],
			minDist = Infinity,
			pointX1 = parseInt(dimensions.x, 10) || 0,
			pointY1 = parseInt(dimensions.y, 10) || 0,
			pointX2 = parseInt(pointX1 + dimensions.w, 10) || pointX1,
			pointY2 = parseInt(pointY1 + dimensions.h, 10) || pointY1,
			hasEach2 = !!$.fn.each2;
		$all[hasEach2 ? 'each2' : 'each'](function (i, elem) {
			var $this = hasEach2 ? elem : $(this),
				off = $this.offset(),
				x = off.left,
				y = off.top,
				w = $this.outerWidth(),
				h = $this.outerHeight(),
				x2 = x + w,
				y2 = y + h,
				compX = x > pointX1 ? x : x2,
				compY = y > pointY1 ? y : y2,
				distX = (x <= pointX1 && x2 >= pointX1) ? 0 : Math.max(compX, pointX1) - Math.min(compX, pointX1),
				distY = (y <= pointY1 && y2 >= pointY1) ? 0 : Math.max(compY, pointY1) - Math.min(compY, pointY1),
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
	}

	/**
	 * @return jQuery object - can be 0 length
	 */
	$.nearest = function (point, selector) {
		if (!point || point.x === undefined || point.y === undefined) {
			return $([]);
		}
		return nearest(point, selector);
	};

	$.fn.nearest = function (selector) {
		if ($.isPlainObject(selector)) {
			return nearest(selector, this);
		}
		var offset = this.offset(),
			dimensions = {
				x: offset.left,
				y: offset.top,
				w: this.outerWidth(),
				h: this.outerHeight()
			};
		// TODO - don't forget to use pushStack for proper chaining
		// THIS DOESN'T WORK PROPERLY YET
		return nearest(dimensions, selector);
	};
})(jQuery);
