/**
 * @module utils
 */

/**
 * Browser utilities.
 * @class BrowserUtil
 */
function BrowserUtil() {};
module.exports = BrowserUtil;

/**
 * Utility function to get all query string params.
 * @method getQueryStringParams
 * @static
 * @return {Object} A dictionary containing all current parameters from
 *                  the query string.
 */
BrowserUtil.getQueryStringParams = function() {
	var params = {};
	(function() {

		var match,
			pl = /\+/g, // Regex for replacing addition symbol with a space
			search = /([^&=]+)=?([^&]*)/g,
			decode = function(s) {
				return decodeURIComponent(s.replace(pl, " "));
			},
			query = window.location.search.substring(1).replace(/amp;/g, "");

		while (match = search.exec(query))
			params[decode(match[1])] = decode(match[2]);
	})();

	return params;
}