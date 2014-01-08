(function($) {

	////////// HELPER FUNCTIONS //////////

	/**
	 * Get an x/y point object that accounts for negative offset of #qunit-fixture
	 */
	function getPoint(x, y) {
		var offset = $('#qunit-fixture').offset();
		return {
			x: typeof x === 'string' ? x : offset.left + x,
			y: typeof y === 'string' ? y : offset.top + y
		};
	}

	/**
	 * Get an x/y/w/h box object that accounts for negative offset of #qunit-fixture
	 */
	function getBox(x, y, w, h) {
		var box = getPoint(x, y);
		box.w = w;
		box.h = h;
		return box;
	}

	/**
	 * Assert the length of a jQuery object, and that the elements have the correct IDs
	 */
	function assertSet($set, length) {
		var ids = Array.prototype.slice.call(arguments, 2);
		var suffix = '';
		if (ids.length && typeof ids[0] === 'object') {
			if (ids[0].suffix) {
				suffix = ids[0].suffix;
			}
			ids.shift();
		}
		var elemStr = length == 1 ? 'element' : 'elements';
		equal($set.length, length, [length, elemStr, 'returned', suffix].join(' '));
		for (var i = 0, ii = ids.length; i < ii; i++) {
			equal($set[i].id, ids[i], ['element at index', i, 'has ID of', ids[i], suffix].join(' '));
		}
	}



	////////// MODULE $.method basic usage //////////

	module('$.method: basic');

	test('empty set', 2, function () {
		var $set = $.nearest();
		ok($set.jquery, 'returned set is a jQuery object');
		assertSet($set, 0);
	});

	test('one parameter defaults to div', 2, function () {
		var $set = $.nearest(getPoint(510, 10)); // point intersects with a span
		assertSet($set, 1);
		equal($set[0].nodeName, 'DIV', 'element is a div');
	});

	test('basic usage: nearest', 2, function () {
		var $set = $.nearest(getPoint(0, 0), '.basic-group');
		assertSet($set, 1, 'basic-ref');
	});

	test('basic usage: furthest', 3, function () {
		var $set = $.furthest(getPoint(0, 0), '.basic-group');
		assertSet($set, 1, 'basic-furthest');

		$set = $.furthest(getPoint(10, 10), '#top-left');
		equal($set[0].id, 'top-left', 'touching element returned if it\'s the only match');
	});

	test('basic usage: touching', 4, function () {
		var $set = $.touching(getPoint(0, 0));
		// Should contain both the parent and child elements
		assertSet($set, 2, {suffix: 'when unfiltered'}, 'qunit-fixture', 'top-left');

		$set = $.touching(getPoint(0, 0), '.basic-group');
		assertSet($set, 0, {suffix: 'when filtered'});
	});

	test('invalid selector', 1, function () {
		assertSet($.nearest(getPoint(0, 0), '#does-not-exist'), 0);
	});



	////////// MODULE $.method dimensions //////////

	module('$.method: dimensions');

	var containerSelector = '#qunit-fixture';
	var dimOpts = {container: containerSelector};

	test('point', 5, function () {
		var $set = $.nearest(getPoint(530, 30), '.top-mid');
		assertSet($set, 4, 'tmtl', 'tmbl', 'tmtr', 'tmbr');
	});

	test('box', 5, function () {
		var $set = $.nearest(getBox(525, 25, 10, 10), '.top-mid');
		assertSet($set, 4, 'tmtl', 'tmbl', 'tmtr', 'tmbr');
	});

	test('x: 100%', 2, function () {
		var $set = $.touching(getPoint('100%', 0), '*', dimOpts);
		assertSet($set, 1, 'top-right');
	});

	test('y: 100%', 2, function () {
		var $set = $.touching(getPoint(0, '100%'), '*', dimOpts);
		assertSet($set, 1, 'bottom-left');
	});

	test('w: 100%', 3, function () {
		var $set = $.touching(getBox(0, 0, '100%', 0), '.corner', dimOpts);
		assertSet($set, 2, 'top-left', 'top-right');
	});

	test('h: 100%', 3, function () {
		var $set = $.touching(getBox(0, 0, 0, '100%'), '.corner', dimOpts);
		assertSet($set, 2, 'top-left', 'bottom-left');
	});

	test('x/h: 100%', 3, function () {
		var $set = $.touching(getBox('100%', 0, 0, '100%'), '.corner', dimOpts);
		assertSet($set, 2, 'top-right', 'bottom-right');
	});

	test('x/y: 50%', 2, function () {
		var $set = $.touching(getPoint('50%', '50%'), '*', dimOpts);
		assertSet($set, 1, 'dead-centre');
	});

	test('x/y: 0 + w/h: 100%', 1, function () {
		var $set = $.touching(getBox(0, 0, '100%', '100%'), '*', dimOpts);
		equal($set.length, $(containerSelector + ' *').length, '0,0 to 100%,100% returns all elements');
	});



	////////// MODULE $.method options //////////

	module('$.method: options', {
		setup: function () {
			this.midPoint = getPoint(250, 750);
			this.midBox = getBox(240, 740, 20, 20);
			this.tolPoint = getPoint(700, 200);
			this.contPoint = getPoint(700, 700);
		}
	});

	// 100,600 -> 400,900 = 300x300; 50% = 250,750
	test('x/y sanity check', 5, function () {
		var $nearest  = $.nearest( this.midPoint, '.xy-group');
		var $furthest = $.furthest(this.midPoint, '.xy-group');
		var $touching = $.touching(this.midPoint, '.xy-group');

		assertSet($nearest,  1, {suffix: 'for nearest'},  'xy-nearest-diag');
		assertSet($furthest, 1, {suffix: 'for furthest'}, 'xy-furthest-diag');
		assertSet($touching, 0, {suffix: 'for touching'});
	});

	test('sameX / checkHoriz', 10, function () {
		var $nearest  = $.nearest( this.midBox, '.xy-group', {sameX: true});
		var $furthest = $.furthest(this.midBox, '.xy-group', {sameX: true});
		var $touching = $.touching(this.midBox, '.xy-group', {sameX: true});

		assertSet($nearest,  1, {suffix: 'for nearest'},  'xy-mid-sameX');
		assertSet($furthest, 1, {suffix: 'for furthest'}, 'xy-mid-sameX');
		assertSet($touching, 0, {suffix: 'for touching'}); // Make sure .touching() is unaffected

		// Old tests for checkHoriz - remove when the option has been removed
		var $nearest2  = $.nearest( this.midBox, '.xy-group', {checkHoriz: false});
		var $furthest2 = $.furthest(this.midBox, '.xy-group', {checkHoriz: false});
		var $touching2 = $.touching(this.midBox, '.xy-group', {checkHoriz: false});

		assertSet($nearest2,  1, {suffix: 'for nearest 2'},  'xy-mid-sameX');
		assertSet($furthest2, 1, {suffix: 'for furthest 2'}, 'xy-mid-sameX');
		assertSet($touching2, 0, {suffix: 'for touching 2'}); // Make sure .touching() is unaffected
	});

	test('sameY / checkVert', 10, function () {
		var $nearest  = $.nearest( this.midBox, '.xy-group', {sameY: true});
		var $furthest = $.furthest(this.midBox, '.xy-group', {sameY: true});
		var $touching = $.touching(this.midBox, '.xy-group', {sameY: true});

		assertSet($nearest,  1, {suffix: 'for nearest'},  'xy-mid-sameY');
		assertSet($furthest, 1, {suffix: 'for furthest'}, 'xy-mid-sameY');
		assertSet($touching, 0, {suffix: 'for touching'}); // Make sure .touching() is unaffected

		// Old tests for checkVert - remove when the option has been removed
		var $nearest2  = $.nearest( this.midBox, '.xy-group', {checkVert: false});
		var $furthest2 = $.furthest(this.midBox, '.xy-group', {checkVert: false});
		var $touching2 = $.touching(this.midBox, '.xy-group', {checkVert: false});

		assertSet($nearest2,  1, {suffix: 'for nearest 2'},  'xy-mid-sameY');
		assertSet($furthest2, 1, {suffix: 'for furthest 2'}, 'xy-mid-sameY');
		assertSet($touching2, 0, {suffix: 'for touching 2'}); // Make sure .touching() is unaffected
	});

	test('sameX / checkHoriz + sameY / checkVert (no match)', 6, function () {
		var $nearest  = $.nearest( this.midBox, '.xy-group', {sameX: true, sameY: true});
		var $furthest = $.furthest(this.midBox, '.xy-group', {sameX: true, sameY: true});
		var $touching = $.touching(this.midBox, '.xy-group', {sameX: true, sameY: true});

		// All methods should act like .touching()
		assertSet($nearest,  0, {suffix: 'for nearest'});
		assertSet($furthest, 0, {suffix: 'for furthest'});
		assertSet($touching, 0, {suffix: 'for touching'});

		// Old tests for checkHoriz + checkVert - remove when the option has been removed
		var $nearest2  = $.nearest( this.midBox, '.xy-group', {checkHoriz: false, checkVert: false});
		var $furthest2 = $.furthest(this.midBox, '.xy-group', {checkHoriz: false, checkVert: false});
		var $touching2 = $.touching(this.midBox, '.xy-group', {checkHoriz: false, checkVert: false});

		// All methods should act like .touching()
		assertSet($nearest2,  0, {suffix: 'for nearest 2'});
		assertSet($furthest2, 0, {suffix: 'for furthest 2'});
		assertSet($touching2, 0, {suffix: 'for touching 2'});
	});

	test('sameX / checkHoriz + sameY / checkVert (match)', 12, function () {
		var point = getPoint(290, 790);
		var $nearest  = $.nearest( point, '.xy-group', {sameX: true, sameY: true});
		var $furthest = $.furthest(point, '.xy-group', {sameX: true, sameY: true});
		var $touching = $.touching(point, '.xy-group', {sameX: true, sameY: true});

		// All methods should act like .touching()
		assertSet($nearest,  1, {suffix: 'for nearest'},  'xy-nearest-diag');
		assertSet($furthest, 1, {suffix: 'for furthest'}, 'xy-nearest-diag');
		assertSet($touching, 1, {suffix: 'for touching'}, 'xy-nearest-diag');

		// Old tests for checkHoriz + checkVert - remove when the option has been removed
		var $nearest2  = $.nearest( point, '.xy-group', {checkHoriz: false, checkVert: false});
		var $furthest2 = $.furthest(point, '.xy-group', {checkHoriz: false, checkVert: false});
		var $touching2 = $.touching(point, '.xy-group', {checkHoriz: false, checkVert: false});

		// All methods should act like .touching()
		assertSet($nearest2,  1, {suffix: 'for nearest 2'},  'xy-nearest-diag');
		assertSet($furthest2, 1, {suffix: 'for furthest 2'}, 'xy-nearest-diag');
		assertSet($touching2, 1, {suffix: 'for touching 2'}, 'xy-nearest-diag');
	});

	test('onlyX', 5, function () {
		var $nearest  = $.nearest( this.midBox, '.xy-group.not-same', {onlyX: true});
		var $furthest = $.furthest(this.midBox, '.xy-group.not-same', {onlyX: true});
		var $touching = $.touching(this.midBox, '.xy-group.not-same', {onlyX: true});

		assertSet($nearest,  1, {suffix: 'for nearest'},  'xy-closeX');
		assertSet($furthest, 1, {suffix: 'for furthest'}, 'xy-right');
		assertSet($touching, 0, {suffix: 'for touching'}); // Make sure .touching() is unaffected
	});

	test('onlyY', 5, function () {
		var $nearest  = $.nearest( this.midBox, '.xy-group.not-same', {onlyY: true});
		var $furthest = $.furthest(this.midBox, '.xy-group.not-same', {onlyY: true});
		var $touching = $.touching(this.midBox, '.xy-group.not-same', {onlyY: true});

		assertSet($nearest,  1, {suffix: 'for nearest'},  'xy-closeY');
		assertSet($furthest, 1, {suffix: 'for furthest'}, 'xy-bottom');
		assertSet($touching, 0, {suffix: 'for touching'}); // Make sure .touching() is unaffected
	});

	test('sameX overrides onlyX', 1, function () {
		var $set = $.nearest(this.midBox, '.xy-group.not-same', {onlyX: true, sameX: true});
		assertSet($set, 0);
	});

	test('sameY overrides onlyY', 1, function () {
		var $set = $.nearest(this.midBox, '.xy-group.not-same', {onlyY: true, sameY: true});
		assertSet($set, 0);
	});

	test('tolerance: 0', 4, function () {
		var $nearest  = $.nearest( this.tolPoint, '.tolerance', {tolerance: 0});
		var $furthest = $.furthest(this.tolPoint, '.tolerance', {tolerance: 0});

		assertSet($nearest,  1, {suffix: 'for nearest'},  'tol-14');
		assertSet($furthest, 1, {suffix: 'for furthest'}, 'tol-16');
	});

	test('tolerance: 0.5', 5, function () {
		var $nearest  = $.nearest( this.tolPoint, '.tolerance', {tolerance: 0.5});
		var $furthest = $.furthest(this.tolPoint, '.tolerance', {tolerance: 0.5});

		assertSet($nearest,  2, {suffix: 'for nearest'},  'tol-14', 'tol-14-and-a-bit');
		assertSet($furthest, 1, {suffix: 'for furthest'}, 'tol-16');
	});

	test('tolerance: 1 (default)', 7, function () {
		var $nearest  = $.nearest( this.tolPoint, '.tolerance');
		var $furthest = $.furthest(this.tolPoint, '.tolerance');

		assertSet($nearest,  3, {suffix: 'for nearest'},  'tol-14', 'tol-14-and-a-bit', 'tol-15');
		assertSet($furthest, 2, {suffix: 'for furthest'}, 'tol-15', 'tol-16');
	});

	test('tolerance: large', 7, function () {
		var $nearest  = $.nearest( this.tolPoint, '.corner', {tolerance: 380});
		var $furthest = $.furthest(this.tolPoint, '.corner', {tolerance: 380});

		assertSet($nearest,  2, {suffix: 'for nearest'},  'top-left', 'top-right');
		assertSet($furthest, 3, {suffix: 'for furthest'}, 'top-left', 'bottom-left', 'bottom-right');
	});

	test('tolerance: out of bounds', 4, function () {
		var $set1 = $.nearest(this.tolPoint, '.tolerance', {tolerance: -1});
		var $set2 = $.nearest(this.tolPoint, '.tolerance', {tolerance: 'not a number'});
		// Negative/invalid numbers reset to 0
		assertSet($set1, 1, 'tol-14');
		assertSet($set2, 1, 'tol-14');
	});

	test('container: percentages', 4, function () {
		var point = {
			x: '25%',
			y: '20%',
			w: '20%',
			h: '30%'
		};
		var $nearest  = $.nearest( point, 'div', {container: '#cont-option-container'});
		var $furthest = $.furthest(point, 'div', {container: '#cont-option-container'});

		assertSet($nearest,  1, 'cont-centre');
		assertSet($furthest, 1, 'cont-top-left');
	});

	test('container: children', 4, function () {
		// Sanity check
		var $out = $.nearest(this.contPoint, '.cont');
		assertSet($out, 1, {suffix: 'without container'}, 'cont-outside');

		// With container option
		var $in = $.nearest(this.contPoint, '.cont', {container: '#cont-option-container'});
		assertSet($in, 1, {suffix: 'with container'}, 'cont-centre');
	});

	test('container: invalid', 1, function () {
		var $set = $.nearest(this.contPoint, '.cont', {container: '#does-not-exist'});
		assertSet($set, 0); // Make sure it doesn't blow up
	});



	////////// MODULE $.fn.method //////////

	module('$.fn.method');

	test('empty set', 2, function () {
		var $set = $('#does-not-exist');
		var $result = $set.nearest();
		assertSet($result, 0);
		notStrictEqual($result, $set, 'returned set is a copy');
	});

	test('correct stack order', 1, function () {
		var $set = $('.corner');
		strictEqual($set.nearest().end(), $set, '.method().end() returns the original set');
	});

	test('methods use dimensions of the first element in a set', 2, function () {
		var $set = $('.corner');
		var $nearest = $set.nearest('.top-mid', {tolerance: 0});
		assertSet($nearest, 1, 'tmtl');
	});

	test('basic find usage', 6, function () {
		var $elem = $('#basic-ref');
		var $nearest  = $elem.nearest( '.basic-group');
		var $furthest = $elem.furthest('.basic-group');
		var $touching = $elem.touching('.basic-group');

		assertSet($nearest,  1, {suffix: 'for nearest'},  'basic-touching');
		assertSet($furthest, 1, {suffix: 'for furthest'}, 'basic-furthest');
		assertSet($touching, 1, {suffix: 'for touching'}, 'basic-touching');
	});

	test('option: includeSelf', 5, function () {
		var $elem = $('#basic-ref');
		var $withoutSelf = $elem.nearest('.basic-group');
		var $withSelf = $elem.nearest('.basic-group', {includeSelf: true});

		assertSet($withoutSelf, 1, {suffix: 'when false'}, 'basic-touching');
		assertSet($withSelf, 2, {suffix: 'when true'}, 'basic-ref', 'basic-touching');
	});

	test('basic filter usage', 5, function () {
		var $set = $('.corner');
		var point = getPoint(30, 30);
		var $nearest  = $set.nearest( point);
		var $furthest = $set.furthest(point);
		var $touching = $set.touching(point);

		assertSet($nearest,  1, {suffix: 'for nearest'},  'top-left');
		assertSet($furthest, 1, {suffix: 'for furthest'}, 'bottom-right');
		assertSet($touching, 0, {suffix: 'for touching'});
	});

}(jQuery));
