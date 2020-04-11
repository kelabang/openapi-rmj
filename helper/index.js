/*
* @Author: d4r
* @Date:   2018-01-28 14:00:57
* @Last Modified by:   Imam
* @Last Modified time: 2018-02-25 23:11:20
*/

const name = 'rumaji:helper';
const Debug = require('debug')

const helper = {
	createResponseHandler: require('./createResponseHandler'),
	getNameCaller: require('./getNameCaller'),
	JWT: require('./JWT'),
	isEmail: require('./isEmail'),
	MailChimp: require('./MailChimp'),
	ISBN: require('./ISBN'),
	getSafely: getSafely,
}

function getSafely (fn, def) {
	const debug = Debug(name+':getSafely')
	try {
		debug('try')
		const output = fn();
		if(typeof output == 'undefined') 
			throw 'is_undefined'
		return output;
	} catch (err) {
		debug('fail')
		return def;
	}
}

module.exports = helper