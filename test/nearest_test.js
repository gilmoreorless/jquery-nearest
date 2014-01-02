(function($) {

	var testUtils = {
		/**
		 * Get an x/y point object that accounts for negative offset of #qunit-fixture
		 */
		getPoint: function (x, y) {
			var offset = $('#qunit-fixture').offset();
			return {
				x: offset.left + x,
				y: offset.top + y
			};
		}
	};

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
		equal($set.length, 0, 'returned set is empty');
	});

	test('one parameter defaults to div', 2, function () {
		var $set = $.nearest(testUtils.getPoint(510, 10)); // point intersects with a span
		equal($set.length, 1, 'one element returned');
		equal($set[0].nodeName, 'DIV', 'one element returned');
	});

	test('basic usage: nearest', 2, function () {
		var $set = $.nearest(testUtils.getPoint(0, 0), '.basic-group');
		equal($set.length, 1, 'one element returned');
		equal($set[0].id, 'basic-ref', 'correct element returned');
	});

	test('basic usage: furthest', 3, function () {
		var $set = $.furthest(testUtils.getPoint(0, 0), '.basic-group');
		equal($set.length, 1, 'one element returned');
		equal($set[0].id, 'basic-furthest', 'correct element returned');

		$set = $.furthest(testUtils.getPoint(10, 10), '#top-left');
		equal($set[0].id, 'top-left', 'touching element returned if it\'s the only match');
	});

	test('basic usage: touching', 4, function () {
		var $set = $.touching(testUtils.getPoint(0, 0));
		equal($set.length, 2, 'one element returned when unfiltered');
		equal($set[0].id, 'qunit-fixture', 'parent element returned when unfiltered');
		equal($set[1].id, 'top-left', 'child element returned when unfiltered');

		$set = $.touching(testUtils.getPoint(0, 0), '.basic-group');
		equal($set.length, 0, 'no elements returned for top left when filtered');
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
		equal($result.length, 0, 'returned set is empty');
		notStrictEqual($result, $set, 'returned set is a copy');
	});

	test('correct stack order', 1, function () {
		var $set = $('.corner');
		strictEqual($set.nearest().end(), $set, '.method().end() returns the original set');
	});

	test('methods use dimensions of the first element in a set', 2, function () {
		var $set = $('.corner');
		var $nearest = $set.nearest('.topmid', {tolerance: 0});
		equal($nearest.length, 1, 'only one element is returned');
		equal($nearest[0].id, 'tmtl', 'closest element to the top left is returned');
	});

	test('basic find usage', 6, function () {
		var $elem = $('#basic-ref');
		var $nearest = $elem.nearest('.basic-group');
		var $furthest = $elem.furthest('.basic-group');
		var $touching = $elem.touching('.basic-group');

		equal($nearest.length, 1, 'only one other element is nearest');
		equal($nearest[0].id, 'basic-touching', 'correct element is nearest');
		equal($furthest.length, 1, 'only one other element is furthest');
		equal($furthest[0].id, 'basic-furthest', 'correct element is furthest');
		equal($touching.length, 1, 'only one other element is touching');
		equal($touching[0].id, 'basic-touching', 'correct element is touching');
	});

	test('option: includeSelf', 5, function () {
		var $elem = $('#basic-ref');
		var $withoutSelf = $elem.nearest('.basic-group');
		var $withSelf = $elem.nearest('.basic-group', {includeSelf: true});

		equal($withoutSelf.length, 1, 'when false, only one other element is nearest');
		equal($withoutSelf[0].id, 'basic-touching', 'correct element is nearest');

		equal($withSelf.length, 2, 'when true, two elements are nearest');
		equal($withSelf[0].id, 'basic-ref', 'original element is nearest');
		equal($withSelf[1].id, 'basic-touching', 'touching element is nearest');
	});

	test('basic filter usage', 5, function () {
		var $set = $('.corner');
		var point = testUtils.getPoint(30, 30);
		var $nearest = $set.nearest(point);
		var $furthest = $set.furthest(point);
		var $touching = $set.touching(point);

		equal($nearest.length, 1, 'only one element is nearest');
		equal($nearest[0].id, 'top-left', 'correct element is nearest');
		equal($furthest.length, 1, 'only one element is furthest');
		equal($furthest[0].id, 'bottom-right', 'correct element is furthest');
		equal($touching.length, 0, 'no elements are touching');
	});

}(jQuery));
