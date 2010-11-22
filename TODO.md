 * given a selector, find the nearest matching element, based on pixel x/y values
 * work as $.utility (pass in x/y, good for cursor-based calculations) or $.fn.method (work off element's dimensions)
 * if $.fn.method is called with x/y object, make it a wrapper for $.utility(x/y, this) - ie. reverse the logic
   * $.fn.method should have option to include/exclude self
 * (future) add options to only check x or y axis
 * (future) reverse logic and add $.furthest / $.fn.furthest
