 * given a selector, find the nearest matching element, based on pixel x/y values
 * work as $.utility (pass in x/y, good for cursor-based calculations) or $.fn.method (work off element's dimensions)
 * $.fn.method should have option to include/exclude self
 * if $.fn.method is called with x/y object, make it a wrapper for $.utility(x/y, this) - ie. reverse the logic
