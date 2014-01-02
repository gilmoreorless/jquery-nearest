(function($) {

	/**
	 * Get an x/y point object that accounts for negative offset of #qunit-fixture
	 */
	function getPoint(x, y) {
		var offset = $('#qunit-fixture').offset();
		return {
			x: offset.left + x,
			y: offset.top + y
		};
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

	/*
		======== A Handy Little QUnit Reference ========
		http://api.qunitjs.com/

		Test methods:
			module(name, {[setup][ ,teardown]})
			test(name, callback)
			expect(numberOfAssertions)
			stop(increment)
			start(decrement)
		Test assertions:
			ok(value, [message])
			equal(actual, expected, [message])
			notEqual(actual, expected, [message])
			deepEqual(actual, expected, [message])
			notDeepEqual(actual, expected, [message])
			strictEqual(actual, expected, [message])
			notStrictEqual(actual, expected, [message])
			throws(block, [expected], [message])
	*/

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



	////////// MODULE $.method dimensions //////////

	module('$.method: dimensions');



	////////// MODULE $.method options //////////

	module('$.method: options');


	/*
	 * Tests to run
	 * -------------
	 *
	 * - util methods
	 *   - dimensions
	 *     - point
	 *     - box
	 *     - x: 100%
	 *     - y: 100%
	 *     - w: 100%
	 *     - h: 100%
	 *     - x/y: 50%
	 *     - x/y: 0 + w/h: 100% = return everything
	 *   - options
	 *     - checkHoriz/sameX
	 *     - checkVert/sameY
	 *     - onlyX
	 *     - onlyY
	 *     - tolerance (normal & out-of-bounds)
	 *     - container - percentages
	 *     - container - children
	 */



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
		var $nearest = $set.nearest('.topmid', {tolerance: 0});
		assertSet($nearest, 1, 'tmtl');
	});

	test('basic find usage', 6, function () {
		var $elem = $('#basic-ref');
		var $nearest = $elem.nearest('.basic-group');
		var $furthest = $elem.furthest('.basic-group');
		var $touching = $elem.touching('.basic-group');

		assertSet($nearest, 1, {suffix: 'for nearest'}, 'basic-touching');
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
		var $nearest = $set.nearest(point);
		var $furthest = $set.furthest(point);
		var $touching = $set.touching(point);

		assertSet($nearest, 1, {suffix: 'for nearest'}, 'top-left');
		assertSet($furthest, 1, {suffix: 'for furthest'}, 'bottom-right');
		assertSet($touching, 0, {suffix: 'for touching'});
	});

}(jQuery));
