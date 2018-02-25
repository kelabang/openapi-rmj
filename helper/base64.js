/*
* @Author: Imam
* @Date:   2018-02-26 00:20:29
* @Last Modified by:   Imam
* @Last Modified time: 2018-02-26 00:22:19
*/
module.exports = {
	encode: (str) => {
		return new Buffer(str).toString('base64')
	},
	decode: (str64) => {
		return new Buffer(str64, 'base64').toString('ascii')
	}
}