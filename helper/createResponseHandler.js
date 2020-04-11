/*
* @Author: d4r
* @Date:   2018-01-27 23:54:55
* @Last Modified by:   d4r
* @Last Modified time: 2018-01-28 15:45:50
*/

// const debug = require('debug')('rumaji:helper:createResponseHandler')
if(!global.swaggermaps) throw new Error('global swaggermaps not loaded')

module.exports = function createResponseHandler (name, cb) {
	/*
		response handler 
			expecting 
			- code
			- data
	 */
	return function responseHandler (pre) {
		const {code, data } = pre
		const {responses} = global.swaggermaps[name]
		const message = 
			(pre && pre.message)? pre.message:
			(responses && responses[code])? responses[code].description: 'something went wrong'
		const error = (pre && pre.error)? pre.error: undefined;
		let output = {
			code, 
			message,
			data,
			error,
		}
		cb(output)
	}
}