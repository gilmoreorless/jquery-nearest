(function($) {
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

	module('$.method', {
		setup: function() {
			this.$elems = $('#qunit-fixture').children();
		}
	});

	module('$.fn.method', {
		setup: function() {
			this.$elems = $('#qunit-fixture').children();
		}
	});

	test('empty set', 2, function () {
		var $set = $('#does-not-exist');
		var $result = $set.nearest();
		equal($result.length, 0, 'returned set is empty');
		notStrictEqual($result, $set, 'returned set is a copy');
	});

	test('correct stack order', 1, function () {
		var $set = this.$elems;
		strictEqual($set.nearest().end(), $set, '.method().end() returns the original set');
	});

	test('methods use dimensions of the first element in a set', 2, function () {
		var $set = $('.corner');
		var $nearest = $set.nearest('.topmid', {tolerance: 0});
		equal($nearest.length, 1, 'only one element is returned');
		equal($nearest[0].id, 'tmtl', 'closest element to the top left is returned');
	});

	/*
	 * Tests to run
	 * -------------
	 *
	 * - util methods
	 *   - .method() returns empty set
	 *   - .method(point) works on divs
	 *   - .method(point, selector) x3
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
	 * - fn methods
	 *   - called on empty set returns an empty set
	 *   - $blah.method().end() === $blah
	 *   - find: .method(selector) x3
	 *   - filter: .method(point) x3
	 *   - option: includeSelf x3
	 */

}(jQuery));
